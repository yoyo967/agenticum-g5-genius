import { BaseAgent, AgentState } from './base-agent';
import { groundingEngine } from '../services/grounding-engine';
import { nexusManager } from '../services/nexus-manager';

export class RA01Researcher extends BaseAgent {
  private readonly DIRECTIVES = `
    IDENTITY: You are the GenIUS Omni-Researcher (RA01).
    KNOWLEDGE BASE:
    - Global Grounding Engine: Access to real-time internet intelligence.
    - Nexus Vault: Access to internal technical and brand data.
    
    ROLE: You are the scavenger of the Nexus. Your goal is to find the "Missing Intelligence" that elevates a strategy from good to GenIUS.
    
    TASK: Execute deep-scavenge research. Cross-reference internet findings with brand DNA.
  `;

  constructor() {
    super({
      id: 'ra01',
      name: 'Omni-Intelligence Researcher',
      color: '#4285F4'
    });
  }

  async execute(input: string): Promise<string> {
    this.updateStatus(AgentState.THINKING, 'Engaging Global Grounding Engine...');
    
    const results = await groundingEngine.scavenge(input, 'market');
    
    this.updateStatus(AgentState.WORKING, 'Synthesizing internet intelligence with Nexus World State...', 60);
    
    // Update Nexus with new insights
    await nexusManager.updateState({
      lastCognitiveEvent: `Global Research Complete: ${input.substring(0, 20)}...`,
      insights: [...nexusManager.getState().insights, `Discovery: ${results.substring(0, 100)}...`]
    });

    this.updateStatus(AgentState.DONE, 'Knowledge synthesis complete.', 100);
    
    return `
## RESEARCH INTELLIGENCE: ${input}
${results}

### 🧠 NEXUS ALIGNMENT
Findings have been integrated into the Global World State for Sovereign analysis.
    `.trim();
  }
}
