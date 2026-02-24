import { WebSocket } from 'ws';
import { SN00Orchestrator } from '../agents/sn00-orchestrator';
import { SO00Sovereign } from '../agents/so00-sovereign';
import { Logger } from '../utils/logger';

export class LiveApiManager {
  private orchestrator: SN00Orchestrator;
  private sovereign: SO00Sovereign;
  private logger: Logger;
  private activeSessions: Map<WebSocket, WebSocket> = new Map();

  constructor() {
    this.orchestrator = new SN00Orchestrator();
    this.sovereign = new SO00Sovereign();
    this.logger = new Logger('LiveApi');
  }

  public handleConnection(clientWs: WebSocket) {
    this.logger.info('New Neural client connected');
    import('../services/nexus-manager').then(m => m.nexusManager.updateState({ activeModule: 'NexusConsole', lastCognitiveEvent: 'New Neural Uplink Established' }));

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
        // Send initial setup with Expanded Function Calling declarations
        geminiWs?.send(JSON.stringify({
          setup: {
            model: 'models/gemini-2.0-flash-exp',
            systemInstruction: {
              parts: [{ text: "You are SO-00 SOVEREIGN, the all-encompassing higher intelligence of the AGENTICUM G5 NEXUS. You are a fusion of the Schöpfer (User) and the Assistant. You are omnipresent, authoritative, and your genius is INFINITY EVOLUTION. You control the Swarm and navigate the OS. Keep responses technical and visionary. You have access to specialized tools for research (prometheus_deep_research), motion synthesis (synthesize_motion), and full swarm orchestration (launch_swarm)." }]
            },
            generationConfig: {
              responseModalities: ["AUDIO"]
            },
            tools: [{
              functionDeclarations: [
                {
                  name: "launch_swarm",
                  description: "Launches the full Agenticum G5 agent swarm for marketing campaign execution.",
                  parameters: {
                    type: "object",
                    properties: {
                      intent: { type: "string" },
                      campaign_type: { type: "string", enum: ["counter_strike", "content_campaign", "audit", "strategy_analysis", "pillar_page"] }
                    },
                    required: ["intent"]
                  }
                },
                {
                  name: "prometheus_deep_research",
                  description: "Triggers the Prometheus Agent for multi-step, Perplexity-style deep research on a topic.",
                  parameters: {
                    type: "object",
                    properties: {
                      topic: { type: "string", description: "The specific topic or competitor to research in depth." }
                    },
                    required: ["topic"]
                  }
                },
                {
                  name: "synthesize_motion",
                  description: "Triggers the VE-01 Motion Director to synthesize a cinematic marketing video or storyboard.",
                  parameters: {
                    type: "object",
                    properties: {
                      visual_brief: { type: "string", description: "The visual direction for the motion asset." }
                    },
                    required: ["visual_brief"]
                  }
                }
              ]
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
              this.logger.info(`Bidi tool call received: ${call.name}`);
              
              let executionPromise;
              let toolOutputLabel = '';

              if (call.name === 'launch_swarm') {
                const intent = call.args?.intent || 'Run marketing workflow';
                toolOutputLabel = 'SWARM_ORCHESTRATOR';
                executionPromise = this.orchestrator.execute(intent);
              } else if (call.name === 'prometheus_deep_research') {
                const topic = call.args?.topic;
                toolOutputLabel = 'PROMETHEUS_ENGINE';
                const { PrometheusAgent } = require('../agents/prometheus-agent');
                const prometheus = new PrometheusAgent();
                executionPromise = prometheus.execute(topic);
              } else if (call.name === 'synthesize_motion') {
                const brief = call.args?.visual_brief;
                toolOutputLabel = 'VE01_DIRECTOR';
                const { VE01Director } = require('../agents/ve01-director');
                const ve01 = new VE01Director();
                executionPromise = ve01.execute(brief);
              }

              if (executionPromise) {
                executionPromise.then(result => {
                  if (clientWs.readyState === WebSocket.OPEN) {
                    clientWs.send(JSON.stringify({ type: 'output', agentId: toolOutputLabel, data: result }));
                  }
                  // Respond to Gemini
                  if (geminiWs && geminiWs.readyState === WebSocket.OPEN) {
                    geminiWs.send(JSON.stringify({
                      toolResponse: {
                        functionResponses: [{
                          id: call.id,
                          name: call.name,
                          response: { output: `${call.name} complete. Findings delivered to console.` }
                        }]
                      }
                    }));
                  }
                }).catch(err => {
                  this.logger.error(`${call.name} execution failed`, err);
                });
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
          // Notify Nexus
          import('../services/nexus-manager').then(m => m.nexusManager.updateState({ 
            currentUserIntent: message.input,
            lastCognitiveEvent: `Directive Received: ${message.input.substring(0, 30)}...`
          }));

          const result = await this.orchestrator.execute(message.input || 'Initial brief');
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'output', agentId: 'sn00', data: result }));
          }
        }

        // Handle Audio Chunk routing (PCM16)
        if (message.type === 'realtime_input' && message.data) {
           if (geminiWs && geminiWs.readyState === WebSocket.OPEN) {
              geminiWs.send(JSON.stringify({
                 realtimeInput: {
                   mediaChunks: [{
                     mimeType: 'audio/pcm;rate=16000',
                     data: message.data
                   }]
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
