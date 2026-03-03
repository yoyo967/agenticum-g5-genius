import { WebSocket } from 'ws';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import { SN00Orchestrator } from '../agents/sn00-orchestrator';
import { Logger } from '../utils/logger';
import { eventFabric } from '../services/event-fabric';

// Tool declaration: voice command → swarm launch
const LAUNCH_SWARM_TOOL = {
  name: 'launch_swarm',
  description:
    'Launch the AGENTICUM G5 AI swarm to execute a marketing campaign directive. ' +
    'Call this whenever the user gives an instruction related to marketing, content creation, ' +
    'campaign strategy, competitor analysis, design, or any operational task.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      intent: {
        type: Type.STRING,
        description: 'The full user directive / campaign brief to pass to the orchestrator.',
      },
      campaignType: {
        type: Type.STRING,
        enum: ['marketing', 'content', 'design', 'research', 'strategy', 'general'],
        description: 'Category of the campaign.',
      },
    },
    required: ['intent'],
  },
};

interface LiveSession {
  session: any; // @google/genai Session
  closing: boolean;
}

export class LiveApiManager {
  private orchestrator: SN00Orchestrator;
  private logger: Logger;
  private ai: GoogleGenAI;
  private activeSessions: Map<WebSocket, LiveSession> = new Map();

