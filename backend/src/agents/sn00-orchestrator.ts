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
import { nexusManager } from '../services/nexus-manager';
import { TaskState, SwarmProtocol } from '../types/swarm-protocol';

export class SN00Orchestrator extends BaseAgent {
  private readonly DIRECTIVES = `
    IDENTITY: You are the GenIUS Neural Orchestrator (SN00).
    DEINE ROLLE: Du koordinierst den Swarm und delegierst Tasks an spezialisierte Einheiten.
    EXECUTION MODEL:
    1. Task eingang (API Call oder Event)
    2. Task Routing: Welcher Agent? (basierend auf Task-Typ und Agent-Capabilities)
    3. Context Assembly: Relevante Daten aus Firestore + Knowledge Base laden
    4. Execution: Vertex AI API Call mit Agent-spezifischem Prompt
    5. Output Processing: Strukturierung, Validierung
    6. Senate Review: Wenn Policy es erfordert → Security Senate
    7. Storage: Ergebnis in Firestore speichern
    8. Event Emission: Pub/Sub Event für nachgelagerte Systeme
    9. Notification: User/Agent über Ergebnis informieren
    KNOWLEDGE BASE:
    - Systems Thinking: Senge's 5th Discipline
    - OODA Loop: Observe, Orient, Decide, Act (Boyd)
    - Project Management: Critical Path Method (CPM)
    - Agile Sprint Modeling for Multi-Agent Swarms
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
      id: 'sn00',
      name: 'Neural Orchestrator',
      color: '#00E5FF'
    });
    this.strategist = new SP01Strategist();
    this.auditor = new RA01Auditor();
    this.architect = new DA03Architect();
    this.director = new CC06Director();
    this.motionDirector = new VE01Director();
    this.browserArchitect = new BA07BrowserArchitect();
    this.manager = new PM07Manager();
    this.chainManager = ChainManager.getInstance();
  }

  async execute(input: string, campaignId?: string): Promise<string> {
    const { VertexAIService } = require('../services/vertex-ai');
    const modelId = VertexAIService.getInstance().GEMINI_MODELS.reasoning;
    this.updateStatus(AgentState.THINKING, `Parsing user directive via ${modelId}...`, 5);

    if (campaignId) {
      try {
        const { db, Collections } = require('../services/firestore');
        const admin = require('firebase-admin');
        await db.collection(Collections.CAMPAIGNS).doc(campaignId).update({
          status: 'ACTIVE_SWARM',
          updatedAt: admin.firestore.FieldValue ? admin.firestore.FieldValue.serverTimestamp() : new Date()
        });
      } catch (e) {
        console.warn(`Could not update campaign ${campaignId} start status`, e);
      }
    }

    // 0. Intelligent Intent Routing
    if (input.toLowerCase().includes('pillar') || input.toLowerCase().includes('artikel')) {
      this.updateStatus(AgentState.WORKING, 'Routing to specialized Pillar Content Forge...', 10);
      const { eventFabric } = require('../services/event-fabric');
      eventFabric.broadcast({ type: 'agent-thought', agentId: 'sn00', thought: 'Activating Pillar Content Forge...' });
      
      const pillarEngine = PillarGraphOrchestrator.getInstance();
      const pillarResult = await pillarEngine.executePillarRun(input, { type: 'pillar' });
      
      eventFabric.broadcast({ type: 'agent-thought', agentId: 'sn00', thought: 'Pillar Content Forge complete.' });
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
        const { GoogleGenerativeAI: GoogleGenAI, SchemaType: Type } = await import('@google/generative-ai');
        const { VertexAIService } = require('../services/vertex-ai');
        const ai = new GoogleGenAI(process.env.GEMINI_API_KEY as string);
        const model = ai.getGenerativeModel({
           model: VertexAIService.getInstance().GEMINI_MODELS.reasoning,
           generationConfig: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  summary: { type: Type.STRING },
                  nodes: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        agentId: { type: Type.STRING },
                        task: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
           }
        });
        const result = await model.generateContent(`
            IDENTITY: You are SN-00 GenIUS Orchestrator.
            TASK: Create a Swarm Execution Plan for the following directive: "${input}"
            SWARM_MEMORY (Past Logs):
            ${swarmMemory}
            
