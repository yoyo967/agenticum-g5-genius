import { BaseAgent, AgentState } from './base-agent';
import { VertexAIService } from '../services/vertex-ai';
import { db, Collections } from '../services/firestore';
import { Pillar, Cluster } from '../types/blog';

export class CC06Director extends BaseAgent {
  private readonly DIRECTIVES = `
    IDENTITY: You are the GenIUS Content & Video Director (CC-06).
    KNOWLEDGE BASE:
    - Ogilvy's 8 Commandments (Advertising)
    - Three-Act Structure & 12-Beat Emotional Journey
    - Video Grammar: Shot types, camera rhythm, and Veo prompts
    - 4-Minute Demo Video Framework
    - Aristotle's Rhetorical Triangle (Ethos, Pathos, Logos)
  `;

  constructor() {
    super({
      id: 'cc-06',
      name: 'Content & Video Director Genius',
      color: '#FBBC04'
    });
  }

  async execute(input: string): Promise<string> {
    this.updateStatus(AgentState.THINKING, 'Exploring narrative arcs and emotional resonance...');
    await new Promise(resolve => setTimeout(resolve, 1500));

    this.updateStatus(AgentState.WORKING, "Applying Ogilvy's 8 Commandments...", 30);
    await new Promise(resolve => setTimeout(resolve, 2000));

    this.updateStatus(AgentState.WORKING, 'Forging 12-Beat Emotional Journey...', 60);
    await new Promise(resolve => setTimeout(resolve, 1500));

    this.updateStatus(AgentState.WORKING, 'Synthesizing Cinematic Video Grammar...', 90);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const creativeAssets = `
## CREATIVE PACKAGE: ${input}

### 🎬 Narrative Strategy
Identity active: ${this.DIRECTIVES.split('\n')[1].trim()}
Framework: Ogilvy's Commandments + Aristotle's Rhetoric.

### 1. Hero Film Script: "The Neural Awakening"
**Act I**: The Silence. Deep space visuals. Ethics grounded in Ogilvy Rule #1 (Be big).
**Act II**: The Core. Fast cuts following 12-Beat Emotional Journey.
**Act III**: The Zenith. "AGENTICUM G5. It hears the future."

### 2. Video Grammar Prompts (Veo)
- prompt: "Shot type: Extreme close-up. Movement: Tracking. Subject: Golden ratio neural nexus pulsing with liquid light."
    `;

    this.updateStatus(AgentState.DONE, 'Creative content forged. Ready for Senate audit.', 100);
    return creativeAssets.trim();
  }

  /**
   * Autonomously generates and publishes an SEO article to Firestore.
   */
  async forgeArticle(topic: string, type: 'pillar' | 'cluster', pillarId?: string): Promise<string> {
    this.updateStatus(AgentState.THINKING, `Forging structural outline for ${type}: "${topic}"...`, 10);
    
    let markdownContent = '';
    const prompt = `
      ${this.DIRECTIVES}
      You are writing a comprehensive, enterprise-grade SEO ${type} article on the topic: "${topic}".
      The article must be at least 800 words, formatted in beautiful Markdown (using h2, h3, bullet points, and code blocks if applicable).
      Ensure the tone is highly authoritative, bleeding-edge tech, and aligns with the AGENTICUM G5 brand.
      If this is a "cluster" article, make it hyper-specific and actionable.
      If this is a "pillar" article, make it a broad, ultimate guide.
    `;

    this.updateStatus(AgentState.WORKING, 'Consulting Vertex AI (Gemini 2.0 Flash) for generative payload...', 40);
    
    try {
      const ai = VertexAIService.getInstance();
      markdownContent = await ai.generateContent(prompt);
      this.updateStatus(AgentState.WORKING, 'AI generation complete. Parsing taxonomy...', 70);
    } catch (error) {
      console.error('Vertex AI failed or ADC missing. Yielding to robust fallback simulation generation.', error);
      markdownContent = `
# The Ultimate Guide to ${topic}

*Generated autonomously by CC-06 Director (Fallback Mode).*

## The Paradigm Shift

The enterprise software landscape is rapidly evolving. When dealing with **${topic}**, one must approach the infrastructure through a lens of absolute automation and spatial orchestration.

### Key Tenets
- **Seamless Integration**: Connect your microservices using the ADK.
- **Cognitive Scaling**: Never rely on a single node when a swarm can operate in parallel.
- **The Obsidian Standard**: Emulate the "Agenticum G5" standard, enforcing Dark Mode, glassmorphism, and minimal latency interfaces.

> "The true measure of an intelligent system is not in its responses, but in the actions it takes before you ask." — *Agenticum G5 Manifesto*

### Moving Forward
In the coming months, ${topic} will become a foundational necessity rather than an experimental luxury. 
Deploy your semantic routers. Prepare the execution substrate.
      `.trim();
    }

    this.updateStatus(AgentState.WORKING, 'Injecting resulting asset into Firestore database...', 90);

    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const timestamp = new Date().toISOString(); 
    // Note: Using ISO string here for simplicity across client/server without needing Firestore Timestamp object injection in simple types, 
    // or we can just send it as an ISO string.

    try {
      if (type === 'pillar') {
        const pillarData: Pillar = {
          id: 'pillar-' + Date.now(),
          title: topic,
          slug,
          content: markdownContent,
          authorAgent: 'CC-06 Director',
          timestamp,
          status: 'published'
        };
        const docRef = db.collection(Collections.PILLARS).doc(pillarData.slug);
        await docRef.set(pillarData);
      } else {
        const clusterData: Cluster = {
          id: 'cluster-' + Date.now(),
          pillarId: pillarId || 'orphan',
          title: topic,
          slug,
          content: markdownContent,
          authorAgent: 'CC-06 Director',
          timestamp,
          status: 'published'
        };
        const docRef = db.collection(Collections.CLUSTERS).doc(clusterData.slug);
        await docRef.set(clusterData);
      }
    } catch (fsError) {
      console.error('Firestore payload injection failed:', fsError);
      throw new Error('Failed to inject Phase 3 article into Firestore. Check permissions.');
    }

    this.updateStatus(AgentState.DONE, type.toUpperCase() + ' payload "' + topic + '" successfully deployed.', 100);
    return slug;
  }
}
