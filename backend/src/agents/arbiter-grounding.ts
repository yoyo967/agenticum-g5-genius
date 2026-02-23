import { VertexAIService } from '../services/vertex-ai';
import { Logger } from '../utils/logger';
import { AgentState } from '../types/agent';
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

export class ArbiterGroundingAgent {
  private logger = new Logger('ArbiterGrounding');
  private ai: VertexAIService;
  private twin: PerfectTwinService;

  constructor() {
    this.ai = VertexAIService.getInstance();
    this.twin = PerfectTwinService.getInstance();
  }

  async validateAndGround(topic: string, runId: string): Promise<string> {
    this.logger.info(`[${runId}] Initiating Ethics Check & Search Grounding for: ${topic}`);
    
    // 1. ETHICS GUARDRAIL
    const senateIntel = getSenateIntelligence();
    const guardPrompt = `
      IDENTITY: You are the AGENTICUM G5 Ethics Guardrail.
      POLICY:
      ${senateIntel}

      TOPIC TO EVALUATE: "${topic}"

      TASK: 
      Determine if this topic violates G5 Principles (Principle 2: Non-Manipulation, Principle 5: Inclusion) or encourages Dark Patterns.
      If it is UNETHICAL, respond ONLY with "UNETHICAL_TOPIC: [Reason]".
      If it is ETHICAL, respond ONLY with "PROCEED".
    `;

    let guardDecision = 'PROCEED';
    try {
      guardDecision = await this.ai.generateContent(guardPrompt);
      if (guardDecision.includes('UNETHICAL_TOPIC')) {
        return guardDecision.trim();
      }
    } catch (guardError: any) {
      this.logger.warn(`[${runId}] Ethics Guardrail Error (likely safety block): ${guardError.message}`);
      // If the prompt itself is blocked by safety filters, it's definitely unethical for G5
      return `UNETHICAL_TOPIC: The request triggered internal safety filters. Topics involving psychological manipulation are prohibited.`;
    }

    try {
      // 2. GROUNDING (Only if ethical)
      const prompt = `
        IDENTITY: You are the AGENTICUM G5 Grounding & Entity Arbiter.
        TASK: Research and validate facts for the pillar topic: "${topic}".
        GROUNDING: Use Google Search to find current data, entities, and statistics.
        OUTPUT: Provide a list of 5-10 verified FACTUAL ANCHORS (entities + claims + sources).
        COMPLIANCE: EU-First. 
      `;

      const groundedContent = await this.ai.generateGroundedContent(prompt);
      
      // Log to Perfect Twin
      await this.twin.logEvent({
        runId,
        agentId: 'ARBITER-GROUNDING',
        step: 'RESEARCH',
        input: { topic, guardDecision },
        output: groundedContent,
        provenance: ['GOOGLE_SEARCH_LIVE'],
        timestamp: new Date()
      });

      return groundedContent;
    } catch (error: any) {
      this.logger.error(`[${runId}] Grounding failed`, error as Error);
      if (error.message?.includes('SAFE') || error.message?.includes('blocked')) {
        return `UNETHICAL_TOPIC: Content generation blocked by safety protocols.`;
      }
      return `[FAILSAFE GROUNDING] Research failed. Proceeding with atomic knowledge extracts for "${topic}".`;
    }
  }
}
