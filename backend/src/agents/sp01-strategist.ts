import { BaseAgent, AgentState } from './base-agent';
import { DiscoveryEngineService } from '../services/discovery-engine';
import { VertexAIService } from '../services/vertex-ai';
import { GoogleWorkspaceService } from '../services/google-workspace';

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
    this.updateStatus(AgentState.THINKING, 'Grounding intelligence on live internet...');
    
    const vertexAI = VertexAIService.getInstance();
    const discoveryEngine = DiscoveryEngineService.getInstance();
    const workspace = GoogleWorkspaceService.getInstance();
    
    // 1. Internal Vault Grounding (Optional fallback context)
    const groundingData = await discoveryEngine.searchKnowledge(input);
    this.logger.info(`Vault Grounding successful for: ${input}`);

    // 2. Real Logic Generation with Google Search
    this.updateStatus(AgentState.WORKING, 'Aggregating live competitor data & Behavioral Economics...', 50);
    
    const prompt = `
      ${this.DIRECTIVES}
      TASK: Create a comprehensive strategic blueprint for the target: "${input}"
      INTERNAL GROUNDING CONTEXT: ${groundingData}
      
      REQUIREMENTS:
      1. Search the live internet for up-to-date context regarding the target brand or market.
      2. Use the StoryBrand Framework.
      3. Apply Kahneman's 8 Biases to minimize frictional anxiety.
      4. Recommend a budget allocation following the Binet & Field 60/40 rule.
      
      OUTPUT FORMAT:
      ## STRATEGIC BLUEPRINT: ${input}
      ... (detailed analysis sections) ...
    `;

    const strategy = await vertexAI.generateGroundedContent(prompt);

    this.updateStatus(AgentState.WORKING, 'Publishing Master Brief to Google Docs...', 80);
    
    let responseText = strategy;
    try {
      const docTitle = `G5 Master Brief: ${input.substring(0, 40).replace(/[^a-zA-Z0-9 -]/g, '')}`;
      const docUrl = await workspace.createDocument(docTitle, strategy);
      // Prepend the clickable markdown link
      responseText = `[View Live Master Brief on Google Docs](${docUrl})\n\n${strategy}`;
    } catch (e: any) {
      this.logger.error('Failed to publish brief to Google Docs', e);
    }

    this.updateStatus(AgentState.DONE, 'Strategy synthesis & Docs publication complete', 100);
    return responseText;
  }
}
