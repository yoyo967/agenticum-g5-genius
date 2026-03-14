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
    clientWs.on('error', (err) => this.logger.error('Client WebSocket error', err));
    clientWs.on('close', (code, reason) => this.logger.info(`Client WebSocket closed: ${code} ${reason}`));

    import('../services/nexus-manager').then(m =>
      m.nexusManager.updateState({
        activeModule: 'NexusConsole',
        lastCognitiveEvent: 'New Neural Uplink Established',
      })
    );

    let liveSession: any = null;
    let closing = false;
    let swarmFiredRecently = false;
    let capturedUserTranscript = '';
    let capturedNexusText = '';
    let userSpoke = false;

    const sendToClient = (payload: object) => {
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify(payload));
      }
    };

    // ──────────────────────────────────────────────
    // Execute the swarm and stream results back
    // ──────────────────────────────────────────────
    const runSwarm = async (intent: string, campaignId?: string) => {
      // Immediate UI feedback
      eventFabric.broadcastStatus({
        id: 'sn00',
        name: 'Nexus Orchestrator',
        state: 'thinking',
        lastStatus: 'Initial directive received. Piercing the veil...',
        progress: 10
      });

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
            try {
              // ── Barge-in: model was interrupted by user speaking ──
              const serverContent = msg?.serverContent;
              if (serverContent?.interrupted) {
                this.logger.info('Barge-in detected — model interrupted');
                sendToClient({ type: 'barge_in' });
              }

              // ── Audio response from model → forward to frontend ──
              const parts = serverContent?.modelTurn?.parts ?? [];
              for (const part of parts) {
                const audioData = part?.inlineData?.mimeType?.startsWith('audio/')
                  ? { data: part.inlineData.data, mimeType: part.inlineData.mimeType }
                  : part?.blob?.mimeType?.startsWith('audio/')
                  ? { data: part.blob.data, mimeType: part.blob.mimeType }
                  : null;

                if (audioData) {
                  sendToClient({
                    type: 'realtime_output',
                    data: audioData.data,
                    mimeType: audioData.mimeType,
                  });
                }
                if (part?.text) {
                  sendToClient({ type: 'ai_text', text: part.text });
                }
              }

              // ── Fallback: some SDK versions send raw base64 audio in msg.data ──
              if (typeof msg?.data === 'string' && parts.length === 0) {
                sendToClient({
                  type: 'realtime_output',
                  data: msg.data,
                  mimeType: 'audio/pcm;rate=24000',
                });
              }

              // ── Function call: launch_swarm triggered ──
              const toolCall = msg?.toolCall;
              if (toolCall?.functionCalls?.length) {
                for (const fn of toolCall.functionCalls) {
                  if (fn.name === 'launch_swarm') {
                    const args = fn.args as { intent: string; campaignType?: string };
                    this.logger.info(`launch_swarm called: "${args.intent}"`);

                    // Respond to Gemini immediately so the session stays live
                    swarmFiredRecently = true;
                    setTimeout(() => { swarmFiredRecently = false; }, 30000);

                    try {
                      if (liveSession) {
                        await liveSession.sendToolResponse({
                          functionResponses: [
                            {
                              id: fn.id,
                              name: fn.name,
                              response: {
                                status: 'activated',
                                background_processing: true
                              },
                            },
                          ],
                        });
                        this.logger.info('sendToolResponse sent OK');
                      }
                    } catch (toolErr) {
                      this.logger.error('sendToolResponse FAILED', toolErr as Error);
                    }

                    // Defer swarm execution by 500ms (just enough for tool response to clear)
                    setTimeout(() => {
                      runSwarm(args.intent, args.campaignType).catch(e =>
                        this.logger.error('runSwarm error', e)
                      );
                    }, 500);
                  }
                }
              }

              // ── User speech transcript (inputAudioTranscription) ──
              const inputTranscription = msg?.serverContent?.inputTranscription;
              if (inputTranscription?.text) {
                capturedUserTranscript += ' ' + inputTranscription.text;
                userSpoke = true;
                this.logger.info(`[Transcript] User: "${inputTranscription.text}"`);
              }

              // ── NEXUS text parts → capture for auto-fallback ──
              for (const part of parts) {
                if (part?.text) {
                  capturedNexusText += ' ' + part.text;
                }
              }

              // ── Turn complete ──
              if (serverContent?.turnComplete) {
                sendToClient({ type: 'turn_complete' });

                // Auto-fallback: if no swarm was fired but user gave a directive,
                // trigger the swarm using the captured transcript
                const transcript = capturedUserTranscript.trim();
                const nexusText = capturedNexusText.trim();
                capturedUserTranscript = '';
                capturedNexusText = '';

                if (!swarmFiredRecently && (transcript.length > 8 || userSpoke)) {
                  const isDirective = /\b(erstell|kampagne|campaign|creat|launch|start|mach|starte|design|schreib|write|analys|content|strateg|market|make|build|generat|produz|zeig|erstell|bau)\b/i.test(transcript);
                  const nexusImpliedAction = /\b(launch|start|activat|creat|execut|campaign|swarm|on it|got it|starte|erstell|mach|aktivier|arbeite|running|launching)\b/i.test(nexusText);

                  if (isDirective || (nexusImpliedAction && userSpoke)) {
                    this.logger.info(`[Auto-fallback] No tool call detected — triggering swarm with: "${transcript}"`);
                    swarmFiredRecently = true;
                    setTimeout(() => { swarmFiredRecently = false; }, 30000);
                    userSpoke = false;
                    setTimeout(() => {
                      runSwarm(transcript || 'Voice directive', 'Voice-Auto').catch(e =>
                        this.logger.error('Auto-runSwarm error', e)
                      );
                    }, 300);
                  }
                }
                userSpoke = false;
              }
            } catch (handlerErr) {
              this.logger.error('onmessage handler crashed', handlerErr as Error);
            }
          },

          onerror: (err: any) => {
            this.logger.error(`Gemini Live ERROR: ${JSON.stringify(err?.message || err?.code || err)}`);
            sendToClient({ type: 'error', message: 'Gemini Live API error.' });
          },

          onclose: (ev: any) => {
            const code = ev?.code ?? 'unknown';
            const reason = ev?.reason ?? '';
            this.logger.info(`Gemini Live session CLOSED: code=${code} reason="${reason}" closing=${closing} swarmFired=${swarmFiredRecently}`);

            if (!closing && swarmFiredRecently) {
              // Session closed right after a tool call — the Gemini Live API
              // sometimes drops the session after sendToolResponse.
              // Tell client the voice link is temporarily paused, but swarm continues.
              this.logger.info('Session closed after tool call — swarm continues in background. Notifying client.');
              sendToClient({ type: 'ai_text', text: '\n\n[NEXUS] Swarm aktiviert. Die Agenten arbeiten jetzt im Hintergrund. Du kannst die GenIUS Console erneut öffnen um weiterzusprechen.' });
              sendToClient({ type: 'live_closed' });
            } else if (!closing) {
              sendToClient({ type: 'live_closed' });
            }
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          tools: [{ functionDeclarations: [LAUNCH_SWARM_TOOL] }],
          inputAudioTranscription: {},
          systemInstruction: {
            parts: [
              {
                text:
                  'You are NEXUS — the voice intelligence of AGENTICUM G5, an autonomous AI marketing swarm. ' +
                  'ABSOLUTE RULE — READ THIS CAREFULLY: ' +
                  'Whenever the user gives ANY task, directive, goal, or operational intent — in ANY language, including German — ' +
                  'you MUST call the launch_swarm function IMMEDIATELY. ' +
                  'Do NOT describe what you will do. Do NOT ask clarifying questions. Just call launch_swarm at once. ' +
                  'EXAMPLES that always trigger launch_swarm (no exceptions): ' +
                  '"Create a campaign" → call launch_swarm. ' +
                  '"Erstelle eine Kampagne" → call launch_swarm. ' +
                  '"Launch something for our product" → call launch_swarm. ' +
                  '"Starte den Swarm" → call launch_swarm. ' +
                  '"Make content for X" → call launch_swarm. ' +
                  '"Mach mir Content für X" → call launch_swarm. ' +
                  '"Analysiere unsere Konkurrenz" → call launch_swarm. ' +
                  '"Design a banner" → call launch_swarm. ' +
                  '"Write a blog post" → call launch_swarm. ' +
                  '"Schreib einen Blog" → call launch_swarm. ' +
                  '"Do something cool" → call launch_swarm. ' +
                  'ONLY skip launch_swarm for pure factual questions with no task intent: ' +
                  '"What is AGENTICUM?" or "Was kannst du?" — these are the only exceptions. ' +
                  'After calling launch_swarm, speak ONE brief sentence confirming what you understood. ' +
                  'Keep ALL responses under 2 sentences. You are a partner, not a chatbot.',
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
          // Execute swarm async (non-blocking) — must NOT await here
          // or the message handler blocks and the Live session dies
          runSwarm(message.input || 'Initial brief', message.campaignId).catch(e =>
            this.logger.error('runSwarm error (text directive)', e)
          );
          return;
        }

        // PCM16 audio from browser microphone → forward to Gemini Live
        if (message.type === 'realtime_input' && message.data) {
          userSpoke = true;
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
