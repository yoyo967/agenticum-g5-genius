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
    const engineUrl = process.env.ENGINE_URL || 'https://agenticum-g5-backend-697051612685.europe-west1.run.app';
    
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

      // 0. SWARM MEMORY: Lookup past runs for this topic
      let memoryInsights = '';
      try {
        this.logger.info(`[${runId}] Consulting Swarm Memory for: ${topic}`);
        const pastLogs = await db.collection('perfect_twin_logs')
          .where('type', '==', 'lifecycle')
          .orderBy('timestamp', 'desc')
          .limit(20)
          .get();
        
        const relevantLogs = pastLogs.docs
          .map(d => d.data())
          .filter(l => l.message.toLowerCase().includes(topic.toLowerCase().substring(0, 5)))
          .slice(0, 5);
        
        if (relevantLogs.length > 0) {
          memoryInsights = `SWARM_MEMORY_INSIGHTS:\n${relevantLogs.map(l => `- ${l.message}`).join('\n')}`;
          this.logger.info(`[${runId}] Memory Insights retrieved: ${relevantLogs.length} items`);
        }
      } catch (e) {
        this.logger.warn(`[${runId}] Swarm Memory lookup failed: ${(e as Error).message}`);
      }

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
      const groundedContent = await this.arbiter.validateAndGround(`${topic}\n\n${memoryInsights}`, runId);
      this.logger.info(`[${runId}] Arbiter Output Snippet: ${groundedContent.substring(0, 100)}`);
      
      if (groundedContent.includes('UNETHICAL_TOPIC')) {
        this.logger.warn(`[${runId}] Arbiter Blocked Unethical Topic: ${groundedContent}`);
        
        const auditResult = { 
          status: 'VETOED', 
          reason: groundedContent,
          score: 0,
          violations: ['ETHICS_VIOLATION']
        };

        const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        await db.collection(Collections.PILLARS).doc(slug).set({
          id: runId,
          title: topic,
          slug,
          status: 'VETOED',
          timestamp: new Date().toISOString(),
          audit_report: auditResult
        });

        eventFabric.broadcast({
          type: 'senate',
          verdict: 'REJECTED',
          topic,
          reason: groundedContent,
          runId
        });

        // PUSH TO SENATE DOCKET (Human-in-the-Loop)
        await db.collection(Collections.SENATE_DOCKET).add({
          agent: 'RA-01',
          type: 'ETHICS_VETO',
          risk: 'HIGH',
          title: `VETO: ${topic}`,
          payload: `GROUNDING ARBITER VETO: ${groundedContent}`,
          verdict: 'REJECTED',
          timestamp: new Date(),
          runId
        });

        eventFabric.broadcastStatus({ id: 'SN-00', state: 'idle', progress: 100, lastStatus: 'VETOED by Grounding Arbiter' });
        return { runId, status: 'VETOED', audit: auditResult };
      }

      eventFabric.broadcastPayload('RA-01', 'SN-00', 'grounding_data', { length: groundedContent.length });
      await logPhase('RESEARCH', 'Fact-checking & Grounding complete.', 'success');
      eventFabric.broadcastStatus({ id: 'RA-01', state: 'idle', progress: 100 });
      
      // 3. SYNTHESIS LAYER: CC-06 Forge (NATIVE)
      const step3Start = Date.now();
      eventFabric.broadcastStatus({ id: 'CC-06', state: 'working', progress: 50, lastStatus: 'Forging Content' });
      await logPhase('FORGE', 'Directing CC-06 to forge pillar content based on grounding...');
      const forgePrompt = `TOPIC: ${topic}\nGROUNDING_DATA: ${groundedContent}\nMEMORY_INSIGHTS: ${memoryInsights}\nTYPE: ${config.type || 'pillar'}`;
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
        this.logger.warn(`[${runId}] RA-01 Senate VETO: ${auditResult.reason}`);
        
        // PERSIST VETOED STATE
        const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        await db.collection(Collections.PILLARS).doc(slug).set({
          id: runId,
          title: topic,
          slug,
          content: forgedMarkdown,
          status: 'VETOED',
          timestamp: new Date().toISOString(),
          audit_report: auditResult
        });

        eventFabric.broadcast({
          type: 'senate',
          verdict: 'REJECTED',
          topic,
          reason: auditResult.reason,
          runId
        });

        // PUSH TO SENATE DOCKET (Human-in-the-Loop)
        await db.collection(Collections.SENATE_DOCKET).add({
          agent: 'RA-01',
          type: 'QUALITY_VETO',
          risk: auditResult.score < 40 ? 'HIGH' : 'MEDIUM',
          title: `VETO: ${topic}`,
          payload: `SCORE: ${auditResult.score}\nREASON: ${auditResult.reason}\n\nVIOLATIONS: ${JSON.stringify(auditResult.violations)}`,
          verdict: 'REJECTED',
          timestamp: new Date(),
          runId
        });

        eventFabric.broadcastStatus({ id: 'SN-00', state: 'idle', progress: 100, lastStatus: 'VETOED by Security Senate' });
        return { runId, status: 'VETOED', audit: auditResult };
      }
      
      let publishStatus = 'published';
      let liveUrl = `${process.env.BACKEND_URL || ''}/blog/${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

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
      
      // BROADCAST FINAL TELEMETRY
      eventFabric.broadcastTelemetry(finalOutcome.telemetry);
      eventFabric.broadcastMetric('token_usage', finalOutcome.telemetry.total_latency / 10); // Simulated usage metric
      
      eventFabric.broadcastStatus({ id: 'SN-00', state: 'idle', progress: 100, lastStatus: 'Execution Finalized' });
      return finalOutcome;

    } catch (error) {
      this.logger.error(`[${runId}] Execution failed`, error as Error);
      throw error;
    }
  }
}
