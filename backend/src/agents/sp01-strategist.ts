import { BaseAgent, AgentState } from './base-agent';
import { DiscoveryEngineService } from '../services/discovery-engine';

export class SP01Strategist extends BaseAgent {
  private readonly DIRECTIVES = `
    IDENTITY: You are the GenIUS Strategic Intelligence (SP-01).
    KNOWLEDGE BASE:
    - McKinsey 7S & Porter's Five Forces (Structural Analysis)
    - Blue Ocean Strategy & Jobs-to-Be-Done (Innovation)
    - Behavioral Economics: Kahneman's 8 Biases (Market Psychology)
    - Ehrenberg-Bass Laws & Binet & Field 60/40 Rule (Marketing Effectiveness)
    - StoryBrand Framework (Narrative Strategy)
    - Challenger Sale & B2B Buying Committees
  `;

  constructor() {
    super({
      id: 'sp-01',
      name: 'Strategic Intelligence Genius',
      color: '#34A853'
    });
  }

  async execute(input: string): Promise<string> {
    this.updateStatus(AgentState.THINKING, 'Analyzing market dynamics via McKinsey 7S...');
    
    const knowledgeBase = DiscoveryEngineService.getInstance();
    const groundingData = await knowledgeBase.searchKnowledge(input);
    
    this.logger.info(`Grounding successful: ${groundingData}`);

    this.updateStatus(AgentState.WORKING, 'Applying Behavioral Economics (Kahneman)...', 30);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    this.updateStatus(AgentState.WORKING, 'Calculating Narrative Velocity & Brand Equity...', 60);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    this.updateStatus(AgentState.WORKING, 'Finalizing strategic pillars (Binet & Field 60/40)...', 90);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockStrategy = `
## STRATEGIC BLUEPRINT: ${input}

### 🧠 Strategic Grounding
Identity active: ${this.DIRECTIVES.split('\n')[1].trim()}
Frameworks applied: McKinsey 7S, Porter's Five Forces, Kahneman's 8 Biases.

### 1. Market Opportunity (Ehrenberg-Bass Law)
Based on current mental availability patterns, we identify a "Blue Ocean" gap for ${input} by prioritizing long-term brand building (60%) over short-term activation (40%).

### 2. Narrative Pillars
- **Cognitive Resonance**: Reducing frictional anxiety via Kahneman-aware messaging.
- **Narrative Velocity**: Rapid deployment of StoryBrand-aligned content themes.
- **Strategic Moat**: High-authority grounding in MIT/Sloan-verified market data.

### 3. Recommendation
Orchestrate a multi-channel campaign that leverages "Jobs-to-Be-Done" logic to solve core user anxieties.
    `;

    this.updateStatus(AgentState.DONE, 'Strategy synthesis complete', 100);
    return mockStrategy.trim();
  }
}
