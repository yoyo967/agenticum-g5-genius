import { Logger } from '../utils/logger';
import { db, Collections } from './firestore';
import { eventFabric } from './event-fabric';

export interface WorldState {
  activeModule: string;
  currentUserIntent: string;
  swarmHealth: number;
  lastCognitiveEvent: string;
  insights: string[];
  globalKnowledge: string[];
  historicalPrecedents: Array<{ task: string; successScore: number; strategy: string }>;
}

export class NexusManager {
  private static instance: NexusManager;
  private logger: Logger;
  private state: WorldState;

  private constructor() {
    this.logger = new Logger('NexusManager');
    this.state = {
      activeModule: 'ExecutiveDashboard',
      currentUserIntent: '',
      swarmHealth: 100,
      lastCognitiveEvent: 'Nexus Initialized',
      insights: [],
      globalKnowledge: [],
      historicalPrecedents: []
    };
  }

  public static getInstance(): NexusManager {
    if (!NexusManager.instance) {
      NexusManager.instance = new NexusManager();
    }
    return NexusManager.instance;
  }

  public async updateState(delta: Partial<WorldState>) {
    this.state = { ...this.state, ...delta };
    this.logger.info(`Nexus State Updated: ${JSON.stringify(delta)}`);
    eventFabric.broadcast({ type: 'nexus-state-update', state: this.state });
  }

  public getState(): WorldState {
    return this.state;
  }

  /**
   * Infinity Evolution: Learns from system logs and user interactions
   * to refine the global intelligence field.
   */
  public async evolve() {
    try {
      this.logger.info('Nexus initiating recursive evolution...');
      
      const logs = await db.collection('perfect_twin_logs')
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get();

      const newInsights = logs.docs.map(doc => doc.data().message);
      this.state.insights = [...new Set([...this.state.insights, ...newInsights])].slice(-50);
      
      eventFabric.broadcast({ 
        type: 'nexus-evolution', 
        insight: 'Cognitive patterns reconciled with Perfect Twin logs.' 
      });
    } catch (err) {
      this.logger.error('Nexus evolution cycle failed', err as Error);
    }
  }

  public getGlobalContext(): string {
    return `
      CURRENT_NEXUS_WORLD_STATE:
      - Active Module: ${this.state.activeModule}
      - Swarm Health: ${this.state.swarmHealth}%
      - Recent Insights: ${this.state.insights.slice(-3).join(' | ')}
      - Global Knowledge: ${this.state.globalKnowledge.slice(-3).join(' | ')}
      - Historical Precedents: ${this.state.historicalPrecedents.length} success patterns available.
      - Evolution Status: INFINITY_EVOLUTIONS_SENTIENT
    `;
  }

  /**
   * Records a successful tactical outcome to the Golden Library.
   */
  public async recordSuccess(task: string, score: number, strategy: string) {
    this.state.historicalPrecedents.push({ task, successScore: score, strategy });
    if (this.state.historicalPrecedents.length > 100) this.state.historicalPrecedents.shift();
    
    this.logger.info(`Nexus archived success pattern for: ${task} (Score: ${score})`);
    
    eventFabric.broadcast({ 
      type: 'nexus-memory-uplink', 
      pattern: `Strategy for [${task.substring(0, 20)}...] archived with GenIUS Score: ${score}` 
    });
  }
}

export const nexusManager = NexusManager.getInstance();
