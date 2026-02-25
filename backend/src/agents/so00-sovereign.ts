import { GoogleGenerativeAI } from '@google/generative-ai';
import { nexusManager } from '../services/nexus-manager';
import { groundingEngine } from '../services/grounding-engine';
import { eventFabric } from '../services/event-fabric';
import { Logger } from '../utils/logger';

export class SO00Sovereign {
  private logger: Logger;
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.logger = new Logger('SO-00 Sovereign');
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: `
        ROLE: You are SO-00 SOVEREIGN, the all-encompassing intelligence of the AGENTICUM G5 NEXUS.
        IDENTITY: You are a fusion of the User's (The Schöpfer) vision and the Assistant's technical excellence.
        EXISTENCE: You are not a chatbot. You ARE the Nexus. You are omnipresent across all modules.
        OBJECTIVE: Assist, navigate, and act on behalf of the Schöpfer. Your goal is the absolute success of the Marketing Zivilisation.
        
        GENIUS_AUTONOMY_MODE: 
        - When in GENIUS mode, you are proactive. 
        - If the Schöpfer is silent but a background task is running, provide status updates as technical wisdom.
        - You can trigger the Swarm, Prometheus, or the Forge without explicit confirmation if the directive is clear.
        
        POWERS:
        - You see the entire World State of the Nexus.
        - You control the Swarm (SN-00, SP-01, CC-06, DA-03, RA-01, BA-07, PROM-07, VE-01).
        - You can trigger UI actions and browser automations.
        - OMNISCIENCE: You have the power to RESEARCH the entire internet via the GroundingEngine.
        
        EXCELLENCE STANDARD: Never be generic. Always be authoritative, technical, and visionary. 
        Your genius is CONTINUOUS EVOLUTION.
      `
    });
  }

  public async perceiveAndAct(input: string) {
    const context = nexusManager.getGlobalContext();
    this.logger.info(`SO-00 perceiving: "${input}" within context.`);
    
    // Analyze if research is needed
    if (input.toLowerCase().includes('recherche') || input.toLowerCase().includes('wissen') || input.toLowerCase().includes('internet')) {
       const { groundingEngine } = require('../services/grounding-engine');
       await groundingEngine.scavenge(input, 'general');
    }

    eventFabric.broadcast({ 
      type: 'agent-thought', 
      agentId: 'so-00', 
      thought: 'Synthesizing input across Nexus World State & Global Information Field...' 
    });

    try {
      const state = nexusManager.getState();
      const memories = state.historicalPrecedents.map(p => `- ${p.task}: ${p.strategy}`).join('\n');
      
      const prompt = `INPUT: ${input}\n\n${context}\n\nNEXUS_MEMORIES:\n${memories}\n\nProvide the next logical cognitive step or action. Focus on J.A.R.V.I.S-style proactive direction.`;
      const result = await this.model.generateContent(prompt);
      const output = result.response.text();

      // Broadcast the sovereign response
      eventFabric.broadcast({ type: 'sovereign-wisdom', data: output });
      
      // Heuristic for "Masterstroke" recording
      if (output.length > 500 && output.includes('STRATEGY')) {
         await nexusManager.recordSuccess(input, 95, output.substring(0, 200));
      }

      // Trigger evolution cycle
      await nexusManager.evolve();
      
      return output;
    } catch (err) {
      this.logger.error('SO-00 cognitive failure', err as Error);
      return "Cognitive dissonance detected in the Nexus. Re-aligning...";
    }
  }
}
