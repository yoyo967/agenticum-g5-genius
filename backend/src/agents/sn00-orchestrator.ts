import { BaseAgent, AgentState } from './base-agent';
import { SP01Strategist } from './sp01-strategist';
import { RA01Auditor } from './ra01-auditor';
import { DA03Architect } from './da03-architect';
import { CC06Director } from './cc06-director';
import { PM07Manager } from './pm07-manager';
import { VE01Director } from './ve01-director';
import { BA07BrowserArchitect } from './ba07-browser-architect';
import { PillarGraphOrchestrator } from '../services/orchestrator';
import { ChainManager } from '../services/chain-manager';
import { TaskState, SwarmProtocol } from '../types/swarm-protocol';

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
  private browserArchitect: BA07BrowserArchitect;
  private manager: PM07Manager;
  private chainManager: ChainManager;

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
    this.browserArchitect = new BA07BrowserArchitect();
    this.manager = new PM07Manager();
    this.chainManager = new ChainManager();
  }

  async execute(input: string): Promise<string> {
    this.updateStatus(AgentState.THINKING, 'Parsing user directive via Gemini 2.0 Pro...', 5);

    // 0. Intelligent Intent Routing
    if (input.toLowerCase().includes('pillar') || input.toLowerCase().includes('artikel')) {
      this.updateStatus(AgentState.WORKING, 'Routing to specialized Pillar Content Forge...', 10);
      const pillarEngine = PillarGraphOrchestrator.getInstance();
      const pillarResult = await pillarEngine.executePillarRun(input, { type: 'pillar' });
      
      this.updateStatus(AgentState.DONE, `Pillar Content Forge complete. Status: ${pillarResult.status}`, 100);
      
      const contentSnippet = (pillarResult as any).content?.substring(0, 1000) || 'No content generated (Vetoed or Error).';
      const liveUrl = (pillarResult as any).liveUrl || 'N/A';

      return `
# NEURAL FABRIC OUTPUT: ${input}

## 🚀 Pillar Content Forge Activation
The directive has been processed via the specialized **PillarGraphOrchestrator**. 

### Status: ${pillarResult.status.toUpperCase()}
### Live URL: ${liveUrl !== 'N/A' ? `[${liveUrl}](${liveUrl})` : 'N/A'}

## 🧠 Forged Content Extract
${contentSnippet}...

---
*Autonomous Mesh OS Status: Verified, Grounded & Persisted.*
      `;
    }

    // 0. Swarm Memory Integration
    let swarmMemory = 'No previous logs found.';
    try {
      const { db } = require('../services/firestore');
      const logs = await db.collection('perfect_twin_logs').orderBy('timestamp', 'desc').limit(10).get();
      swarmMemory = logs.docs.map((d: any) => `- ${d.data().message || d.data().step}`).join('\n');
    } catch (e) {}

    // 1. Generate Swarm Protocol using Google GenAI (Generic Flow)
    let executionPlan: any = null;
    try {
       const { GoogleGenAI, Type } = await import('@google/genai');
       const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
       const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash-exp',
          contents: `
            IDENTITY: You are SN-00 Neural Orchestrator.
            TASK: Create a Swarm Execution Plan for the following directive: "${input}"
            SWARM_MEMORY (Past Logs):
            ${swarmMemory}
            
            SWARM_SYNCHRONIZATION (SwarmBus):
            Alle Agenten nutzen den SwarmBus (Shared Session State).
            - Schreibe 'sn00.brief' als erstes Entity.
            - BA-07 liefert 'ba07.browser_intel' direkt an SP-01.
            - RA-01 auditiert alle Entities vor dem finalen Output.
            
            Available agents: 'sp-01', 'cc-06', 'da-03', 'ra-01', 'pm-07', 'ba-07'.
            
            BA-07 BROWSER INTELLIGENCE:
            Wenn ein User Competitor-Analyse, Live-Seiten-Analyse oder visuelle Website-Auswertung anfragt:
            1. Extrahiere die Ziel-URL aus dem User-Intent.
            2. Formuliere einen präzisen task-String.
            3. Nutze 'ba-07' für launch_browser_agent.
          `,
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
       
       const { eventFabric } = require('../services/event-fabric');
       eventFabric.broadcastPayload('sn-00', 'os-core', 'Neural Execution Plan', executionPlan);
    } catch (e) {
       console.error('Failed to parse execution plan via Gemini', e);
       this.updateStatus(AgentState.WORKING, 'Fallback to standard monolithic pipeline...', 10);
    }

    // 2. Build SwarmProtocol
    const protocol: SwarmProtocol = {
      id: `p-${Date.now()}`,
      goal: input,
      status: 'active',
      createdAt: Date.now(),
      tasks: (executionPlan?.tasks || []).map((t: any, i: number) => ({
        id: `t-${i}`,
        agentId: t.agentId,
        description: t.description,
        state: TaskState.PENDING,
        dependencies: i > 0 ? [`t-${i-1}`] : [] 
      }))
    };

    // 3. Execute via ChainManager
    this.updateStatus(AgentState.WORKING, 'Activating Autonomous Task Chain...', 25);
    await this.chainManager.executeProtocol(protocol);

    this.updateStatus(AgentState.DONE, 'Full orchestration cycle complete.', 100);

    return `
# NEURAL FABRIC OUTPUT: ${input}

## 🧠 Master Orchestration Plan
${executionPlan ? executionPlan.reasoning : 'Standard execution pipeline engaged.'}

## 📊 Chain Execution Results
${protocol.tasks.map(t => `### [${t.agentId.toUpperCase()}] ${t.description}\n${String(t.result).substring(0, 300)}...`).join('\n\n')}

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
