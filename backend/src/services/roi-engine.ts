import { Logger } from '../utils/logger';
import { eventFabric } from './event-fabric';

export interface ChannelPerformance {
  channel: string;
  ctr: number;
  cvr: number;
  spend: number;
  revenue: number;
  roi: number;
}

export class ROIEngine {
  private logger = new Logger('ROIEngine');
  private static instance: ROIEngine;

  private constructor() {}

  public static getInstance(): ROIEngine {
    if (!ROIEngine.instance) {
      ROIEngine.instance = new ROIEngine();
    }
    return ROIEngine.instance;
  }

  /**
   * Analyzes current performance and suggests budget reallocation.
   */
  public async analyzeAndOptimize(): Promise<{ 
    current: ChannelPerformance[], 
    suggestions: string[],
    optimizedSpend: Record<string, number> 
  }> {
    this.logger.info('Initiating ROI Analysis & Budget Optimization...');

    // Simulated data representing a split between Search, Social, and Video
    const performance: ChannelPerformance[] = [
      { channel: 'Google Search', ctr: 0.045, cvr: 0.12, spend: 1200, revenue: 4800, roi: 4.0 },
      { channel: 'Meta Social', ctr: 0.012, cvr: 0.04, spend: 800, revenue: 1600, roi: 2.0 },
      { channel: 'YouTube Video', ctr: 0.008, cvr: 0.02, spend: 1500, revenue: 2250, roi: 1.5 }
    ];

    const suggestions: string[] = [];
    const optimizedSpend: Record<string, number> = {};

    // Logic: Shift budget from low ROI to high ROI
    performance.forEach(ch => {
      if (ch.roi < 2.0) {
        suggestions.push(`High inefficiency detected in ${ch.channel}. Suggesting 30% budget reduction.`);
        optimizedSpend[ch.channel] = ch.spend * 0.7;
      } else if (ch.roi > 3.0) {
        suggestions.push(`Excellent ROI in ${ch.channel}. Suggesting 25% budget increase for scale.`);
        optimizedSpend[ch.channel] = ch.spend * 1.25;
      } else {
        optimizedSpend[ch.channel] = ch.spend;
      }
    });

    eventFabric.broadcast({ 
      type: 'roi-update', 
      performance, 
      suggestions 
    });

    return { current: performance, suggestions, optimizedSpend };
  }
}

export const roiEngine = ROIEngine.getInstance();
