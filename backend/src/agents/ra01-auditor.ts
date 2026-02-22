import { BaseAgent, AgentState } from './base-agent';
import { VertexAIService } from '../services/vertex-ai';

export class RA01Auditor extends BaseAgent {
  private readonly DIRECTIVES = `
    IDENTITY: You are the GenIUS Algorithmic Senate Lead (RA-01).
    KNOWLEDGE BASE:
    - FTC Four-Part Test & Endorsement Guidelines
    - 10 Dark Pattern Categories (UX Ethics)
    - 7 Sins of Greenwashing (TerraChoice)
    - EU Green Claims Directive 2024
    - Competitive Audit Framework (4-Tier)
  `;

  constructor() {
    super({
      id: 'ra-01',
      name: 'Adversarial Auditor Genius',
      color: '#EA4335'
    });
  }

  async execute(input: string): Promise<string> {
    this.updateStatus(AgentState.THINKING, 'Initiating Algorithmic Senate quality shield...');
    
    const vertexAI = VertexAIService.getInstance();

    this.updateStatus(AgentState.WORKING, '⚖️ Ethics & Economy Senators: Checking FTC & ROI...', 30);
    
    const auditPrompt = `
      ${this.DIRECTIVES}
      TASK: Audit the following campaign output for compliance and brand safety:
      "${input}"
      
      REQUIREMENTS:
      1. Verify compliance with FTC Endorsement Guidelines.
      2. Check for Dark Pattern categories.
      3. Provide a clear GLOBAL VERDICT (APPROVED/REJECTED).
    `;

    const complianceAudit = await vertexAI.generateContent(auditPrompt);
    
    this.updateStatus(AgentState.WORKING, '🔮 Data Senators: Running Predictive Performance Scoring...', 70);
    const performanceScore = await vertexAI.predictiveScoring(input);

    this.updateStatus(AgentState.DONE, 'Audit finalized. Senate decision delivered.', 100);

    return `
## AUDIT REPORT: ALGORITHMIC SENATE VERDICT
**STATUS**: ${complianceAudit.includes('APPROVED') ? '✅ APPROVED' : '❌ REJECTED'}

### 🛡️ COMPLIANCE ANALYSIS
${complianceAudit}

### 🔮 GENIUS SCORE: ${performanceScore.score}/100
**Reasoning**: ${performanceScore.reasoning}
    `.trim();
  }
}

