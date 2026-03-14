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
  private activeProtocols: Map<string, SwarmProtocol> = new Map();
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

  public registerAgent(id: string, agent: any) {
    this.agents[id] = agent;
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

  public async pauseProtocol(runId: string) {
    const protocol = this.activeProtocols.get(runId);
    if (protocol) {
      protocol.status = 'paused';
      this.logger.info(`Protocol ${runId} PAUSED.`);
      
      const { db, Collections } = require('./firestore');
      await db.collection(Collections.SWARM_RUNS).doc(runId).update({ status: 'paused' });
      
      eventFabric.broadcast({ type: 'protocol-paused', protocol });
    }
  }

  public async resumeProtocol(runId: string) {
    const protocol = this.activeProtocols.get(runId);
    if (protocol && protocol.status === 'paused') {
      protocol.status = 'active';
      this.logger.info(`Protocol ${runId} RESUMED.`);
      
      const { db, Collections } = require('./firestore');
      await db.collection(Collections.SWARM_RUNS).doc(runId).update({ status: 'active' });
      
      eventFabric.broadcast({ type: 'protocol-resumed', protocol });
    }
  }

  public async executeProtocol(protocol: SwarmProtocol) {
    this.activeProtocols.set(protocol.id, protocol);
    this.logger.info(`Activating Protocol: ${protocol.id} - Goal: ${protocol.goal}`);
    
    // Phase 1: Initial Persistence
    try {
      const { db, Collections } = require('./firestore');
      await db.collection(Collections.SWARM_RUNS).doc(protocol.id).set(protocol);
    } catch (e) {
      this.logger.warn(`Failed to persist initial protocol ${protocol.id}`, e as Error);
    }

    eventFabric.broadcast({ type: 'protocol-activated', protocol });

    while (this.hasPendingTasks(protocol.id)) {
      if (this.activeProtocols.get(protocol.id)?.status === 'paused') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      const runnableTasks = this.getRunnableTasks(protocol.id);
      if (runnableTasks.length === 0 && this.hasRunningTasks(protocol.id)) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      if (runnableTasks.length === 0 && !this.hasRunningTasks(protocol.id)) {
        this.logger.error('Deadlock detected in SwarmProtocol graph.');
        protocol.status = 'failed';
        try {
          const { db, Collections } = require('./firestore');
          await db.collection(Collections.SWARM_RUNS).doc(protocol.id).update({ status: 'failed' });
        } catch (e) {}
        break;
      }

      // Execute runnable tasks in parallel
      await Promise.all(runnableTasks.map(task => this.executeTask(protocol.id, task)));
    }

    this.logger.info(`Protocol ${protocol.id} Execution Finished.`);
    
    // Update final status in Firestore
    protocol.status = 'completed';
    try {
      const { db, Collections } = require('./firestore');
      await db.collection(Collections.SWARM_RUNS).doc(protocol.id).update({ 
         status: 'completed',
         finishedAt: Date.now()
      });
    } catch (e) {}

    this.activeProtocols.delete(protocol.id);
    eventFabric.broadcast({ type: 'protocol-finished', protocol });
  }

  private async executeTask(protocolId: string, task: Task) {
    const protocol = this.activeProtocols.get(protocolId);
    if (!protocol) return;

    task.state = TaskState.RUNNING;
    task.startTime = Date.now();
    this.logger.info(`Starting Task [${task.id}] on Agent [${task.agentId}]`);
    
    // Sync task state to Firestore
    this.syncTaskState(protocolId, task);
    
    eventFabric.broadcast({ type: 'task-update', task });

    const agent = this.getAgent(task.agentId);
    if (!agent) {
      this.logger.error(`Agent ${task.agentId} not found for task ${task.id}`);
      task.state = TaskState.FAILED;
      task.error = 'Agent not found';
      return;
    }

    // Phase 1: Context Synchronization
    if (protocol && typeof agent.setContext === 'function') {
      agent.setContext(protocol.id, protocol.campaignId);
    }

    try {
      // Collect results from dependencies
      const dependencies = task.dependencies.map(depId => 
        protocol.tasks.find(t => t.id === depId)
      ).filter(t => !!t);
      
      const contextFromDeps = dependencies.map((t: any) => 
        `RESULT FROM [${t?.agentId}]:\n${t?.result}`
      ).join('\n\n');

      const swarmGoal = protocol.goal;

      const formattedDeps = dependencies.map((t: any) => {
        const result = typeof t?.result === 'string' ? t.result.substring(0, 2000) : '';
        return `[${(t?.agentId || '').toUpperCase()} RESULT]:\n${result}`;
      }).join('\n\n---\n\n');

      const fullPrompt = [
        `SWARM_GOAL: ${swarmGoal}`,
        `YOUR_TASK: ${task.description}`,
        formattedDeps ? `PRIOR_INTELLIGENCE:\n${formattedDeps}` : '',
      ].filter(Boolean).join('\n\n').trim();

      let finalPrompt = fullPrompt;
      if (task.interventionRequired) {
        const { InterventionManager } = require('./intervention-manager');
        const directive = await InterventionManager.getInstance().waitForIntervention(task.id);
        if (directive) {
          finalPrompt = `EXECUTIVE DIRECTIVE:\n${directive}\n\nORIGINAL TASK:\n${fullPrompt}`;
          this.logger.info(`Applying executive directive to Task [${task.id}]`);
        }
      }

      let result;
      const TIMEOUT_MS = 120000; // 120s safety timeout
      
      const executionPromise = (async () => {
        if (task.sentient) {
          const { SentientLoopService } = require('./sentient-loop');
          const loop = await SentientLoopService.getInstance().refine(
            task.agentId,
            fullPrompt,
            task.maxIterations || 3
          );
          return loop.finalOutput;
        } else {
          return await agent.execute(fullPrompt); 
        }
      })();

      result = await Promise.race([
        executionPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Agent execution timeout (120s)')), TIMEOUT_MS))
      ]);
      
      task.result = result;
      task.state = TaskState.COMPLETED;
      task.endTime = Date.now();
      
      // Phase 33: Dynamic Knowledge Persistence
      const { nexusManager } = require('./nexus-manager');
      nexusManager.recordSuccess(
        task.description,
        85, // Default score
        typeof result === 'string' ? result.substring(0, 500) : 'Structured Data Outcome'
      );

      nexusManager.updateState({
        lastCognitiveEvent: `Task [${task.id}] finalized by ${task.agentId}`,
        globalKnowledge: [...nexusManager.getState().globalKnowledge, `INTEL_${task.agentId}: ${task.description.substring(0, 50)}...`].slice(-20)
      });

      this.logger.info(`Task [${task.id}] Completed and archived in Nexus.`);
      eventFabric.broadcast({ type: 'task-update', task });
    } catch (err: any) {
      this.logger.error(`Task [${task.id}] Failed: ${err.message}`);
      task.state = TaskState.FAILED;
      task.error = err.message;
      eventFabric.broadcast({ type: 'task-update', task });
    }
  }

  private async syncTaskState(protocolId: string, task: Task) {
    const protocol = this.activeProtocols.get(protocolId);
    if (!protocol) return;
    try {
      const { db, Collections } = require('./firestore');
      const protocolRef = db.collection(Collections.SWARM_RUNS).doc(protocol.id);
      
      // Update the entire tasks array to ensure Firestore consistency
      await protocolRef.update({
        tasks: protocol.tasks
      });
    } catch (e) {
      this.logger.warn(`Failed to sync task ${task.id} to Firestore`, e as Error);
    }
  }

  private hasPendingTasks(protocolId: string) {
    const protocol = this.activeProtocols.get(protocolId);
    return protocol?.tasks.some(t => t.state === TaskState.PENDING || t.state === TaskState.RUNNING) ?? false;
  }

  private hasRunningTasks(protocolId: string) {
    const protocol = this.activeProtocols.get(protocolId);
    return protocol?.tasks.some(t => t.state === TaskState.RUNNING) ?? false;
  }

  private getRunnableTasks(protocolId: string) {
    const protocol = this.activeProtocols.get(protocolId);
    if (!protocol) return [];
    return protocol.tasks.filter(task => {
      if (task.state !== TaskState.PENDING) return false;
      // A task is runnable when all dependencies are COMPLETED or FAILED
      // (FAILED deps unblock downstream tasks so one crash doesn't deadlock the whole swarm)
      return task.dependencies.every(depId => {
        const depTask = protocol.tasks.find(t => t.id === depId);
        return depTask?.state === TaskState.COMPLETED || depTask?.state === TaskState.FAILED;
      });
    });
  }
}
