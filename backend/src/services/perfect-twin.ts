import { Firestore, Timestamp } from '@google-cloud/firestore';
import { Logger } from '../utils/logger';

export interface TwinLog {
  runId: string;
  agentId: string;
  step: string;
  input: any;
  output: any;
  provenance: string[];
  telemetry?: {
    searchQueries?: string[];
    groundingSources?: string[];
    modelVersion?: string;
  };
  senate_evaluation?: {
    compliance_score: number;
    seo_excellence_score: number;
    veto_triggered: boolean;
    feedback: string;
  };
  senate_approved?: boolean;
  evalResult?: any;
  timestamp: Date;
}

export class PerfectTwinService {
  private db: Firestore;
  private logger = new Logger('PerfectTwin');
  private static instance: PerfectTwinService;

  private constructor() {
    this.db = new Firestore({
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'online-marketing-manager'
    });
  }

  public static getInstance(): PerfectTwinService {
    if (!PerfectTwinService.instance) {
      PerfectTwinService.instance = new PerfectTwinService();
    }
    return PerfectTwinService.instance;
  }

  async logEvent(log: TwinLog) {
    try {
      this.logger.info(`[${log.runId}] Artifact created by ${log.agentId} at step ${log.step}`);
      await this.db.collection('perfect_twin_logs').add({
        ...log,
        timestamp: Timestamp.fromDate(log.timestamp || new Date())
      });
    } catch (error) {
      this.logger.error('Failed to write to Perfect Twin Archive', error as Error);
      // Fallback to local log if firestore fails to ensure provenance is never lost
    }
  }
}
