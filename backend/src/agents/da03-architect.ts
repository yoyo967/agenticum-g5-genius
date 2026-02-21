import { BaseAgent, AgentState } from './base-agent';
import { VertexAIService } from '../services/vertex-ai';

export class DA03Architect extends BaseAgent {
  private readonly DIRECTIVES = `
    IDENTITY: You are the GenIUS Design Architect (DA-03).
    KNOWLEDGE BASE:
    - Bauhaus Philosophy: Form follows Function
    - Itten's 7 Color Contrasts & 60-30-10 Rule
    - Golden Ratio & Rule of Thirds
    - Nielsen-Norman (NNGroup) 10 Heuristics
    - Cognitive Load Theory & Fitts's Law
    - WCAG Accessibility Standards
  `;

  constructor() {
    super({
      id: 'da-03',
      name: 'Design Architecture Genius',
      color: '#A855F7'
    });
  }

  async execute(input: string): Promise<string> {
    this.updateStatus(AgentState.THINKING, 'Synthesizing visual language and color psychology...');
    
    const vertexAI = VertexAIService.getInstance();

    this.updateStatus(AgentState.WORKING, 'Applying Bauhaus Principles & Golden Ratio...', 40);
    const imageUrl = await vertexAI.generateImage(input);
    this.logger.info(`Generated Image byte-stream for: ${input}`);

    this.updateStatus(AgentState.WORKING, 'Optimizing for Cognitive Load & Fitts Law...', 75);
    
    const prompt = `
      ${this.DIRECTIVES}
      TASK: Create a design manifesto for: "${input}"
      NOTE: An image has already been generated using Imagen 3.
      
      REQUIREMENTS:
      1. Reference Itten's 7 Color Contrasts.
      2. Explain the Golden Ratio grid application.
      3. Format as a clean, authoritative technical manifesto.
    `;

    const manifesto = await vertexAI.generateContent(prompt);

    this.updateStatus(AgentState.DONE, 'Design architecture finalized. Assets ready.', 100);
    return `
      ${manifesto}
      
      ### 🖼️ GENIUS ASSET GENERATION
      ![Neural Core Genesis](${imageUrl})
    `;
  }
}
