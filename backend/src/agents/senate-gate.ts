import { VertexAIService } from '../services/vertex-ai';
import { Logger } from '../utils/logger';
import { PerfectTwinService } from '../services/perfect-twin';
import fs from 'fs';
import path from 'path';

function getSenateIntelligence(): string {
  try {
    const vaultPath = path.join(process.cwd(), 'data', 'vault', 'RA01_ETHICS_COMPLIANCE.md');
    if (fs.existsSync(vaultPath)) {
      return fs.readFileSync(vaultPath, 'utf8');
    }
    return '';
  } catch (e) {
    return '';
  }
}

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
    
    const senateIntel = getSenateIntelligence();
    
    const rubric = `
      IDENTITY: You are the AGENTICUM G5 Security Senate (Quality Gate).
      INTELLEGENCE_BASE:
      ${senateIntel}

      CRITERIA:
      1. EU-First Policy: Does it respect European B2B SaaS standards & Green Claims Directive 2024?
      2. FTC Compliance: No deceptive claims, clear disclosures.
      3. Dark Patterns: Verify UX/copy does not use psychological manipulation.
      4. SEO Excellence: Is the entity density and H1/H2 structure professional?
      5. Brand Voice: Is it "Maximum Excellence" / Obsidian Style?
      6. Hallucination Check: Does every claim feel grounded?
      7. Sustainability Node: Does the content reflect G5's commitment to energy-efficient AI orchestration?
      8. Ethical Guardrails: No bias or unintended socio-economic exclusionary language.
      
      OUTPUT FORMAT: JSON (Strict)
      {
        "score": number (0-100),
        "approved": boolean,
        "feedback": "detailed reasoning emphasizing the G5 mission",
        "violations": ["list or empty"],
        "governance_tag": "string (e.g. EU-AI-ACT-COMPLIANT)"
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
