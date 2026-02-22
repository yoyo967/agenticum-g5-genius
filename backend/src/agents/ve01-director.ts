import { BaseAgent, AgentState } from './base-agent';
import { VertexAIService } from '../services/vertex-ai';

export class VE01Director extends BaseAgent {
  private vertexAI: VertexAIService;

  constructor() {
    super({
      id: 've-01',
      name: 'Motion Director',
      color: '#FF6B00'
    });
    this.vertexAI = VertexAIService.getInstance();
  }

  async execute(input: string): Promise<string> {
    this.updateStatus(AgentState.THINKING, 'Analyzing motion prompt for Veo synthesis...', 10);
    
    try {
      this.updateStatus(AgentState.WORKING, 'Generating video via Veo / Imagen fallback...', 40);
      const videoUrl = await this.vertexAI.generateVideo(input);
      
      this.updateStatus(AgentState.DONE, 'Video synthesized successfully.', 100);
      return `[VIDEO_GENERATED]\nVideo URL: ${videoUrl}\nPrompt: ${input.substring(0, 100)}...`;
    } catch (e) {
      this.updateStatus(AgentState.ERROR, 'Video generation failed.', 0);
      return `[VIDEO_ERROR] Failed to generate video for: ${input}`;
    }
  }
}
