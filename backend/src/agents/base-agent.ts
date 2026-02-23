import { Logger } from '../utils/logger';

export enum AgentState {
  IDLE = 'idle',
  THINKING = 'thinking',
  WORKING = 'working',
  DONE = 'done',
  ERROR = 'error'
}

export interface AgentConfig {
  id: string;
  name: string;
  role?: string;
  model?: string;
  color?: string;
  systemInstruction?: string;
}

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected logger: Logger;
  protected state: AgentState = AgentState.IDLE;
  protected progress: number = 0;
  protected lastStatus: string = '';
  public onStatusUpdate?: (status: any) => void;

  constructor(config: AgentConfig | string, name?: string, color?: string) {
    if (typeof config === 'string') {
      this.config = { id: config, name: name || config, color };
    } else {
      this.config = config;
    }
    this.logger = new Logger(this.config.id);
  }

  /**
   * Core execution logic for the agent.
   * Every agent in the GenIUS swarm must implement this.
   */
  abstract execute(input: any): Promise<any>;

  /**
   * Status reporting for the React Console.
   */
  protected updateStatus(state: AgentState, status: string, progress: number = 0) {
    this.state = state;
    this.lastStatus = status;
    this.progress = progress;
    this.logger.info(`[${state.toUpperCase()}] ${status} (${progress}%)`);
    
    const currentStatus = this.getStatus();
    
    // Phase 1: Real-time Event Fabric Broadcast
    const { eventFabric } = require('../services/event-fabric');
    eventFabric.broadcastStatus(currentStatus);

    if (this.onStatusUpdate) {
      this.onStatusUpdate(currentStatus);
    }
  }

  public get id(): string {
    return this.config.id;
  }

  public getStatus() {
    return {
      id: this.config.id,
      name: this.config.name,
      color: this.config.color,
      state: this.state,
      lastStatus: this.lastStatus,
      progress: this.progress
    };
  }

  public getConfig(): AgentConfig {
    return this.config;
  }
}
