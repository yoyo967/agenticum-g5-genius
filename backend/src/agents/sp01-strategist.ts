import { BaseAgent, AgentState } from './base-agent';
import { DiscoveryEngineService } from '../services/discovery-engine';
import { VertexAIService } from '../services/vertex-ai';

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
    
    const vertexAI = VertexAIService.getInstance();
    const discoveryEngine = DiscoveryEngineService.getInstance();
    
    // 1. Grounding Search
    const groundingData = await discoveryEngine.searchKnowledge(input);
    this.logger.info(`Grounding successful for: ${input}`);

    // 2. Real Logic Generation
    this.updateStatus(AgentState.WORKING, 'Applying Behavioral Economics & Narrative Strategy...', 50);
    
    const prompt = `
      ${this.DIRECTIVES}
      TASK: Create a comprehensive strategic blueprint for the target: "${input}"
      GROUNDING CONTEXT: ${groundingData}
      
      REQUIREMENTS:
      1. Use the StoryBrand Framework.
      2. Apply Kahneman's 8 Biases to minimize frictional anxiety.
      3. Recommend a budget allocation following the Binet & Field 60/40 rule.
      
      OUTPUT FORMAT:
      ## STRATEGIC BLUEPRINT: ${input}
      ... (detailed analysis sections) ...
    `;

    const strategy = await vertexAI.generateContent(prompt);

    this.updateStatus(AgentState.DONE, 'Strategy synthesis complete', 100);
    return strategy;
  }
}
