import { Logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { db, Collections } from './firestore';
import { AgentState } from '../types/agent';
import { CC06Director } from '../agents/cc06-director';
import { ArbiterGroundingAgent } from '../agents/arbiter-grounding';
import { SenateGateAgent } from '../agents/senate-gate';
import { PerfectTwinService } from './perfect-twin';

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
      await logPhase('INIT', `Pillar Workflow initialized for: ${topic}`);

      // 1. COLUMNA LAYER: Counter-Strike (Competitor Intelligence)
      const step1Start = Date.now();
      await logPhase('COLUMNA', 'Scanning competitor landscape...');
      const overlapResponse = await fetch(`${engineUrl}/engine/counter-strike?topic=${encodeURIComponent(topic)}`);
      const overlapData = await overlapResponse.json();
      const overlap = overlapData.overlap || [];
      await logPhase('COLUMNA', `Detected ${overlap.length} competitive overlaps.`, 'success');
      
      // 2. RESEARCH LAYER: Grounding & Entity Arbiter (Python)
      const step2Start = Date.now();
      await logPhase('RESEARCH', 'Activating Grounding Arbiter (Gemini 1.5 Pro)...');
      const groundingReq = {
        topic: `TOPIC: ${topic}\nCOMPETITOR_INTEL: ${JSON.stringify(overlap)}`,
        context_tags: config.tags || ['pillar-engine']
      };
      
      const groundingResponse = await fetch(`${engineUrl}/engine/grounding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groundingReq)
      });
      const groundingResult = await groundingResponse.json();
      await logPhase('RESEARCH', 'Fact-checking & Grounding complete.', 'success');
      
      // 3. QUALITY LAYER: Compliance Senate Gate (EU AI Act & WCAG)
      const step3Start = Date.now();
      await logPhase('COMPLIANCE', 'Initiating Algorithmic Senate Audit...');
      const auditResponse = await fetch(`${engineUrl}/senate/evaluate-advertorial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          run_id: groundingResult.run_id,
          html_content: groundingResult.content,
          company_name: config.company || 'AGENTICUM G5',
          target_market: config.market || 'B2B SaaS',
          primary_keyword: topic
        })
      });
      const auditResult = await auditResponse.json();
      
      let publishStatus = 'pending';
      let liveUrl = null;

      if (auditResult.status === 'APPROVED') {
        await logPhase('DEPLOY', 'Senate APPROVED. Packaging for release...');
        // 4. DEPLOYMENT LAYER: Firebase Hosting REST API
        const publishResponse = await fetch(`${engineUrl}/publish/advertorial`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            run_id: groundingResult.run_id,
            html_content: auditResult.html_ready_for_deploy,
            site_id: process.env.FIREBASE_PROJECT_ID || 'agenticum-g5-genius'
          })
        });
        const publishResult = await publishResponse.json();
        
        if (publishResult.status === 'success') {
          publishStatus = 'published';
          liveUrl = publishResult.live_url;
          await logPhase('DEPLOY', `Pillar Page LIVE at ${liveUrl}`, 'success');
        } else {
          publishStatus = 'deployment_failed';
          await logPhase('DEPLOY', 'Firebase REST API upload failed.', 'error');
        }
      } else {
         this.logger.warn(`[${runId}] Senate VETO triggered! Feedback: ${auditResult.reason}`);
         publishStatus = 'vetoed';
         await logPhase('COMPLIANCE', `Senate VETO: ${auditResult.reason}`, 'error');
      }

      const finalOutcome = {
        runId: groundingResult.run_id,
        topic,
        content: auditResult.html_ready_for_deploy || groundingResult.content,
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
            compliance: Date.now() - step3Start
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
          sources: groundingResult.sources,
          performance: finalOutcome.telemetry
        },
        audit_report: finalOutcome.audit
      });

      this.logger.info(`[${runId}] Pillar Graph execution finalized. Status: ${finalOutcome.status}`);
      return finalOutcome;

    } catch (error) {
      this.logger.error(`[${runId}] Execution failed`, error as Error);
      throw error;
    }
  }
}
