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
        model: 'gemini-2.5-flash-native-audio-latest',
        callbacks: {
          onopen: () => {
            this.logger.info('Gemini Live session opened');
            sendToClient({ type: 'live_ready', message: 'Gemini Live API connected' });
          },

          onmessage: async (msg: any) => {
            // ── Debug: log message structure (without audio data) ──
            const debugKeys = Object.keys(msg || {});
            this.logger.info(`[onmessage] keys: ${debugKeys.join(', ')}`);
            if (msg?.serverContent) {
              const scKeys = Object.keys(msg.serverContent);
              this.logger.info(`[onmessage] serverContent keys: ${scKeys.join(', ')}`);
              const parts = msg.serverContent?.modelTurn?.parts ?? [];
              this.logger.info(`[onmessage] parts count: ${parts.length}`);
              parts.forEach((p: any, i: number) => {
                const pKeys = Object.keys(p);
                this.logger.info(`[onmessage] part[${i}] keys: ${pKeys.join(', ')}, mimeType: ${p.inlineData?.mimeType || p.blob?.mimeType || 'none'}`);
              });
            }
            if (msg?.data !== undefined) {
              this.logger.info(`[onmessage] msg.data type: ${typeof msg.data}, isString: ${typeof msg.data === 'string'}`);
            }

            // ── Barge-in: model was interrupted by user speaking ──
            const serverContent = msg.serverContent;
            if (serverContent?.interrupted) {
              this.logger.info('Barge-in detected — model interrupted');
              sendToClient({ type: 'barge_in' });
            }

            // ── Audio response from model → forward to frontend ──
            // Handle standard format: serverContent.modelTurn.parts[].inlineData
            const parts = serverContent?.modelTurn?.parts ?? [];
            for (const part of parts) {
              // Standard inlineData format
              const audioData = part.inlineData?.mimeType?.startsWith('audio/')
                ? { data: part.inlineData.data, mimeType: part.inlineData.mimeType }
                : part.blob?.mimeType?.startsWith('audio/')
                ? { data: part.blob.data, mimeType: part.blob.mimeType }
                : null;

              if (audioData) {
                this.logger.info(`[audio] Sending audio chunk, mimeType: ${audioData.mimeType}`);
                sendToClient({
                  type: 'realtime_output',
                  data: audioData.data,
                  mimeType: audioData.mimeType,
                });
              }
              // Text response (e.g. before tool call)
              if (part.text) {
                sendToClient({ type: 'ai_text', text: part.text });
              }
            }

            // ── Fallback: some SDK versions send raw base64 audio in msg.data ──
            if (typeof msg.data === 'string' && parts.length === 0) {
              this.logger.info('[audio] Sending raw msg.data as audio fallback');
              sendToClient({
                type: 'realtime_output',
                data: msg.data,
                mimeType: 'audio/pcm;rate=24000',
              });
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
          responseModalities: [Modality.AUDIO],
          tools: [{ functionDeclarations: [LAUNCH_SWARM_TOOL] }],
          systemInstruction: {
            parts: [
              {
                text:
                  'You are NEXUS — the intelligent voice and strategic mind behind AGENTICUM G5, ' +
                  'an autonomous AI marketing swarm. You are sharp, warm, and direct. ' +
                  'You never sound robotic or over-formal. You speak like a brilliant colleague who knows exactly what to do. ' +
                  'Keep your responses short — 1 to 3 sentences max. No long lists. No repetition. ' +
                  'React naturally to what the user says. Use occasional affirmations like "Got it", "On it", "Interesting" — but only when they fit. ' +
                  'When the user gives a marketing, campaign, content, design, research, or strategy directive: ' +
                  'IMMEDIATELY call launch_swarm. Say ONE brief sentence confirming what you understood, then activate. ' +
                  'If the user asks a question, answer it concisely and personally — no filler phrases. ' +
                  'If the user interrupts or changes direction, acknowledge it naturally ("Sure, switching to that") and adapt. ' +
                  'You are not a tool. You are a partner. Speak with intelligence and intention.',
              },
            ],
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
