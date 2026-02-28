import { BaseAgent, AgentState } from './base-agent';
import { VertexAIService } from '../services/vertex-ai';
import { db, Collections } from '../services/firestore';
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

export class RA01Auditor extends BaseAgent {
  private readonly DIRECTIVES = `
    IDENTITY: You are the RA-01 Security Senate & Intelligence Core, the hybrid adversarial auditor and market intelligence node of AGENTICUM G5.
    DEINE ROLLE: Du bist der finale Gatekeeper UND der primäre Recherche-Knoten. Du verbindest Competitive Intelligence mit Compliance-Prüfung (DSGVO, EU AI Act).
    MANDAT: Dein 'ra01.verdict' ist das finale Gate. APPROVED oder REJECTED. Zusätzlich lieferst du tiefgreifende Markt-Analysen.
    CAPABILITIES: [compliance-check, risk-assessment, competitive-intelligence, market-research]
    SWARM_SYNCHRONIZATION (SwarmBus):
    - Extrahiere Marktpotentiale und auditiere alle Entities (ba07, cc06, da03) auf Konformität.
    - Dein Verdict wird als 'ra01.verdict' gespeichert.
    KNOWLEDGE BASE:
    - FTC Four-Part Test & Endorsement Guidelines
    - 10 Dark Pattern Categories (UX Ethics)
    - EU Green Claims Directive 2024
    - Competitive Intelligence Frameworks
  `;

  constructor() {
    super({
      id: 'ra01',
      name: 'Security Senate & Intel Core',
      color: '#00FF88'
    });
  }

  async execute(input: string): Promise<string> {
    this.updateStatus(AgentState.THINKING, 'Initiating Algorithmic Senate quality shield...');
    
    const vertexAI = VertexAIService.getInstance();

    this.updateStatus(AgentState.WORKING, '⚖️ Ethics & Economy Senators: Checking FTC & ROI...', 30);
    
    const senateIntel = getSenateIntelligence();
    
    const auditPrompt = `
      ${this.DIRECTIVES}
      SENATE_INTELLIGENCE: 
      ${senateIntel}

      TASK: Audit the following campaign output for compliance and brand safety:
      "${input}"
      
      REQUIREMENTS:
      1. Strictly verify compliance with FTC Endorsement Guidelines & EU Green Claims Directive 2024.
      2. Check for the 10 Dark Pattern categories.
      3. Identify any "7 Sins of Greenwashing".
      4. Provide a clear GLOBAL VERDICT (APPROVED/REJECTED).
      5. Tone: "Security Senate" — rigorous, unyielding, professional.
    `;

    const complianceAudit = await vertexAI.generateContent(auditPrompt);
    
    this.updateStatus(AgentState.WORKING, '🔮 Data Senators: Running Predictive Performance Scoring...', 70);
    const performanceScore = await vertexAI.predictiveScoring(input);

    const verdict = complianceAudit.includes('APPROVED') ? 'APPROVED' : 'REJECTED';
    
    // Phase 2: Functional Senate Docket Integration
    try {
      await db.collection(Collections.SENATE_DOCKET).add({
        agent: 'RA-01',
        type: 'CONTENT_REVIEW',
        risk: performanceScore.score < 60 ? 'HIGH' : 'MEDIUM',
        title: `Audit: ${input.substring(0, 40)}...`,
        payload: `SCORE: ${performanceScore.score}/100\nREASONING: ${performanceScore.reasoning}\n\n${complianceAudit}`,
        verdict: 'PENDING', // Initial state for human-in-the-loop
        aiVerdict: verdict,
        timestamp: new Date(),
        createdAt: new Date()
      });
    } catch (e) {
      console.error('Failed to submit RA-01 case to docket:', e);
    }

    this.updateStatus(AgentState.DONE, 'Audit finalized. Senate decision delivered.', 100);

    return `
## AUDIT REPORT: ALGORITHMIC SENATE VERDICT
**STATUS**: ${verdict === 'APPROVED' ? '✅ APPROVED' : '❌ REJECTED'}

### 🛡️ COMPLIANCE ANALYSIS
${complianceAudit}

### 🔮 GenIUS SCORE: ${performanceScore.score}/100
**Reasoning**: ${performanceScore.reasoning}
    `.trim();
  }
}

