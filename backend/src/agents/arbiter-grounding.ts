import { VertexAIService } from '../services/vertex-ai';
import { Logger } from '../utils/logger';
import { AgentState } from '../types/agent';
import { PerfectTwinService } from '../services/perfect-twin';

export class ArbiterGroundingAgent {
  private logger = new Logger('ArbiterGrounding');
  private ai: VertexAIService;
  private twin: PerfectTwinService;

  constructor() {
    this.ai = VertexAIService.getInstance();
    this.twin = PerfectTwinService.getInstance();
  }

  async validateAndGround(topic: string, runId: string): Promise<string> {
    this.logger.info(`[${runId}] Initiating Search Grounding for: ${topic}`);
    
    // In a real Enterprise setup, this would use the Search Grounding tool specifically.
    // For now, we utilize the generateGroundedContent which uses Google Search retrieval.
    const prompt = `
      IDENTITY: You are the AGENTICUM G5 Grounding & Entity Arbiter.
      TASK: Research and validate facts for the pillar topic: "${topic}".
      GROUNDING: Use Google Search to find current data, entities, and statistics.
      OUTPUT: Provide a list of 5-10 verified FACTUAL ANCHORS (entities + claims + sources) 
      that will form the backbone of the Pillar Graph.
      COMPLIANCE: EU-First. 
    `;

    try {
      const groundedContent = await this.ai.generateGroundedContent(prompt);
      
      // Log to Perfect Twin
      await this.twin.logEvent({
        runId,
        agentId: 'ARBITER-GROUNDING',
        step: 'RESEARCH',
        input: { topic },
        output: groundedContent,
        provenance: ['GOOGLE_SEARCH_LIVE'],
        timestamp: new Date()
      });

      return groundedContent;
    } catch (error) {
      this.logger.error(`[${runId}] Grounding failed`, error as Error);
      return `[FAILSAFE GROUNDING] Research failed. Proceeding with atomic knowledge extracts for "${topic}".`;
    }
  }
}
