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
      this.logger.info(`[AUTOPILOT] Triggering Workflow [${task.workflowId}] for task: ${task.name}`);
      this.executeWorkflow(task.workflowId);
    });

    this.tasks.set(task.id, job);
  }

  private async executeWorkflow(workflowId: string) {
    this.logger.info(`Executing workflow blueprint ${workflowId}...`);
    
    if (workflowId === 'wf_001') {
      const orchestrator = PillarGraphOrchestrator.getInstance();
      orchestrator.executePillarRun('Autopilot: AI Agents Ecosystem', { type: 'pillar' })
        .then(res => this.logger.info(`[AUTOPILOT] Workflow ${workflowId} completed: ${res.runId}`))
        .catch(err => this.logger.error(`[AUTOPILOT] Workflow ${workflowId} failed`, err));
    } else {
      // Original simulation for other IDs
      setTimeout(() => {
        this.logger.info(`[WORKFLOW-${workflowId}] SN-00 initialized. Loading context from Vault...`);
      }, 1000);
    }
  }

  public getActiveTasks() {
    return this.db;
  }
}

export const autopilotService = new CronScheduler();
