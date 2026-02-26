import { Logger } from '../utils/logger';
import { db } from './firestore';
import { eventFabric } from './event-fabric';

export interface BudgetConfig {
  dailyLimitUSD: number;
  monthlyLimitUSD: number;
  currentDailySpendUSD: number;
  currentMonthlySpendUSD: number;
  alertThreshold: number; // 0.0 - 1.0 (percentage)
}

export class BudgetGuardrail {
  private logger = new Logger('BudgetGuardrail');
  private static instance: BudgetGuardrail;
  private config: BudgetConfig = {
    dailyLimitUSD: 50,
    monthlyLimitUSD: 500,
    currentDailySpendUSD: 0,
    currentMonthlySpendUSD: 0,
    alertThreshold: 0.8
  };

  private constructor() {
    this.loadConfig();
  }

  public static getInstance(): BudgetGuardrail {
    if (!BudgetGuardrail.instance) {
      BudgetGuardrail.instance = new BudgetGuardrail();
    }
    return BudgetGuardrail.instance;
  }

  private async loadConfig() {
    try {
      const doc = await db.collection('system_config').doc('budget').get();
      if (doc.exists) {
        this.config = { ...this.config, ...doc.data() as BudgetConfig };
      } else {
        await db.collection('system_config').doc('budget').set(this.config);
      }
    } catch (err) {
      this.logger.error('Failed to load budget config', err as Error);
    }
  }

  public async trackUsage(model: string, tokens: number = 0) {
    // Simulated cost calculation for Gemini 2.0 Flash
    // $0.10 per 1M input tokens, $0.40 per 1M output tokens (approximation)
    const estimatedCost = (tokens / 1_000_000) * 0.25; 
    
    this.config.currentDailySpendUSD += estimatedCost;
    this.config.currentMonthlySpendUSD += estimatedCost;

    this.logger.info(`Tracked usage for [${model}]: +$${estimatedCost.toFixed(6)} USD`);

    if (this.isThresholdBreached()) {
      this.triggerAlert();
    }

    // Persist async
    db.collection('system_config').doc('budget').update({
      currentDailySpendUSD: this.config.currentDailySpendUSD,
      currentMonthlySpendUSD: this.config.currentMonthlySpendUSD
    }).catch(e => this.logger.error('Failed to persist budget update', e));
  }

  public isThresholdBreached(): boolean {
    return (this.config.currentDailySpendUSD / this.config.dailyLimitUSD) >= this.config.alertThreshold;
  }

  public canProceed(): boolean {
    return this.config.currentDailySpendUSD < this.config.dailyLimitUSD && 
           this.config.currentMonthlySpendUSD < this.config.monthlyLimitUSD;
  }

  private triggerAlert() {
    const usagePercent = ((this.config.currentDailySpendUSD / this.config.dailyLimitUSD) * 100).toFixed(1);
    this.logger.warn(`BUDGET ALERT: Daily usage at ${usagePercent}% ($${this.config.currentDailySpendUSD.toFixed(2)})`);
    
    eventFabric.broadcast({
      type: 'budget-alert',
      data: {
        severity: 'HIGH',
        message: `Neural budget threshold reached (${usagePercent}%). Pausing non-critical background jobs.`,
        currentSpend: this.config.currentDailySpendUSD,
        limit: this.config.dailyLimitUSD
      }
    });
  }

  public getConfig(): BudgetConfig {
    return { ...this.config };
  }
}

export const budgetGuardrail = BudgetGuardrail.getInstance();
