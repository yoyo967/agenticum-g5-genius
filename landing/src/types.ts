export interface AgentStatus {
  id: string;
  name: string;
  color: string;
  state: string;
  lastStatus: string;
  progress: number;
}

export interface SwarmState extends AgentStatus {
  subAgents: Record<string, AgentStatus>;
}
