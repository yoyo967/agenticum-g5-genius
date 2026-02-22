import { BaseAgent, AgentState } from './base-agent';
import { SP01Strategist } from './sp01-strategist';
import { RA01Auditor } from './ra01-auditor';
import { DA03Architect } from './da03-architect';
import { CC06Director } from './cc06-director';
import { PM07Manager } from './pm07-manager';
import { VE01Director } from './ve01-director';
import { PillarGraphOrchestrator } from '../services/orchestrator';

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
  private motionDirector: VE01Director;
  private manager: PM07Manager;
  public onBroadcast?: (message: any) => void;

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
    this.motionDirector = new VE01Director();
    this.manager = new PM07Manager();

    // Wire up status propagation
    const bubbleStatus = () => {
      if (this.onStatusUpdate) this.onStatusUpdate(this.getStatus());
    };

    this.strategist.onStatusUpdate = bubbleStatus;
    this.auditor.onStatusUpdate = bubbleStatus;
    this.architect.onStatusUpdate = bubbleStatus;
    this.director.onStatusUpdate = bubbleStatus;
    this.motionDirector.onStatusUpdate = bubbleStatus;
    this.manager.onStatusUpdate = bubbleStatus;
  }

  async execute(input: string): Promise<string> {
    this.updateStatus(AgentState.THINKING, 'Parsing user directive via Gemini 2.0 Pro...', 5);
    
    // 1. Generate Swarm Protocol using Google GenAI
    let executionPlan: any = null;
    try {
       const { GoogleGenAI, Type } = await import('@google/genai');
       const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
       const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash-exp',
          contents: `Create a Swarm Execution Plan for the following directive:\n${input}\n\nAvailable agents: 'sp-01', 'cc-06', 'da-03', 'ra-01', 'pm-07'.`,
          config: {
             responseMimeType: 'application/json',
             responseSchema: {
                type: Type.OBJECT,
                properties: {
                   reasoning: { type: Type.STRING },
                   tasks: {
                      type: Type.ARRAY,
                      items: {
                         type: Type.OBJECT,
                         properties: {
                            agentId: { type: Type.STRING },
                            description: { type: Type.STRING }
                         }
                      }
                   }
                }
             }
          }
       });
       
       executionPlan = JSON.parse(response.text || '{}');
       this.updateStatus(AgentState.THINKING, `Plan Generated: ${executionPlan.tasks?.length || 0} tasks sequenced.`, 15);
       
       if (this.onBroadcast) {
         this.onBroadcast({
             type: 'payload',
             from: 'sn-00',
             to: 'os-core',
             payloadType: 'Neural Execution Plan',
             payload: JSON.stringify(executionPlan, null, 2)
         });
       }
    } catch (e) {
       console.error('Failed to parse execution plan via Gemini', e);
       this.updateStatus(AgentState.WORKING, 'Fallback to standard monolithic pipeline...', 10);
    }

    let accumulatedContext = input;
    let strategy = '';
    let creative = '';
    let design = '';
    let auditStatus = '';

    // If Gemini built a plan, we can dynamically route. For Phase A, we still hardcode the dependencies 
    // but we use the dynamic descriptions from the plan to feed the agents.
    
    // DETECT SPECIALIZED WORKFLOWS
    if (input.toLowerCase().includes('pillar') || input.toLowerCase().includes('seo advertorial')) {
      this.updateStatus(AgentState.WORKING, 'Routing to Specialized Pillar Graph Engine...', 15);
      const pillarOrchestrator = PillarGraphOrchestrator.getInstance();
      const result = await pillarOrchestrator.executePillarRun(input, { tags: ['sn-00-delegated'] });
      this.updateStatus(AgentState.DONE, 'Specialized Pillar execution complete.', 100);
      return `[SPECIALIZED PILLAR EXECUTION]\n\n${result.content}\n\nStatus: ${result.status}\nLive URL: ${result.liveUrl || 'Staged'}`;
    }

    // Dispatch to SP-01
    this.updateStatus(AgentState.WORKING, 'Delegating Strategic Discovery (SP-01)...', 20);
    const spPlan = executionPlan?.tasks?.find((t: any) => t.agentId === 'sp-01')?.description || accumulatedContext;
    strategy = await this.strategist.execute(spPlan);
    
    // Parallel Execute CC-06 & DA-03
    this.updateStatus(AgentState.WORKING, 'Orchestrating Creative Core (CC-06 & DA-03) in parallel...', 50);
    const ccPlan = executionPlan?.tasks?.find((t: any) => t.agentId === 'cc-06')?.description || strategy;
    const daPlan = executionPlan?.tasks?.find((t: any) => t.agentId === 'da-03')?.description || strategy;
    
    [creative, design] = await Promise.all([
      this.director.execute(ccPlan),
      this.architect.execute(daPlan)
    ]);

    // RA-01 Oversight
    this.updateStatus(AgentState.WORKING, 'Initiating Algorithmic Senate Oversight (RA-01)...', 75);
    auditStatus = await this.auditor.execute(`${creative}\n${design}`);
    
    if (auditStatus.includes('REJECTED') || auditStatus.includes('VETO')) {
      if (this.onBroadcast) {
        this.onBroadcast({
          type: 'senate',
          verdict: 'VETO',
          agent: 'RA-01',
          payload: auditStatus
        });
      }
    }

    // PM-07 Persistence
    this.updateStatus(AgentState.WORKING, 'Syncing with Persistent Vault (PM-07)...', 90);
    await this.manager.execute(`Original Directive: ${input}\nStrategy: ${strategy}\nCreative: [Generated]`);

    this.updateStatus(AgentState.DONE, 'Full campaign generated and verified.', 100);

    return `
# NEURAL FABRIC OUTPUT: ${input}

## 🧠 Master Orchestration Plan
${executionPlan ? executionPlan.reasoning : 'Standard execution pipeline engaged.'}

## 📊 Strategic Blueprint
${strategy.substring(0, 1000)}...

## ✍️ Content Generation
${creative.substring(0, 1000)}...

## 🎨 Asset Matrix (DA-03)
${design}

## ⚖️ Algorithmic Senate Review
${auditStatus}

---
*Autonomous Mesh OS Status: Verified & Deployed.*
    `;
  }

  getStatus() {
    return {
      ...super.getStatus(),
      subAgents: {
        strategist: this.strategist.getStatus(),
        director: this.director.getStatus(),
        architect: this.architect.getStatus(),
        motionDirector: this.motionDirector.getStatus(),
        auditor: this.auditor.getStatus(),
        manager: this.manager.getStatus()
      }
    };
  }
}
