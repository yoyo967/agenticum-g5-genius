import { Logger } from '../utils/logger';
import { eventFabric } from './event-fabric';

export interface Intervention {
  taskId: string;
  directive: string;
  timestamp: number;
}

export class InterventionManager {
  private logger: Logger;
  private static instance: InterventionManager;
  private pendingInterventions: Map<string, string> = new Map();

  private constructor() {
    this.logger = new Logger('InterventionManager');
  }

  public static getInstance(): InterventionManager {
    if (!InterventionManager.instance) {
      InterventionManager.instance = new InterventionManager();
    }
    return InterventionManager.instance;
  }

  public handleIntervention(data: Intervention) {
    this.logger.info(`Received Executive Intervention for Task [${data.taskId}]: ${data.directive}`);
    this.pendingInterventions.set(data.taskId, data.directive);
    
    eventFabric.broadcast({
      type: 'intervention-received',
      data: {
        taskId: data.taskId,
        directive: data.directive
      }
    });
  }

  /**
   * Agents can call this to see if there's an active directive for them.
   */
  public getDirective(taskId: string): string | undefined {
    const directive = this.pendingInterventions.get(taskId);
    if (directive) {
      this.pendingInterventions.delete(taskId);
    }
    return directive;
  }

  /**
   * Utility to wait for user intervention if a certain condition is met.
   * In a real system, this would involve a promise that resolves when a socket event arrives.
   */
  public async waitForIntervention(taskId: string, timeoutMs: number = 30000): Promise<string | null> {
    this.logger.info(`Task [${taskId}] is WAITING for executive directive...`);
    
    eventFabric.broadcast({
      type: 'awaiting-intervention',
      data: { taskId }
    });

    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const directive = this.getDirective(taskId);
      if (directive) return directive;
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    this.logger.warn(`Intervention timeout for Task [${taskId}]. Proceeding autonomously.`);
    return null;
  }
}
