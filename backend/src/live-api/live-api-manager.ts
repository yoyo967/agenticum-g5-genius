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
        // Send initial setup with Function Calling declarations
        geminiWs?.send(JSON.stringify({
          setup: {
            model: 'models/gemini-2.0-flash-exp',
            systemInstruction: {
              parts: [{ text: "You are SN-00, the master orchestrator of the Agenticum G5 GENIUS swarm — a J.A.R.V.I.S.-grade AI for enterprise marketing. Keep spoken responses concise and authoritative. When the user requests any campaign, content creation, competitor analysis, audit, or agent workflow, ALWAYS call the launch_swarm function. Confirm the action verbally after calling it." }]
            },
            generationConfig: {
              responseModalities: ["AUDIO"]
            },
            tools: [{
              functionDeclarations: [{
                name: "launch_swarm",
                description: "Launches the Agenticum G5 agent swarm with a specific marketing directive. Call this whenever the user requests campaigns, content creation, competitor analysis, audits, or any agent-based marketing workflow.",
                parameters: {
                  type: "object",
                  properties: {
                    intent: {
                      type: "string",
                      description: "The full marketing directive or goal the user wants to execute"
                    },
                    campaign_type: {
                      type: "string",
                      enum: ["counter_strike", "content_campaign", "audit", "strategy_analysis", "pillar_page"],
                      description: "The type of workflow to launch"
                    }
                  },
                  required: ["intent"]
                }
              }]
            }]
          }
        }));
      });

      geminiWs.on('message', (data: any) => {
        try {
          const response = JSON.parse(data.toString());

          // Forward audio output to frontend
          if (response.serverContent?.modelTurn?.parts) {
            const parts = response.serverContent.modelTurn.parts;
            for (const part of parts) {
              if (part.inlineData && part.inlineData.data) {
                if (clientWs.readyState === WebSocket.OPEN) {
                  clientWs.send(JSON.stringify({
                    type: 'realtime_output',
                    mimeType: part.inlineData.mimeType,
                    data: part.inlineData.data
                  }));
                }
              }
            }
          }

          // J.A.R.V.I.S. TRIGGER: Handle function calls from Gemini
          if (response.toolCall?.functionCalls?.length > 0) {
            for (const call of response.toolCall.functionCalls) {
              if (call.name === 'launch_swarm') {
                const intent: string = call.args?.intent || 'Run marketing workflow';
                const campaignType: string = call.args?.campaign_type || 'content_campaign';
                this.logger.info(`Voice directive received: "${intent}" [${campaignType}]`);

                // Notify frontend: voice command was recognized
                if (clientWs.readyState === WebSocket.OPEN) {
                  clientWs.send(JSON.stringify({
                    type: 'transcript',
                    role: 'user',
                    text: intent,
                    campaignType
                  }));
                }

                // Fire the swarm — non-blocking
                this.orchestrator.execute(intent).then(result => {
                  if (clientWs.readyState === WebSocket.OPEN) {
                    clientWs.send(JSON.stringify({ type: 'output', agentId: 'sn-00', data: result }));
                  }
                }).catch(err => {
                  this.logger.error('Swarm execution failed', err);
                });

                // Respond to Gemini so it continues speaking
                if (geminiWs && geminiWs.readyState === WebSocket.OPEN) {
                  geminiWs.send(JSON.stringify({
                    toolResponse: {
                      functionResponses: [{
                        id: call.id,
                        name: call.name,
                        response: { output: `Swarm activated. Executing directive: ${intent}` }
                      }]
                    }
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

    // Event Fabric handles global status/broadcasts.
    // Individual clients can still listen for direct outputs.

    clientWs.on('message', async (data: any) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === 'start') {
          const result = await this.orchestrator.execute(message.input || 'Initial brief');
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'output', agentId: 'sn-00', data: result }));
          }
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
