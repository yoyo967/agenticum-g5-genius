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

export interface WSEvent {
  type: string;
  agentId?: string;
  agent?: AgentStatus & { subAgents?: Record<string, AgentStatus> };
  data?: any;
  payload?: any;
  payloadType?: string;
  from?: string;
  to?: string;
  stats?: {
    total_latency: number;
    [key: string]: any;
  };
  protocol?: {
    id: string;
    goal: string;
    status: string;
  };
  task?: {
    id: string;
    agentId: string;
    state: string;
    description: string;
    result?: string;
  };
  thought?: string;
  lastStatus?: string;
  message?: string;
  state?: any;
  text?: string;
  campaignType?: string;
  mimeType?: string;
  metric?: string;
  value?: any;
}

export type ElementType = 'character' | 'environment' | 'object' | 'prompt';

export interface StoryboardElement {
  id: string;
  projectId: string;
  name: string;
  type: ElementType;
  images: string[];
  prompt: string;
  metadata?: Record<string, unknown>;
}

export interface StoryboardShot {
  id: string;
  sceneId: string;
  order: number;
  prompt: string;
  imageUrl?: string;
  videoUrl?: string;
  notes?: string;
  elements: string[]; // IDs of StoryboardElements
  shotReference?: string; // ID of another shot
  audioUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  elements: StoryboardElement[];
  storyboards: {
    id: string;
    title: string;
    scenes: {
      id: string;
      title: string;
      shots: StoryboardShot[];
    }[];
  }[];
}