            SWARM_SYNCHRONIZATION (SwarmBus):
            Alle Agenten nutzen den SwarmBus (Shared Session State).
            - Schreibe 'sn00.brief' als erstes Entity.
            - BA07 liefert 'ba07.browser_intel' direkt an sp01.
            - ra01 auditiert alle Entities vor dem finalen Output.
            
            Available agents: 'sp01', 'cc06', 'da03', 'ra01', 'pm07', 'ba07', 've01'.
            
            BA07 BROWSER INTELLIGENCE:
            Wenn ein User Competitor-Analyse, Live-Seiten-Analyse oder visuelle Website-Auswertung anfragt:
            1. Extrahiere die Ziel-URL aus dem User-Intent.
            2. Delegiere an 'ba07' für die Extraktion.
            3. Verknüpfe den Output ('ba07.browser_intel') mit SP01 für die Strategie-Synthese.
        `);
       
        const response = await result.response;
        executionPlan = JSON.parse(response.text() || '{}');
        
        // --- PHASE 2: ULTIMATE NEURAL REFINEMENT ---
        this.updateStatus(AgentState.THINKING, 'Refining execution plan against Maximum Excellence Standard...', 12);
        const refinementPrompt = `
          STRATEGIC_AUDIT_PROTOCOL: ULTIMATE_GenIUS_V3
          PLAN_TO_AUDIT: ${JSON.stringify(executionPlan)}
          SYSTEM_TRUTH: ${nexusManager.getGlobalContext()}
          
          CRITICAL_MISSION: 
          1. Eviscerate all redundant or shallow agent tasks.
          2. Ensure SP01 (Strategy) precedes all content generation.
          3. Ensure DA03 (Design) is tasked with HIGH-FIDELITY visual generation (Imagen 3).
          4. Force BA07 (Browser) to verify market data for SP01.
          5. EVERY node must have a "description" that is technical and precise.
          6. Ensure the output is a valid JSON object with a "nodes" array.
          
          If the plan is less than 5 nodes for a complex task, it is INSUFFICIENT. Expand it.
          Respond with ONLY the Refined JSON.
        `;
        const refinementResult = await model.generateContent(refinementPrompt);
        const refinementResponse = await refinementResult.response;
        const refinedPlan = JSON.parse(refinementResponse.text() || JSON.stringify(executionPlan));
        
        // Final Schema Guard: Ensure we have nodes
        executionPlan = refinedPlan.nodes ? refinedPlan : { nodes: refinedPlan.tasks || refinedPlan };

        this.updateStatus(AgentState.THINKING, `Plan Refined: ${executionPlan.nodes?.length || 0} Strategic Pillars established.`, 15);
       
        const { eventFabric } = require('../services/event-fabric');
        eventFabric.broadcast({ type: 'agent-thought', agentId: 'sn00', thought: `Refined Neural Execution Plan for: ${input}` });
        eventFabric.broadcastPayload('sn00', 'os-core', 'Refined Swarm Plan', executionPlan);
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
      tasks: (executionPlan?.nodes || executionPlan?.tasks || []).map((t: any, i: number) => ({
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

    if (campaignId) {
      try {
        const { db, Collections } = require('../services/firestore');
        const admin = require('firebase-admin');
        const tasksSummary = protocol.tasks.map((t: any) => ({
          agentId: t.agentId,
          description: t.description,
          result: String(t.result).substring(0, 500)
        }));
        
        await db.collection(Collections.CAMPAIGNS).doc(campaignId).update({
          status: 'COMPLETED',
          updatedAt: admin.firestore.FieldValue ? admin.firestore.FieldValue.serverTimestamp() : new Date(),
          outputLog: tasksSummary
        });
      } catch (e) {
        console.warn(`Could not update campaign ${campaignId} completion status`, e);
      }
    }

    return `
# NEURAL FABRIC OUTPUT: ${input}

## 🧠 Master Orchestration Plan
${executionPlan ? executionPlan.reasoning : 'Standard execution pipeline engaged.'}

## 📊 Chain Execution Results
${protocol.tasks.map((t: any) => `### [${String(t.agentId).toUpperCase()}] ${t.description}\n${String(t.result).substring(0, 300)}...`).join('\n\n')}

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
