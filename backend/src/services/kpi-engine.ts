import { db, Collections } from './firestore';
import { Logger } from '../utils/logger';

export interface KPIMetric {
  type: 'click' | 'conversion' | 'view';
  campaignId: string;
  variantId?: string;
  platform: string;
  timestamp: Date;
  metadata?: any;
}

export class KPIEngineService {
  private logger: Logger;
  private static instance: KPIEngineService;

  private constructor() {
    this.logger = new Logger('KPIEngine');
  }

  public static getInstance(): KPIEngineService {
    if (!KPIEngineService.instance) {
      KPIEngineService.instance = new KPIEngineService();
    }
    return KPIEngineService.instance;
  }

  /**
   * Records a performance event.
   */
  async recordEvent(event: Omit<KPIMetric, 'timestamp'>): Promise<void> {
    try {
      this.logger.info(`Recording ${event.type} for campaign ${event.campaignId} (Variant: ${event.variantId || 'Default'})`);
      
      await db.collection(Collections.KPI_METRICS).add({
        ...event,
        timestamp: new Date(),
      });
    } catch (e) {
      this.logger.error('Failed to record KPI event', e as Error);
    }
  }

  /**
   * Initializes a mock A/B test sequence for demonstration.
   */
  async initializeMockABTest(campaignId: string) {
    this.logger.info(`Initializing Mock A/B Test for ${campaignId}`);
    
    const abTest = {
      campaignId,
      status: 'running',
      startedAt: new Date(),
      variants: [
        { id: 'v1', name: 'Obsidian Pulse', weight: 50 },
        { id: 'v2', name: 'Gold Precision', weight: 50 },
      ]
    };

    const docRef = await db.collection(Collections.AB_TESTS).add(abTest);
    return docRef.id;
  }
}

export const kpiEngine = KPIEngineService.getInstance();
