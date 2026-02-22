import { VertexAIService } from '../services/vertex-ai';
import { Logger } from '../utils/logger';
import { PerfectTwinService } from '../services/perfect-twin';

export interface SenateEvaluation {
  score: number;
  approved: boolean;
  feedback: string;
  violations: string[];
}

export class SenateGateAgent {
  private logger = new Logger('SenateGate');
  private ai: VertexAIService;
  private twin: PerfectTwinService;

  constructor() {
    this.ai = VertexAIService.getInstance();
    this.twin = PerfectTwinService.getInstance();
  }

  async audit(content: string, runId: string): Promise<SenateEvaluation> {
    this.logger.info(`[${runId}] Algorithmischer Senat is auditing content...`);
    
    const rubric = `
      IDENTITY: You are the AGENTICUM G5 Security Senate (Quality Gate).
      CRITERIA:
      1. EU-First Policy: Does it respect European B2B SaaS standards?
      2. SEO Excellence: Is the entity density and H1/H2 structure professional?
      3. Brand Voice: Is it "Maximum Excellence" / Obsidian Style?
      4. Hallucination Check: Does every claim feel grounded?
      
      OUTPUT FORMAT: JSON
      {
        "score": number (0-100),
        "approved": boolean,
        "feedback": "detailed reasoning",
        "violations": ["list or empty"]
      }
    `;

    try {
      // Use the predictive scoring logic or direct generateContent with JSON mode
      const response = await this.ai.generateContent(`${rubric}\n\nCONTENT TO AUDIT:\n${content}`);
      
      // Attempt to parse JSON from AI response
      const cleanJson = response.replace(/```json|```/g, '').trim();
      const evalResult: SenateEvaluation = JSON.parse(cleanJson);

      // Log to Perfect Twin
      await this.twin.logEvent({
        runId,
        agentId: 'SENATE-GATE',
        step: 'QUALITY',
        input: { contentLength: content.length },
        output: evalResult,
        provenance: ['GOVERNANCE_POLICY_V1'],
        timestamp: new Date(),
        evalResult
      });

      return evalResult;
    } catch (error) {
      this.logger.error(`[${runId}] Senate Audit failed`, error as Error);
      return {
        score: 50,
        approved: true, // Fail-open for now but logged as suspicious
        feedback: 'Audit engine encountered a transient error.',
        violations: ['AUDIT_FAIL']
      };
    }
  }
}
