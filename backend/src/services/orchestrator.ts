import { Logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { db, Collections } from './firestore';
import { AgentState } from '../types/agent';
import { CC06Director } from '../agents/cc06-director';
import { ArbiterGroundingAgent } from '../agents/arbiter-grounding';
import { SenateGateAgent } from '../agents/senate-gate';
import { PerfectTwinService } from './perfect-twin';
import { eventFabric } from './event-fabric';

export enum PillarStep {
  INTAKE = 'INTAKE',
  RESEARCH = 'RESEARCH',
  BLUEPRINT = 'BLUEPRINT',
  SYNTHESIS = 'SYNTHESIS',
  QUALITY = 'QUALITY',
  PUBLISH = 'PUBLISH'
}

export class PillarGraphOrchestrator {
  private logger = new Logger('PillarGraphEngine');
  private static instance: PillarGraphOrchestrator;
  
  private arbiter = new ArbiterGroundingAgent();
  private cc06 = new CC06Director();
  private senate = new SenateGateAgent();
  private twin = PerfectTwinService.getInstance();

  private constructor() {}

  public static getInstance(): PillarGraphOrchestrator {
    if (!PillarGraphOrchestrator.instance) {
      PillarGraphOrchestrator.instance = new PillarGraphOrchestrator();
    }
    return PillarGraphOrchestrator.instance;
  }

  async executePillarRun(topic: string, config: any) {
    const runId = `run_${uuidv4().substring(0, 8)}`;
    const startTime = Date.now();
    this.logger.info(`[${runId}] Starting Pillar Graph execution for: ${topic}`);
    const engineUrl = 'http://127.0.0.1:8000'; // Target the Python Engine (IPv4)
    
    const logPhase = async (phase: string, msg: string, severity: 'info' | 'success' | 'warning' | 'error' = 'info') => {
      await db.collection('perfect_twin_logs').add({
        run_id: runId,
        timestamp: new Date(),
        type: 'lifecycle',
        agent: 'SN-00 Orchestrator',
        severity,
        message: `[${phase}] ${msg}`,
        latency: Date.now() - startTime
      });
    };

    try {
      eventFabric.broadcastStatus({ id: 'SN-00', state: 'working', progress: 5, lastStatus: 'Initializing Pillar Graph' });
      await logPhase('INIT', `Pillar Workflow initialized for: ${topic}`);

      // 1. COLUMNA LAYER (Simulated for now, would return competitor URLs)
      const step1Start = Date.now();
      eventFabric.broadcastStatus({ id: 'SN-00', state: 'working', progress: 15, lastStatus: 'Competitor Scanning' });
      await logPhase('COLUMNA', 'Scanning competitor landscape...');
      const overlap = [
        { url: 'https://www.salesforce.com/blog/ai-orchestration', strength: 0.8 },
        { url: 'https://cloud.google.com/vertex-ai/docs/generative-ai/grounding', strength: 0.9 }
      ];
      eventFabric.broadcastPayload('SP-01', 'SN-00', 'competitor_intel', overlap);
      await logPhase('COLUMNA', `Detected ${overlap.length} competitive overlaps.`, 'success');
      
      // 2. RESEARCH LAYER: Grounding & Entity Arbiter (NATIVE)
      const step2Start = Date.now();
      eventFabric.broadcastStatus({ id: 'RA-01', state: 'working', progress: 30, lastStatus: 'Grounding Verification' });
      await logPhase('RESEARCH', 'Activating Grounding Arbiter (Gemini 1.5 Flash)...');
      const groundedContent = await this.arbiter.validateAndGround(topic, runId);
      eventFabric.broadcastPayload('RA-01', 'SN-00', 'grounding_data', { length: groundedContent.length });
      await logPhase('RESEARCH', 'Fact-checking & Grounding complete.', 'success');
      eventFabric.broadcastStatus({ id: 'RA-01', state: 'idle', progress: 100 });
      
      // 3. SYNTHESIS LAYER: CC-06 Forge (NATIVE)
      const step3Start = Date.now();
      eventFabric.broadcastStatus({ id: 'CC-06', state: 'working', progress: 50, lastStatus: 'Forging Content' });
      await logPhase('FORGE', 'Directing CC-06 to forge pillar content based on grounding...');
      const forgePrompt = `TOPIC: ${topic}\nGROUNDING_DATA: ${groundedContent}\nTYPE: ${config.type || 'pillar'}`;
      const forgedMarkdown = await this.cc06.execute(forgePrompt);
      eventFabric.broadcastPayload('CC-06', 'SN-00', 'article_markdown', { title: topic });
      await logPhase('FORGE', 'Article forging complete.', 'success');
      eventFabric.broadcastStatus({ id: 'CC-06', state: 'idle', progress: 100 });

      // 4. QUALITY LAYER: Compliance Senate Gate (NATIVE)
      const step4Start = Date.now();
      eventFabric.broadcastStatus({ id: 'RA-01', state: 'working', progress: 80, lastStatus: 'Senate Audit' });
      await logPhase('COMPLIANCE', 'Initiating Algorithmic Senate Audit (Quality Gate)...');
      
      const auditEval = await this.senate.audit(forgedMarkdown, runId);
      const isApproved = auditEval.approved;
      const auditResult = { 
        status: isApproved ? 'APPROVED' : 'REJECTED', 
        reason: auditEval.feedback,
        score: auditEval.score,
        violations: auditEval.violations
      };
      
      eventFabric.broadcastPayload('RA-01', 'SN-00', 'audit_verdict', auditResult);
      await logPhase('COMPLIANCE', `Senate ${auditResult.status} (Score: ${auditResult.score}): ${auditResult.reason}`, isApproved ? 'success' : 'error');
      eventFabric.broadcastStatus({ id: 'RA-01', state: 'idle', progress: 100 });
      
      if (!isApproved) {
        throw new Error(`RA-01 Senate VETO: ${auditResult.reason}`);
      }
      
      let publishStatus = 'published';
      let liveUrl = `http://localhost:8080/blog/${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

      const finalOutcome = {
        runId,
        topic,
        content: forgedMarkdown,
        audit: auditResult,
        status: publishStatus,
        liveUrl,
        agent: 'CC-06 Director (Grounded)',
        timestamp: new Date().toISOString(),
        telemetry: {
          total_latency: Date.now() - startTime,
          steps: {
            columna: step2Start - step1Start,
            research: step3Start - step2Start,
            forge: step4Start - step3Start,
            compliance: Date.now() - step4Start
          }
        }
      };

      // PERSIST TO FIRESTORE (THE MISSING LINK)
      this.logger.info(`[${runId}] Persisting final Pillar to Firestore: ${topic}`);
      const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      await db.collection(Collections.PILLARS).doc(slug).set({
        id: finalOutcome.runId,
        title: topic,
        slug,
        content: finalOutcome.content,
        agent: finalOutcome.agent,
        status: finalOutcome.status,
        liveUrl: finalOutcome.liveUrl,
        timestamp: finalOutcome.timestamp,
        telemetry: {
          sources: ['Google Search Retrieval', 'Vault Grounding Engine'],
          performance: finalOutcome.telemetry
        },
        audit_report: finalOutcome.audit
      });

      this.logger.info(`[${runId}] Pillar Graph execution finalized. Status: ${finalOutcome.status}`);
      eventFabric.broadcastStatus({ id: 'SN-00', state: 'idle', progress: 100, lastStatus: 'Execution Finalized' });
      return finalOutcome;

    } catch (error) {
      this.logger.error(`[${runId}] Execution failed`, error as Error);
      throw error;
    }
  }
}
