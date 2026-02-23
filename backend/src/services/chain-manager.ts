import { Logger } from '../utils/logger';
import { eventFabric } from './event-fabric';
import { Task, TaskState, SwarmProtocol } from '../types/swarm-protocol';
import { SP01Strategist } from '../agents/sp01-strategist';
import { CC06Director } from '../agents/cc06-director';
import { DA03Architect } from '../agents/da03-architect';
import { RA01Auditor } from '../agents/ra01-auditor';
import { PM07Manager } from '../agents/pm07-manager';
import { VE01Director } from '../agents/ve01-director';

export class ChainManager {
  private logger: Logger;
  private activeProtocol: SwarmProtocol | null = null;
  private agents: Record<string, any> = {};

  constructor() {
    this.logger = new Logger('ChainManager');
    // Initialize agents
    this.agents['sp-01'] = new SP01Strategist();
    this.agents['cc-06'] = new CC06Director();
    this.agents['da-03'] = new DA03Architect();
    this.agents['ra-01'] = new RA01Auditor();
    this.agents['pm-07'] = new PM07Manager();
    this.agents['ve-01'] = new VE01Director();
  }

  public pauseProtocol() {
    if (this.activeProtocol) {
      this.activeProtocol.status = 'paused';
      this.logger.info(`Protocol ${this.activeProtocol.id} PAUSED.`);
      eventFabric.broadcast({ type: 'protocol-paused', protocol: this.activeProtocol });
    }
  }

  public resumeProtocol() {
    if (this.activeProtocol && this.activeProtocol.status === 'paused') {
      this.activeProtocol.status = 'active';
      this.logger.info(`Protocol ${this.activeProtocol.id} RESUMED.`);
      eventFabric.broadcast({ type: 'protocol-resumed', protocol: this.activeProtocol });
    }
  }

  public async executeProtocol(protocol: SwarmProtocol) {
    this.activeProtocol = protocol;
    this.logger.info(`Activating Protocol: ${protocol.id} - Goal: ${protocol.goal}`);
    
    eventFabric.broadcast({ type: 'protocol-activated', protocol });

    while (this.hasPendingTasks()) {
      if (this.activeProtocol?.status === 'paused') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      const runnableTasks = this.getRunnableTasks();
      if (runnableTasks.length === 0 && this.hasRunningTasks()) {
        // Wait for running tasks to complete (simple poll for now, could use events)
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      if (runnableTasks.length === 0 && !this.hasRunningTasks()) {
        this.logger.error('Deadlock detected in SwarmProtocol graph.');
        break;
      }

      // Execute runnable tasks in parallel
      await Promise.all(runnableTasks.map(task => this.executeTask(task)));
    }

    this.logger.info(`Protocol ${protocol.id} Execution Finished.`);
    eventFabric.broadcast({ type: 'protocol-finished', protocol: this.activeProtocol });
  }

  private async executeTask(task: Task) {
    task.state = TaskState.RUNNING;
    task.startTime = Date.now();
    this.logger.info(`Starting Task [${task.id}] on Agent [${task.agentId}]`);
    
    eventFabric.broadcast({ type: 'task-update', task });

    const agent = this.agents[task.agentId];
    if (!agent) {
      this.logger.error(`Agent ${task.agentId} not found for task ${task.id}`);
      task.state = TaskState.FAILED;
      task.error = 'Agent not found';
      return;
    }

    try {
      // Collect results from dependencies
      const dependencies = task.dependencies.map(depId => 
        this.activeProtocol?.tasks.find(t => t.id === depId)
      ).filter(t => !!t);
      
      const contextFromDeps = dependencies.map(t => 
        `RESULT FROM [${t?.agentId}]:\n${t?.result}`
      ).join('\n\n');

      const fullPrompt = contextFromDeps 
        ? `TASK: ${task.description}\n\nDEPENDENCY CONTEXT:\n${contextFromDeps}`
        : task.description;

      const result = await agent.execute(fullPrompt); 
      task.result = result;
      task.state = TaskState.COMPLETED;
      task.endTime = Date.now();
      
      this.logger.info(`Task [${task.id}] Completed.`);
      eventFabric.broadcast({ type: 'task-update', task });
    } catch (err: any) {
      this.logger.error(`Task [${task.id}] Failed: ${err.message}`);
      task.state = TaskState.FAILED;
      task.error = err.message;
      eventFabric.broadcast({ type: 'task-update', task });
    }
  }

  private hasPendingTasks() {
    return this.activeProtocol?.tasks.some(t => t.state === TaskState.PENDING || t.state === TaskState.RUNNING) ?? false;
  }

  private hasRunningTasks() {
    return this.activeProtocol?.tasks.some(t => t.state === TaskState.RUNNING) ?? false;
  }

  private getRunnableTasks() {
    if (!this.activeProtocol) return [];
    return this.activeProtocol.tasks.filter(task => {
      if (task.state !== TaskState.PENDING) return false;
      // Check if all dependencies are COMPLETED
      return task.dependencies.every(depId => {
        const depTask = this.activeProtocol!.tasks.find(t => t.id === depId);
        return depTask?.state === TaskState.COMPLETED;
      });
    });
  }
}
