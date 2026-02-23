import cron, { ScheduledTask as CronTask } from 'node-cron';
import { Logger } from '../utils/logger';
import { PillarGraphOrchestrator } from './orchestrator';

interface ScheduledTask {
  id: string;
  name: string;
  schedule: string;
  workflowId: string;
  status: 'active' | 'paused';
}

export class CronScheduler {
  private logger = new Logger('CronScheduler');
  private tasks: Map<string, CronTask> = new Map();
  private db: ScheduledTask[] = [];

  constructor() {
    this.logger.info('Initializing Agency Autopilot (CronService)...');
    this.loadTasks();
  }

  private loadTasks() {
    // In production, this would fetch from Firestore `workflows` collection
    this.db = [
      { id: 'job_1', name: 'Weekly Competitor Analysis', schedule: '0 8 * * 1', workflowId: 'wf_001', status: 'active' },
      { id: 'job_2', name: 'Daily Social Post Generation', schedule: '0 9 * * *', workflowId: 'wf_002', status: 'paused' }
    ];

    this.db.forEach(task => {
      if (task.status === 'active') {
        this.scheduleTask(task);
      }
    });

    this.logger.info(`Loaded ${this.db.length} autopilot sequences. ${this.tasks.size} currently active.`);
  }

  private scheduleTask(task: ScheduledTask) {
    const job = cron.schedule(task.schedule, () => {
      this.logger.info(`[AUTOPILOT] Triggering Mission Cycle: ${task.name}`);
      this.executeMissionCycle(task);
    });

    this.tasks.set(task.id, job);
  }

  private async executeMissionCycle(task: ScheduledTask) {
    try {
      const topics = [
        'Autonomous AI Marketing Swarms in 2026',
        'Ethical AI Design: The Bauhaus of GenAI',
        'Predictive Performance Max: Zero-Wait Attribution',
        'The Geopolitics of Sovereign AI Clouds'
      ];
      const selectedTopic = topics[Math.floor(Math.random() * topics.length)];
      
      this.logger.info(`[AUTOPILOT] Mission selected: ${selectedTopic}`);
      const { eventFabric } = require('./event-fabric');
      eventFabric.broadcast({ 
        type: 'autopilot-trigger', 
        name: task.name,
        topic: selectedTopic 
      });

      const orchestrator = PillarGraphOrchestrator.getInstance();
      await orchestrator.executePillarRun(selectedTopic, { type: 'pillar', source: 'autopilot' });

      this.logger.info(`[AUTOPILOT] Mission Cycle for ${task.id} complete.`);
    } catch (error) {
      this.logger.error(`[AUTOPILOT] Mission Cycle for ${task.id} failed`, error as Error);
    }
  }

  public scheduleOneOffTask(name: string, date: Date, action: () => Promise<void>) {
    const now = new Date();
    const delay = date.getTime() - now.getTime();
    
    if (delay <= 0) {
      this.logger.warn(`Schedule date for ${name} is in the past. Executing immediately.`);
      action();
      return;
    }

    this.logger.info(`Scheduled one-off task [${name}] for ${date.toISOString()}`);
    setTimeout(async () => {
      this.logger.info(`[AUTOPILOT] Triggering One-Off Task: ${name}`);
      await action();
    }, delay);
  }

  public getActiveTasks() {
    return this.db;
  }
}

export const autopilotService = new CronScheduler();
