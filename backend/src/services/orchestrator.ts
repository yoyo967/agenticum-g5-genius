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
    this.logger.info(`[${runId}] Starting Pillar Graph execution for: ${topic}`);
    const engineUrl = 'http://127.0.0.1:8000'; // Target the Python Engine (IPv4)
    
    try {
      // 1. COLUMNA LAYER: Counter-Strike (Competitor Intelligence)
      this.logger.info(`[${runId}] Scanning for competitor overlap...`);
      const overlapResponse = await fetch(`${engineUrl}/engine/counter-strike?topic=${encodeURIComponent(topic)}`);
      const overlapData = await overlapResponse.json();
      const overlap = overlapData.overlap || [];
      
      // 2. RESEARCH LAYER: Grounding & Entity Arbiter (Python)
      this.logger.info(`[${runId}] Activating Grounding & Entity Arbiter...`);
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
      
      // 3. QUALITY LAYER: Compliance Senate Gate (EU AI Act & WCAG)
      this.logger.info(`[${runId}] Auditing content via Compliance Senate Gate...`);
      const auditResponse = await fetch(`${engineUrl}/senate/evaluate-advertorial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          run_id: groundingResult.run_id,
          html_content: groundingResult.content,
          company_name: config.company || 'AGENTICUM G5',
          target_market: config.market || 'B2B SaaS'
        })
      });
      const auditResult = await auditResponse.json();
      
      let publishStatus = 'pending';
      let liveUrl = null;

      if (auditResult.status === 'APPROVED') {
        this.logger.info(`[${runId}] Senate APPROVED. Triggering Firebase Deployment...`);
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
        } else {
          publishStatus = 'deployment_failed';
        }
      } else {
         this.logger.warn(`[${runId}] Senate VETO triggered! Feedback: ${auditResult.reason}`);
         publishStatus = 'vetoed';
      }

      const finalOutcome = {
        runId: groundingResult.run_id,
        topic,
        content: auditResult.html_ready_for_deploy || groundingResult.content,
        audit: auditResult,
        status: publishStatus,
        liveUrl,
        agent: 'CC-06 Director (Grounded)',
        timestamp: new Date().toISOString()
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
        telemetry: groundingResult.sources,
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
