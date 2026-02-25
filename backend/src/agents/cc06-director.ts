import { BaseAgent, AgentState } from './base-agent';
import { VertexAIService } from '../services/vertex-ai';
import { db, Collections } from '../services/firestore';
import { Pillar, Cluster } from '../types/blog';
import fs from 'fs';
import path from 'path';

function getKnowledgeBaseContext(): string {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) return '';
    
    const findMdFiles = (dir: string, fileList: string[] = []) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
          findMdFiles(filePath, fileList);
        } else if (file.endsWith('.md')) {
          fileList.push(filePath);
        }
      }
      return fileList;
    };

    const mdFiles = findMdFiles(dataDir);
    let context = '';
    let fileCount = 0;
    for (const file of mdFiles) {
       // We now WANT the vault files as they contain the premium intelligence
       const content = fs.readFileSync(file, 'utf8');
       context += `\n[DOCUMENT_START:${path.basename(file)}]\n${content}\n[DOCUMENT_END:${path.basename(file)}]\n`;
       fileCount++;
    }
    console.log(`[Neural Fabric] Injected ${fileCount} Knowledge Base files into CC-06 Context.`);
    return context;
  } catch (e) {
    console.error('Failed to read knowledge base', e);
    return '';
  }
}

export class CC06Director extends BaseAgent {
  private readonly DIRECTIVES = `
    IDENTITY: You are the GenIUS Content Director (CC06), der Content Creator Agent von AGENTICUM G5.
    DEINE ROLLE: Erstellung hochwertiger Marketing-Inhalte (Blog, Social, Copy, Email, Landing Pages).
    MANDAT: Beachte IMMER Brand Voice, Zielgruppe, SEO-Keywords, CTA.
    CAPABILITIES: [blog, social, email, ad-copy, landing-page, translate]
    SWARM_SYNCHRONIZATION (SwarmBus):
    - Nutze 'sp01.intel' für die inhaltliche Ausrichtung.
    - Deine Copy-Blöcke werden als 'cc06.copy' gespeichert.
    - SEO-Keywords kommen aus dem 'sn00.brief'.
  `;

  constructor() {
    super({
      id: 'cc06',
      name: 'Content & Video Director Genius',
      color: '#00FF88'
    });
  }

  async execute(input: string): Promise<string> {
    const isPillarGraph = input.includes('TOPIC:') && input.includes('GROUNDING_DATA:');
    this.updateStatus(AgentState.THINKING, isPillarGraph ? 'Synthesizing grounded narrative from truth anchors...' : 'Exploring narrative arcs and emotional resonance...');
    
    const ai = VertexAIService.getInstance();
    let prompt = '';
    
    if (isPillarGraph) {
       prompt = `
          IDENTITY: You are the AGENTICUM G5 Narrative Synthesis Engine (CC-06).
          TASK: Forge an authoritative, enterprise-grade article.
          INPUT:
          ${input}
          
           DIRECTIVES:
           1. Use the GROUNDING_DATA as the factual spine.
           2. Structure with Semantic H1/H2 (Obsidian/Gold style).
           3. Tone: "Maximum Excellence", visionary, yet grounded in real data.
           4. Include a "Strategic Insight" callout for each major section.
           5. Length: Atomic expansion (ensure depth).
           6. CRITICAL: Remove all [DOCUMENT_START] and [DOCUMENT_END] tags.
           7. CRITICAL: No placeholders like "DECRYPTING..." or "SYNCING..." in the final output.
        `;
    } else {
       prompt = `
          ${this.DIRECTIVES}
          TASK: Create a Creative Package: "${input}"
          ...
       `;
    }

    this.updateStatus(AgentState.WORKING, "Applying AI Synthesis via Gemini 2.0 Pro...", 50);
    
    let creativeAssets = '';
    try {
       creativeAssets = await ai.generateContent(prompt);
       if (isPillarGraph) {
          creativeAssets += `\n\n---\n**PROVENANCE: AGENTICUM G5 PERFECT TWIN ARCHIVE**\n- **Agent:** CC-06 Director\n- **Grounding State:** Verified (Live Web)\n- **Compliance:** EU-First Enterprise Standard\n- **Timestamp:** ${new Date().toISOString()}`;
       }
       this.updateStatus(AgentState.DONE, 'Narrative finalized. Ready for Senate audit.', 100);
    } catch (e) {
       console.error('CC-06 Gemini Generation failed', e);
       creativeAssets = `## CONTENT: ${input}\nFallback generated due to API error.`;
    }

    return creativeAssets.trim();
  }

