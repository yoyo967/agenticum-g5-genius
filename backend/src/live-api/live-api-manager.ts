import { WebSocket } from 'ws';
import { SN00Orchestrator } from '../agents/sn00-orchestrator';
import { Logger } from '../utils/logger';

export class LiveApiManager {
  private orchestrator: SN00Orchestrator;
  private logger: Logger;
  private activeSessions: Map<WebSocket, WebSocket> = new Map();

  constructor() {
    this.orchestrator = new SN00Orchestrator();
    this.logger = new Logger('LiveApi');
  }

  public handleConnection(clientWs: WebSocket) {
    this.logger.info('New Neural client connected');

    // Establish the upstream connection to Gemini Live via raw WebSockets for maximum stability
    const apiKey = process.env.GEMINI_API_KEY;
    let geminiWs: WebSocket | null = null;
    
    if (!apiKey) {
      this.logger.error('GEMINI_API_KEY missing. Audio streaming will fail.', new Error('No Key'));
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({ type: 'error', message: 'API Key missing for audio streaming. Falling back to text orchestrator.' }));
      }
      // DO NOT RETURN. Let the text-based workflow still attach.
    } else {
      const host = 'generativelanguage.googleapis.com';
      const path = '/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent';
      const uri = `wss://${host}${path}?key=${apiKey}`;

      geminiWs = new WebSocket(uri);
      this.activeSessions.set(clientWs, geminiWs);

      geminiWs.on('open', () => {
        this.logger.info('Upstream Gemini Live WS Opened.');
        // Send initial setup
        geminiWs?.send(JSON.stringify({
          setup: {
            model: 'models/gemini-2.0-flash-exp',
            systemInstruction: {
              parts: [{ text: "You are the Agenticum G5 GENIUS Orchestrator. Keep your spoken responses concise, highly intelligent, and authoritative. Respond enthusiastically to creative marketing briefs." }]
            },
            generationConfig: {
              responseModalities: ["AUDIO"]
            }
          }
        }));
      });

      geminiWs.on('message', (data: any) => {
        try {
          const response = JSON.parse(data.toString());
          if (response.serverContent?.modelTurn?.parts) {
            const parts = response.serverContent.modelTurn.parts;
            for (const part of parts) {
              if (part.inlineData && part.inlineData.data) {
                if (clientWs.readyState === WebSocket.OPEN) {
                  clientWs.send(JSON.stringify({
                    type: 'realtime_output',
                    mimeType: part.inlineData.mimeType,
                    data: part.inlineData.data // base64
                  }));
                }
              }
            }
          }
        } catch (e) {
          console.error('Error parsing upstream message', e);
        }
      });

      geminiWs.on('error', (err) => {
        this.logger.error('Upstream Gemini Live error', err);
      });
    }

    // Pipe Swarm Statuses to Frontend
    this.orchestrator.onStatusUpdate = (status) => {
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({ type: 'status', agent: status }));
      }
    };

    this.orchestrator.onBroadcast = (message) => {
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify(message));
      }
    };

    clientWs.on('message', async (data: any) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === 'start') {
          // Trigger the standard OS Chat logic (text workflow)
          clientWs.send(JSON.stringify({ type: 'status', agent: this.orchestrator.getStatus() }));
          const result = await this.orchestrator.execute(message.input || 'Initial brief');
          clientWs.send(JSON.stringify({ type: 'output', agentId: 'sn-00', data: result }));
          clientWs.send(JSON.stringify({ type: 'status', agent: this.orchestrator.getStatus() }));
        }

        // Handle Audio Chunk routing
        if (message.type === 'realtime_input' && message.data) {
           if (geminiWs && geminiWs.readyState === WebSocket.OPEN) {
              geminiWs.send(JSON.stringify({
                 clientContent: {
                   turns: [{
                     role: "user",
                     parts: [{
                       inlineData: {
                         mimeType: `audio/pcm;rate=${message.sampleRate || 16000}`,
                         data: message.data
                       }
                     }]
                   }],
                   turnComplete: true
                 }
              }));
           }
        }
      } catch (err: any) {
        this.logger.error('Error processing message', err);
        if (clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(JSON.stringify({ type: 'error', message: 'Internal processing error' }));
        }
      }
    });

    clientWs.on('close', () => {
      this.logger.info('Client disconnected, terminating Gemini WebSockets');
      if (geminiWs && geminiWs.readyState !== WebSocket.CLOSED) {
        geminiWs.terminate();
      }
      this.activeSessions.delete(clientWs);
    });
  }
}
