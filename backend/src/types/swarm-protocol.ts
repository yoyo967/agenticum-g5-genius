export enum TaskState {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  BLOCKED = 'blocked'
}

export interface Task {
  id: string;
  agentId: string;
  description: string;
  state: TaskState;
  dependencies: string[]; // IDs of tasks that must complete first
  result?: any;
  error?: string;
  startTime?: number;
  endTime?: number;
}

export interface SwarmProtocol {
  id: string;
  goal: string;
  tasks: Task[];
  status: 'active' | 'completed' | 'failed' | 'paused';
  createdAt: number;
}
