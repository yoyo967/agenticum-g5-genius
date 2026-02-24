import { VertexAIService } from './vertex-ai';
import { Logger } from '../utils/logger';
import { eventFabric } from './event-fabric';

export interface GroundingContext {
  topic: string;
  scope: 'competitor' | 'tech' | 'market' | 'general';
  results: string;
  timestamp: string;
}

export class GroundingEngine {
  private static instance: GroundingEngine;
  private vertex: VertexAIService;
  private logger: Logger;

  private constructor() {
    this.vertex = VertexAIService.getInstance();
    this.logger = new Logger('GroundingEngine');
  }

  public static getInstance(): GroundingEngine {
    if (!GroundingEngine.instance) {
      GroundingEngine.instance = new GroundingEngine();
    }
    return GroundingEngine.instance;
  }

  /**
   * Performs deep internet scavenging on a specific topic.
   */
  public async scavenge(topic: string, scope: GroundingContext['scope']): Promise<string> {
    this.logger.info(`Nexus scavenge sequence initiated for topic: [${topic}] in scope: [${scope}]`);
    
    eventFabric.broadcast({ 
      type: 'agent-thought', 
      agentId: 'nexus', 
      thought: `Piercing the global information veil for [${topic}]...` 
    });

    const systemPrompt = this.getSystemPrompt(scope);
    const researchPrompt = `TOPIC: ${topic}\n\n${systemPrompt}\n\nPerform a deep dive and return structured tactical intelligence.`;

    try {
      const result = await this.vertex.generateGroundedContent(researchPrompt);
      
      // Broadcast the discovery
      eventFabric.broadcast({ 
        type: 'sovereign-wisdom', 
        data: `Intelligence Acquired on [${topic}]: ${result.substring(0, 100)}...` 
      });

      return result;
    } catch (err) {
      this.logger.error('Scavenge sequence failed', err as Error);
      return `The external knowledge field for "${topic}" is currently shielded.`;
    }
  }

  private getSystemPrompt(scope: GroundingContext['scope']): string {
    switch (scope) {
      case 'competitor':
        return 'IDENTITY: Elite Competitive Intelligence Operative. TASK: Identify competitor technical stacks, pricing models, and specific "White Space" gaps in their offerings.';
      case 'tech':
        return 'IDENTITY: Principal Solutions Architect. TASK: Scout for cutting-edge libraries, APIs, and architectural patterns relevant to the project.';
      case 'market':
        return 'IDENTITY: Global Market Strategist. TASK: Analyze real-time consumer trends, emotional triggers, and high-conversion hooks.';
      default:
        return 'IDENTITY: Omni-Contextual Intelligence Service. TASK: Retrieve accurate, grounded, real-world data.';
    }
  }
}

export const groundingEngine = GroundingEngine.getInstance();
