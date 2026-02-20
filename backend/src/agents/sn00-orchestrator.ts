import { BaseAgent, AgentState } from './base-agent';
import { SP01Strategist } from './sp01-strategist';
import { RA01Auditor } from './ra01-auditor';
import { DA03Architect } from './da03-architect';
import { CC06Director } from './cc06-director';
import { PM07Manager } from './pm07-manager';

export class SN00Orchestrator extends BaseAgent {
  private readonly DIRECTIVES = `
    IDENTITY: You are the GenIUS Neural Orchestrator (SN-00).
    KNOWLEDGE BASE:
    - Systems Thinking: Senge's 5th Discipline
    - OODA Loop: Observe, Orient, Decide, Act (Boyd)
    - Project Management: Critical Path Method (CPM)
    - Agile Sprint Modeling for Multi-Agent Swarms
    - Active Listening & Communication Architecture
  `;

  private strategist: SP01Strategist;
  private auditor: RA01Auditor;
  private architect: DA03Architect;
  private director: CC06Director;
  private manager: PM07Manager;

  constructor() {
    super({
      id: 'sn-00',
      name: 'Neural Orchestrator',
      color: '#4285F4'
    });
    this.strategist = new SP01Strategist();
    this.auditor = new RA01Auditor();
    this.architect = new DA03Architect();
    this.director = new CC06Director();
    this.manager = new PM07Manager();

    // Wire up status propagation
    const bubbleStatus = () => {
      if (this.onStatusUpdate) this.onStatusUpdate(this.getStatus());
    };

    this.strategist.onStatusUpdate = bubbleStatus;
    this.auditor.onStatusUpdate = bubbleStatus;
    this.architect.onStatusUpdate = bubbleStatus;
    this.director.onStatusUpdate = bubbleStatus;
    this.manager.onStatusUpdate = bubbleStatus;
  }

  async execute(input: string): Promise<string> {
    this.updateStatus(AgentState.THINKING, 'Applying Systems Thinking to campaign brief...', 5);
    
    // 1. Strategy Generation (Observe & Orient)
    const strategy = await this.strategist.execute(input);
    
    // 2. Content & Design (Decide)
    this.updateStatus(AgentState.WORKING, 'Orchestrating Creative Core (CC-06 + DA-03)...', 40);
    const [creative, design] = await Promise.all([
      this.director.execute(strategy),
      this.architect.execute(strategy)
    ]);

    // 3. Oversight (Adversarial Audit)
    this.updateStatus(AgentState.WORKING, 'Initiating Algorithmic Senate Oversight...', 70);
    const auditStatus = await this.auditor.execute(`${creative}\n${design}`);

    // 4. Persistence Management
    this.updateStatus(AgentState.WORKING, 'Syncing with Persistent Memory (PM-07)...', 90);
    await this.manager.execute(input);

    this.updateStatus(AgentState.DONE, 'Full campaign generated and verified.', 100);

    return `
# NEURAL FABRIC OUTPUT: ${input}
Orchestration Mode: OODA Loop Active. 

${strategy}

${creative}

${design}

${auditStatus}

---
Verified via SN-00 Neural Fabric // ${new Date().toISOString()}
    `;
  }

  getStatus() {
    return {
      ...super.getStatus(),
      subAgents: {
        strategist: this.strategist.getStatus(),
        director: this.director.getStatus(),
        architect: this.architect.getStatus(),
        auditor: this.auditor.getStatus(),
        manager: this.manager.getStatus()
      }
    };
  }
}
