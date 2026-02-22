export enum AgentState {
  THINKING = 'thinking',
  WORKING = 'working',
  RESEARCHING = 'researching',
  VERIFYING = 'verifying',
  AUDITING = 'auditing',
  DONE = 'done',
  ERROR = 'error'
}

export interface AgentStatus {
  state: AgentState;
  message: string;
  progress?: number;
  lastUpdate: string;
}

export interface GroundingMetadata {
  queries: string[];
  sources: string[];
  entityCount: number;
}
