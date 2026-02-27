import { WebSocket } from 'ws';
import { SN00Orchestrator } from '../agents/sn00-orchestrator';
import { SO00Sovereign } from '../agents/so00-sovereign';
import { Logger } from '../utils/logger';
import { SpeechClient } from '@google-cloud/speech';

export class LiveApiManager {
  private orchestrator: SN00Orchestrator;
  private logger: Logger;
  private activeSessions: Map<WebSocket, any> = new Map();
  private speechClient: SpeechClient;

  constructor() {
    this.orchestrator = new SN00Orchestrator();
    this.logger = new Logger('LiveApi');
    // Initializes the SpeechClient natively inheriting Cloud Run Service Account credentials
    this.speechClient = new SpeechClient();
  }

  public handleConnection(clientWs: WebSocket) {
    this.logger.info('New Neural client connected');
    import('../services/nexus-manager').then(m => m.nexusManager.updateState({ activeModule: 'NexusConsole', lastCognitiveEvent: 'New Neural Uplink Established' }));

    const sessionData: any = {
      recognizeStream: null,
      processing: false
    };
    
    this.activeSessions.set(clientWs, sessionData);

    const request = {
      config: {
        encoding: 'LINEAR16' as const,
        sampleRateHertz: 16000,
        languageCode: 'de-DE', // Prioritizing German as primary per user context, fallback English
        alternativeLanguageCodes: ['en-US'],
      },
      interimResults: false, // We only want finalized sentences to trigger the orchestrator
    };

    const startSpeechStream = () => {
      if (sessionData.recognizeStream) {
        sessionData.recognizeStream.end();
        sessionData.recognizeStream.removeAllListeners();
      }
      
      sessionData.recognizeStream = this.speechClient.streamingRecognize(request)
        .on('error', (err: any) => {
           this.logger.error('Speech recognition error: ', err);
           if (err.code === 11) { // 11 means OUT_OF_RANGE (API duration limit hit, restart)
             startSpeechStream();
           }
        })
        .on('data', async (data: any) => {
          if (data.results[0] && data.results[0].alternatives[0]) {
             const transcript = data.results[0].alternatives[0].transcript;
             if (transcript && transcript.trim().length > 0) {
                 this.logger.info(`Voice Transcript Decoded: "${transcript}"`);
                 
                 // Beam the recognized text back to the frontend console
                 if (clientWs.readyState === WebSocket.OPEN) {
                    clientWs.send(JSON.stringify({
                       type: 'transcript',
                       text: transcript,
                       campaignType: 'auto'
                    }));
                 }
                 
                 // Trigger Orchestrator automatically based on the decoded voice command
                 import('../services/nexus-manager').then(m => m.nexusManager.updateState({ 
                    currentUserIntent: transcript,
                    lastCognitiveEvent: `Voice Directive Received: ${transcript.substring(0, 30)}...`
                 }));

                 try {
                     const result = await this.orchestrator.execute(transcript, 'Voice-Injection');
                     if (clientWs.readyState === WebSocket.OPEN) {
                        clientWs.send(JSON.stringify({ type: 'output', agentId: 'sn00', data: result }));
                     }
                 } catch (err) {
                    this.logger.error('Failed to execute voice directive', err as Error);
                    if (clientWs.readyState === WebSocket.OPEN) {
                        clientWs.send(JSON.stringify({ type: 'error', message: 'Orchestrator failed to process voice directive.' }));
                    }
                 }
             }
          }
        });
    };

    // Initialize the stream listening exactly upon connection setup
    startSpeechStream();

    clientWs.on('message', async (data: any) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === 'start') {
          import('../services/nexus-manager').then(m => m.nexusManager.updateState({ 
            currentUserIntent: message.input,
            lastCognitiveEvent: `Directive Received: ${message.input.substring(0, 30)}...`
          }));

          const result = await this.orchestrator.execute(message.input || 'Initial brief', message.campaignId);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'output', agentId: 'sn00', data: result }));
          }
        }

        // The frontend GenIUSConsole streams Web Audio Worklet PCM16 chunks continually while IsRecording = true
        if (message.type === 'realtime_input' && message.data) {
           if (sessionData.recognizeStream && !sessionData.recognizeStream.destroyed) {
              sessionData.recognizeStream.write(Buffer.from(message.data, 'base64'));
           }
        }
      } catch (err: any) {
        this.logger.error('Error processing WebSocket frame', err);
      }
    });

    clientWs.on('close', () => {
      this.logger.info('Client disconnected, closing Voice and Data session.');
      if (sessionData.recognizeStream) {
         sessionData.recognizeStream.end();
      }
      this.activeSessions.delete(clientWs);
    });
  }
}
