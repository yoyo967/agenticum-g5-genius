import { Logger } from '../utils/logger';
import { eventFabric } from './event-fabric';
import { Task, TaskState, SwarmProtocol } from '../types/swarm-protocol';
import { SP01Strategist } from '../agents/sp01-strategist';
import { CC06Director } from '../agents/cc06-director';
import { DA03Architect } from '../agents/da03-architect';
import { RA01Auditor } from '../agents/ra01-auditor';
import { PM07Manager } from '../agents/pm07-manager';
import { VE01Director } from '../agents/ve01-director';
import { SN00Orchestrator } from '../agents/sn00-orchestrator';
import { BA07BrowserArchitect } from '../agents/ba07-browser-architect';

export class ChainManager {
  private logger: Logger;
  private activeProtocol: SwarmProtocol | null = null;
  private agents: Record<string, any> = {};
  private static instance: ChainManager;

  private constructor() {
    this.logger = new Logger('ChainManager');
    // Agents will be registered via registerAgent or lazy-loaded to avoid circular deps
  }

  public static getInstance(): ChainManager {
    if (!ChainManager.instance) {
      ChainManager.instance = new ChainManager();
    }
    return ChainManager.instance;
  }

  public getAgent(id: string) {
    if (this.agents[id]) return this.agents[id];

    // Lazy instantiation to prevent circular dependencies
    switch (id.toLowerCase()) {
      case 'sn00':
        const { SN00Orchestrator } = require('../agents/sn00-orchestrator');
        this.agents['sn00'] = new SN00Orchestrator();
        break;
      case 'sp01':
        const { SP01Strategist } = require('../agents/sp01-strategist');
        this.agents['sp01'] = new SP01Strategist();
        break;
      case 'cc06':
        const { CC06Director } = require('../agents/cc06-director');
        this.agents['cc06'] = new CC06Director();
        break;
      case 'da03':
        const { DA03Architect } = require('../agents/da03-architect');
        this.agents['da03'] = new DA03Architect();
        break;
      case 'ra01':
        const { RA01Auditor } = require('../agents/ra01-auditor');
        this.agents['ra01'] = new RA01Auditor();
        break;
      case 'pm07':
        const { PM07Manager } = require('../agents/pm07-manager');
        this.agents['pm07'] = new PM07Manager();
        break;
      case 've01':
        const { VE01Director } = require('../agents/ve01-director');
        this.agents['ve01'] = new VE01Director();
        break;
      case 'ba07':
        const { BA07BrowserArchitect } = require('../agents/ba07-browser-architect');
        this.agents['ba07'] = new BA07BrowserArchitect();
        break;
    }
    return this.agents[id];
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

    const agent = this.getAgent(task.agentId);
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