  constructor() {
    this.orchestrator = new SN00Orchestrator();
    this.logger = new Logger('LiveApi');

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      this.logger.error('GEMINI_API_KEY not set — Gemini Live API will fail');
    }
    this.ai = new GoogleGenAI({ apiKey: apiKey || '' });
  }

  public async handleConnection(clientWs: WebSocket) {
    this.logger.info('New Neural client connected — opening Gemini Live session');
    import('../services/nexus-manager').then(m =>
      m.nexusManager.updateState({
        activeModule: 'NexusConsole',
        lastCognitiveEvent: 'New Neural Uplink Established',
      })
    );

    let liveSession: any = null;
    let closing = false;

    const sendToClient = (payload: object) => {
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify(payload));
      }
    };

    // ──────────────────────────────────────────────
    // Execute the swarm and stream results back
    // ──────────────────────────────────────────────
    const runSwarm = async (intent: string, campaignId?: string) => {
      import('../services/nexus-manager').then(m =>
        m.nexusManager.updateState({
          currentUserIntent: intent,
          lastCognitiveEvent: `Voice Directive Received: ${intent.substring(0, 40)}...`,
        })
      );

      sendToClient({ type: 'transcript', text: intent, campaignType: campaignId || 'voice' });

      try {
        const result = await this.orchestrator.execute(intent, campaignId || 'Voice-Injection');
        sendToClient({ type: 'output', agentId: 'sn00', data: result });
      } catch (err) {
        this.logger.error('Orchestrator error', err as Error);
        sendToClient({ type: 'error', message: 'Orchestrator failed to process directive.' });
      }
    };

    // ──────────────────────────────────────────────
    // Open Gemini Live session
    // ──────────────────────────────────────────────
    try {
      liveSession = await this.ai.live.connect({
        model: 'gemini-2.0-flash-live-001',
        callbacks: {
          onopen: () => {
            this.logger.info('Gemini Live session opened');
            sendToClient({ type: 'live_ready', message: 'Gemini Live API connected' });
          },

          onmessage: async (msg: any) => {
            // ── Barge-in: model was interrupted by user speaking ──
            const serverContent = msg.serverContent;
            if (serverContent?.interrupted) {
              this.logger.info('Barge-in detected — model interrupted');
              sendToClient({ type: 'barge_in' });
            }

            // ── Audio response from model → forward to frontend ──
            const parts = serverContent?.modelTurn?.parts ?? [];
            for (const part of parts) {
              if (part.inlineData?.mimeType?.startsWith('audio/')) {
                sendToClient({
                  type: 'audio_output',
                  data: part.inlineData.data,
                  mimeType: part.inlineData.mimeType,
                });
              }
              // Text response (e.g. before tool call)
              if (part.text) {
                sendToClient({ type: 'ai_text', text: part.text });
              }
            }

            // ── Function call: launch_swarm triggered ──
            const toolCall = msg.toolCall;
            if (toolCall?.functionCalls?.length) {
              for (const fn of toolCall.functionCalls) {
                if (fn.name === 'launch_swarm') {
                  const args = fn.args as { intent: string; campaignType?: string };
                  this.logger.info(`launch_swarm called: "${args.intent}"`);

                  // Respond to Gemini immediately so the session stays live
                  if (liveSession) {
                    liveSession.sendToolResponse({
                      functionResponses: [
                        {
                          id: fn.id,
                          name: fn.name,
                          response: {
                            output:
                              'Swarm launched. Processing directive in background. Stay on the line.',
                          },
                        },
                      ],
                    });
                  }

                  // Execute swarm async (non-blocking)
                  runSwarm(args.intent, args.campaignType).catch(e =>
                    this.logger.error('runSwarm error', e)
                  );
                }
              }
            }

            // ── Turn complete ──
            if (serverContent?.turnComplete) {
              sendToClient({ type: 'turn_complete' });
            }
          },

          onerror: (err: any) => {
            this.logger.error('Gemini Live error', err);
            sendToClient({ type: 'error', message: 'Gemini Live API error. Reconnecting...' });
          },

          onclose: (ev: any) => {
            this.logger.info(`Gemini Live session closed: code=${ev?.code}`);
            if (!closing) {
              sendToClient({ type: 'live_closed' });
            }
          },
        },
        config: {
          responseModalities: [Modality.AUDIO, Modality.TEXT],
          tools: [{ functionDeclarations: [LAUNCH_SWARM_TOOL] }],
          systemInstruction: {
            parts: [
              {
                text:
                  'You are NEXUS, the voice of AGENTICUM G5 — an elite AI-powered marketing swarm. ' +
                  'You speak confidently, precisely, and with purpose. ' +
                  'When the user gives any marketing, campaign, content, design, or strategy directive, ' +
                  'you MUST call the launch_swarm function to activate the swarm. ' +
                  'Confirm the action briefly, then let the swarm handle execution.',
              },
            ],
          },
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Aoede' },
            },
          },
        },
      });
    } catch (err) {
      this.logger.error('Failed to open Gemini Live session', err as Error);
      sendToClient({ type: 'error', message: 'Failed to connect to Gemini Live API.' });
      return;
    }

    // Store session for cleanup
    this.activeSessions.set(clientWs, { session: liveSession, closing: false });

    // ──────────────────────────────────────────────
    // Handle incoming WebSocket messages from frontend
    // ──────────────────────────────────────────────
    clientWs.on('message', async (rawData: any) => {
      try {
        const message = JSON.parse(rawData.toString());

        // Text directive (non-voice fallback path)
        if (message.type === 'start') {
          import('../services/nexus-manager').then(m =>
            m.nexusManager.updateState({
              currentUserIntent: message.input,
              lastCognitiveEvent: `Directive Received: ${(message.input || '').substring(0, 30)}...`,
            })
          );
          await runSwarm(message.input || 'Initial brief', message.campaignId);
          return;
        }

        // PCM16 audio from browser microphone → forward to Gemini Live
        if (message.type === 'realtime_input' && message.data) {
          if (liveSession) {
            liveSession.sendRealtimeInput({
              audio: {
                data: message.data, // already base64 from frontend
                mimeType: 'audio/pcm;rate=16000',
              },
            });
          }
          return;
        }

        // Client content (text turn sent to model)
        if (message.type === 'client_content' && message.text) {
          if (liveSession) {
            liveSession.sendClientContent({
              turns: [{ role: 'user', parts: [{ text: message.text }] }],
              turnComplete: true,
            });
          }
          return;
        }
      } catch (err: any) {
        this.logger.error('Error processing WebSocket frame', err);
      }
    });

    // ──────────────────────────────────────────────
    // Cleanup on disconnect
    // ──────────────────────────────────────────────
    clientWs.on('close', () => {
      this.logger.info('Client disconnected — closing Gemini Live session');
      closing = true;
      if (liveSession) {
        try {
          liveSession.close();
        } catch (_) {}
      }
      this.activeSessions.delete(clientWs);
    });
  }
}
