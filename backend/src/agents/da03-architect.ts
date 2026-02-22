import { BaseAgent, AgentState } from './base-agent';
import { VertexAIService } from '../services/vertex-ai';
import fs from 'fs';
import path from 'path';

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
    let imageUrl = await vertexAI.generateImage(input);
    
    // Phase 2: Functional Asset Persistence
    if (imageUrl.startsWith('data:image')) {
      try {
        const base64Data = imageUrl.split(',')[1];
        const filename = `DA03-${Date.now()}.jpg`;
        const vaultPath = path.join(process.cwd(), 'data', 'vault');
        
        if (!fs.existsSync(vaultPath)) fs.mkdirSync(vaultPath, { recursive: true });
        
        fs.writeFileSync(path.join(vaultPath, filename), base64Data, 'base64');
        this.logger.info(`Saved asset to vault: ${filename}`);
        imageUrl = `http://localhost:8080/vault/${filename}`;
      } catch (e) {
        this.logger.error('Failed to save image to vault', e as Error);
      }
    }

    this.logger.info(`Asset finalized for: ${input}`);

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
