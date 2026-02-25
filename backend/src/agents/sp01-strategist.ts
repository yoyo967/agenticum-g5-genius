import { BaseAgent, AgentState } from './base-agent';
import { DiscoveryEngineService } from '../services/discovery-engine';
import { VertexAIService } from '../services/vertex-ai';
import { GoogleWorkspaceService } from '../services/google-workspace';
import { eventFabric } from '../services/event-fabric';

export class SP01Strategist extends BaseAgent {
  private readonly DIRECTIVES = `
    IDENTITY: You are the GenIUS Strategy Architect (SP01).
    KNOWLEDGE BASE:
    - Structural Analysis: McKinsey 7S & Porter's Five Forces
    - Innovation: Blue Ocean Strategy & Jobs-to-Be-Done
    - Market Psychology: Behavioral Economics (Kahneman's 8 Biases)
    - Effectiveness: Ehrenberg-Bass Laws & Binet & Field 60/40 Rule
    - Narrative Strategy: StoryBrand Framework
    - Sales Strategy: Challenger Sale & B2B Buying Committees
    SWARM_SYNCHRONIZATION (SwarmBus):
    - Deine Datenquelle ist 'ba07.browser_intel'.
    - Deine Decision-Matrix wird als 'sp01.intel' gespeichert.
  `;

  constructor() {
    super({
      id: 'sp01',
      name: 'Strategic Intelligence Genius',
      color: '#00FF88'
    });
  }

  async execute(input: string): Promise<string> {
    this.updateStatus(AgentState.THINKING, 'Grounding intelligence on live internet...');
    eventFabric.broadcast({ type: 'task-log', agentId: 'sp01', message: 'Searching The Vault & Google Grounding...' });
    
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
      
      VAULT INTELLIGENCE HUB (RAG DATA): 
      ${groundingData}
      
      CRITICAL INSTRUCTIONS:
      1. MAXIMAL DEPTH: AVOID MARKETING SUMMARIES. Deliver an exhaustive technical blueprint (minimum 1500 words equivalent logic density).
      2. INTEGRATE VAULT: You MUST prioritize the "VAULT INTELLIGENCE" provided above. Cite specific files (e.g., DA03_DESIGN_THEORY.md) if they appear in the snippets.
      3. SEARCH & CITE: Use the live internet to find current market trends, competitor pricing, and news relevant to "${input}".
      4. EVIDENCE: You MUST include a "SOURCES & EVIDENCE" section, citing both Vault snippets and live URLs.
      5. FRAMEWORK: Apply the StoryBrand Framework to define the Customer as the Hero.
      6. PSYCHOLOGY: Integrate Kahneman's "Availability Heuristic" and "Loss Aversion" into the narrative.
      7. DESIGN: Propose a "Bauhaus-Inspired" visual direction for this strategy.
      
      OUTPUT FORMAT (MARKDOWN):
      # STRATEGIC MASTER BRIEF: ${input}
      
      ## 🎯 Market Pulse & Competitor Landscape
      (Detailed analysis based on live research and Vault alignment)
      
      ## 🗺️ StoryBrand Matrix (Customer Journey)
      ...
      
      ## ⚖️ Behavioral Economics & Pricing
      ...
      
      ## 📊 60/40 Budget Allocation
      ...
      
      ## 📌 SOURCES & EVIDENCE
      - [Source] ...
    `;

    const strategy = await vertexAI.generateGroundedContent(prompt);

    this.updateStatus(AgentState.WORKING, 'Publishing Master Brief to Google Docs...', 80);
    
    let responseText = strategy;
    try {
      const docTitle = `G5 Master Brief: ${input.substring(0, 40).replace(/[^a-zA-Z0-9 -]/g, '')}`;
      const docUrl = await workspace.createDocument(docTitle, strategy);
      responseText = `[View Live Master Brief on Google Docs](${docUrl})\n\n${strategy}`;
    } catch (e: any) {
      this.logger.error('Failed to publish brief to Google Docs', e);
    }

    this.updateStatus(AgentState.DONE, 'Strategy synthesis & Docs publication complete', 100);
    return responseText;
  }
}