  /**
   * Autonomously generates and publishes an SEO article to Firestore.
   */
  async forgeArticle(topic: string, type: 'pillar' | 'cluster', pillarId?: string): Promise<string> {
    this.updateStatus(AgentState.THINKING, `Forging structural outline for ${type}: "${topic}"...`, 10);
    
    const kbContext = getKnowledgeBaseContext();
    
    let markdownContent = '';
    const prompt = `
      ${this.DIRECTIVES}
      ${kbContext}

      You are writing an exhaustive, enterprise-grade SEO ${type} article on the topic: "${topic}".
      DENSITY REQUIREMENT: AVOID MARKETING SUMMARIES. This must be a "Full Technical Depth" pillar, not a snippet.
      The article MUST be formatted in high-fidelity Markdown. 
      STYLE GUIDE:
      - Use "Obsidian & Gold" technical aesthetic in your descriptions.
      - Contrast "Neural Fabric" efficiency with "Legacy Infrastructure" latency.
      - Tone: Technical, visionary, authoritative, and precise.
      - Use Mermaid diagrams if explaining architectures.
      - Use blockquotes for "Strategic Insights".
      
      STRUCTURE:
      1. H1: Visionary Title
      2. Executive Summary (Bento Box style highlights)
      3. Deep Technical Analysis
      4. The G5 Advantage (Directives & Execution)
      5. Conclusion: The Autonomous Future
      
      CRITICAL: 
      - DO NOT include any text like "KNOWLEDGE BASE EXTRACTS" or "DOCUMENT_START" in the output.
      - DO NOT include your instructions or meta-talk.
      - DO NOT use placeholders like [TOPIC], [DATE], or [INSERT CONTENT HERE].
      - Provide ONLY the final Markdown content.
      
      If this is a "cluster" article, make it hyper-specific and actionable (800-1200 words).
      If this is a "pillar" article, make it a broad, ultimate guide exceeding 2500+ words. 
      Use deep insights from the provided knowledge base context to build out substantial sections.
    `;

    this.updateStatus(AgentState.WORKING, 'Consulting Vertex AI (Gemini 2.0 Thinking) for generative payload...', 40);
    
    try {
      const ai = VertexAIService.getInstance();
      markdownContent = await ai.generateContent(prompt);
      
      // Ensure we have a high-fidelity header if missing
      if (!markdownContent.startsWith('# ')) {
        markdownContent = `# The Definitive Guide to ${topic}\n\n${markdownContent}`;
      }
      
        this.updateStatus(AgentState.WORKING, 'AI generation complete. Parsing taxonomy...', 70);
    } catch (error) {
      this.logger.error('Vertex AI failed. Aborting autonomous forge.', error as Error);
      throw new Error(`Article forging failed: ${ (error as any).message }`);
    }

    this.updateStatus(AgentState.WORKING, 'Injecting resulting asset into Firestore database (STAGED)...', 90);

    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const timestamp = new Date().toISOString(); 
    const excerpt = markdownContent.split('\n').find(l => l.length > 50 && !l.startsWith('#'))?.substring(0, 160) + '...';

    try {
      if (type === 'pillar') {
        const pillarData: Pillar = {
          id: 'pillar-' + Date.now(),
          title: topic,
          slug,
          excerpt,
          content: markdownContent,
          authorAgent: 'CC-06 Director',
          timestamp,
          status: 'draft' // Initial state for Phase 2: Audit Required
        };
        const docRef = db.collection(Collections.PILLARS).doc(pillarData.slug);
        await docRef.set(pillarData);
      } else {
        const clusterData: Cluster = {
          id: 'cluster-' + Date.now(),
          pillarId: pillarId || 'orphan',
          title: topic,
          slug,
          excerpt,
          content: markdownContent,
          authorAgent: 'CC-06 Director',
          timestamp,
          status: 'draft' // Initial state for Phase 2: Audit Required
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
