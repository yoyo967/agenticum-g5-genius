export enum AgentState {
  IDLE = 'idle',
  THINKING = 'thinking',
  WORKING = 'working',
  DONE = 'done',
  ERROR = 'error'
}

export interface AgentStatus {
  state: AgentState;
  progress: number;
  message: string;
}

export abstract class BaseAgent {
  public id: string;
  public name: string;
  public color: string;
  private status: AgentStatus;

  constructor(id: string, name: string, color: string) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.status = {
      state: AgentState.IDLE,
      progress: 0,
      message: 'Agent initialized'
    };
  }

  public getStatus(): AgentStatus {
    return { ...this.status };
  }

  protected updateStatus(state: AgentState, message: string, progress: number = 0) {
    this.status = { state, message, progress };
    console.log(`[${this.name}] ${state.toUpperCase()}: ${message} (${progress}%)`);
    // Note: Emitting to Firestore/WebSocket will be handled by the Orchestrator
  }

  public abstract execute(input: unknown): Promise<unknown>;
}
