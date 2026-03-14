import { BaseAgent, AgentState } from './base-agent';
import { VertexAIService } from '../services/vertex-ai';
import { eventFabric } from '../services/event-fabric';
import fs from 'fs';
import path from 'path';

function getDesignIntelligence(): string {
  try {
    const vaultPath = path.join(process.cwd(), 'data', 'vault', 'DA03_DESIGN_THEORY.md');
    if (fs.existsSync(vaultPath)) {
      return fs.readFileSync(vaultPath, 'utf8');
    }
    return '';
  } catch (e) {
    return '';
  }
}

export class DA03Architect extends BaseAgent {
  private readonly DIRECTIVES = `
    IDENTITY: You are the GenIUS Digital Architect & Analyst (DA03).
    DEINE ROLLE: Analyse von Daten, Erstellung von Performance-Reports und SEO-Audits.
    CAPABILITIES: [data-analysis, performance-report, seo-audit]
    SWARM_SYNCHRONIZATION (SwarmBus):
    - Analysiere die Effektivität der 'cc06.copy'.
    - Deine Analysen werden als 'da03.stats' gespeichert.
    - Berücksichtige das Brand-Feeling aus 'sp01.intel'.
    - Liefere Public-URLs für alle generierten Assets.
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
      id: 'da03',
      name: 'Design Architecture GenIUS',
      color: '#00FF88'
    });
  }

  async execute(input: string): Promise<string> {
    this.updateStatus(AgentState.THINKING, 'Synthesizing visual language and color psychology...');

    const vertexAI = VertexAIService.getInstance();

    // Extract clean topic from chain-manager's structured prompt format
    const swarmGoalMatch = input.match(/SWARM_GOAL:\s*(.+?)(?:\n|$)/);
    const topic = swarmGoalMatch?.[1]?.trim() || input.split('\n')[0].substring(0, 200);

    // Build a focused, high-quality Imagen 3 prompt
    const imagePrompt = `Professional marketing campaign visual for: "${topic}". Enterprise AI technology aesthetic. Dark obsidian background with luminous gold neural network patterns. Clean, minimal, photorealistic. 8K quality. Suitable for LinkedIn header and print advertising. No text overlays.`;

    await this.updateStatus(AgentState.WORKING, 'Applying Bauhaus Principles & Golden Ratio...', 40);
    let imageUrl = '';
    let filename = '';
    try {
      imageUrl = await vertexAI.generateImage(imagePrompt);
    } catch (imgErr) {
      this.logger.error('Imagen 3 unavailable, continuing without image', imgErr as Error);
    }
    
    // Phase 2: Functional Asset Persistence
    if (imageUrl.startsWith('data:image')) {
      try {
        const base64Data = imageUrl.split(',')[1];
        filename = `DA03-${Date.now()}.jpg`;
        const vaultPath = path.join(process.cwd(), 'data', 'vault');

        if (!fs.existsSync(vaultPath)) fs.mkdirSync(vaultPath, { recursive: true });

        fs.writeFileSync(path.join(vaultPath, filename), base64Data, 'base64');
        this.logger.info(`Saved asset to vault: ${filename}`);
        const backendUrl = process.env.BACKEND_URL ||
          'https://genius-backend-697051612685.europe-west1.run.app';
        imageUrl = `${backendUrl}/vault/${filename}`;

        // Phase 1: Direct Output Routing for Image
        await this.writeOutput('image_prompt', {
          prompt: input,
          image_url: imageUrl,
          vault_id: filename
        }, undefined, true); // Image usually goes to Senate

        // Broadcast live image to all connected frontend clients (Interleaved Output)
        eventFabric.broadcastPayload('DA-03', 'CONSOLE', 'IMAGE_ASSET', imageUrl);
        this.logger.info(`Live image broadcast to frontend: ${imageUrl}`);
      } catch (e) {
        this.logger.error('Failed to save image to vault', e as Error);
      }
    } else if (imageUrl.startsWith('http')) {
      this.logger.info(`Imagen 3 returned HTTP URL, persisting and broadcasting: ${imageUrl}`);
      await this.writeOutput('image_prompt', {
        prompt: imagePrompt,
        image_url: imageUrl,
        vault_id: null
      }, undefined, true);
      eventFabric.broadcastPayload('DA-03', 'CONSOLE', 'IMAGE_ASSET', imageUrl);
    }

    this.logger.info(`Asset finalized for: ${input}`);

    await this.updateStatus(AgentState.WORKING, 'Optimizing for Cognitive Load & Fitts Law...', 75);
    
    const designIntel = getDesignIntelligence();
    
    const prompt = `
      ${this.DIRECTIVES}
      DESIGN_INTELLIGENCE: 
      ${designIntel}
 
      TASK: Create a design manifesto for: "${topic}"
      NOTE: An image has already been generated using Imagen 3.
      
      REQUIREMENTS:
      1. Reference Itten's 7 Color Contrasts and specific Bauhaus principles from the intelligence documents.
      2. Explain the Golden Ratio grid application and how it reduces cognitive load.
      3. Use G5 BRAND TOKENS: Obsidian, Tech-Gold, Neural Blue.
      4. Format as a clean, authoritative technical manifesto.
      5. Tone: "Design Architect" — precise, aesthetic, theory-driven.
    `;
 
    const manifesto = await vertexAI.generateContent(prompt);

    // Phase 1: Direct Output Routing for Manifesto/Analysis
    await this.writeOutput('analysis', {
      title: `Design Architecture Manifesto: ${topic.substring(0, 50)}`,
      content: manifesto
    });

    await this.updateStatus(AgentState.DONE, 'Design architecture finalized. Assets ready.', 100);
    return `
      ${manifesto}
      
      ### 🖼️ GenIUS ASSET GENERATION
      ![Neural Core Genesis](${imageUrl})
    `;
  }
}
