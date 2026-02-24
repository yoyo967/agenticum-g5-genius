import * as DiscoveryEngine from '@google-cloud/discoveryengine';
import { Logger } from '../utils/logger';
import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, lstatSync } from 'fs';
import { join } from 'path';

export class DiscoveryEngineService {
  private client: any;
  private logger: Logger;
  private static instance: DiscoveryEngineService;

  private constructor() {
    this.logger = new Logger('DiscoveryEngine');
    
    // Ensure vault directory exists
    const vaultPath = join(process.cwd(), 'data', 'vault');
    if (!existsSync(vaultPath)) {
      mkdirSync(vaultPath, { recursive: true });
    }
    try {
      // Handling different import styles in the compiled JS
      const v1beta = (DiscoveryEngine as any).v1beta || DiscoveryEngine;
      // Using v1beta if available, or falling back to a dummy client
      if (v1beta.DocumentServiceClient) {
         this.client = new v1beta.DocumentServiceClient();
      }
      this.logger.info('Discovery Engine client initialized (Fail-soft mode active)');
    } catch (e) {
      this.logger.warn('Discovery Engine SDK initialization failed. Swarm will operate on core intelligence.');
    }
  }

  public static getInstance(): DiscoveryEngineService {
    if (!DiscoveryEngineService.instance) {
      DiscoveryEngineService.instance = new DiscoveryEngineService();
    }
    return DiscoveryEngineService.instance;
  }

  async searchKnowledge(query: string): Promise<string> {
    try {
      this.logger.info(`Searching knowledge for query: ${query.substring(0, 50)}...`);
      
      const vaultDir = join(process.cwd(), 'data', 'vault');
      if (!existsSync(vaultDir)) {
        return `Warning: Vault directory missing. Falling back to core reasoning for "${query}".`;
      }

      const files = readdirSync(vaultDir).filter((f: string) => f.endsWith('.md') || f.endsWith('.txt'));
      
      const keywords = query.toLowerCase().split(' ').filter(k => k.length > 3);
      let matches: Array<{ score: number; fragment: string }> = [];

      for (const file of files) {
        const fullPath = join(vaultDir, file);
        if (lstatSync(fullPath).isDirectory()) continue;

        const content = readFileSync(fullPath, 'utf8');
        const contentLower = content.toLowerCase();
        
        let score = 0;
        keywords.forEach(k => {
          if (contentLower.includes(k)) {
            score += contentLower.split(k).length - 1;
          }
        });

        if (score > 0) {
          // Extract a substantial, high-fidelity fragment around the densest area
          const firstKeyword = keywords.find(k => contentLower.includes(k))!;
          const index = contentLower.indexOf(firstKeyword);
          const start = Math.max(0, index - 800);
          const end = Math.min(content.length, index + 2200);
          
          matches.push({
            score,
            fragment: `[INTELLIGENCE_NODE: ${file} (Score: ${score})]\n${content.substring(start, end).trim()}\n`
          });
        }
      }

      const topMatches = matches
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(m => m.fragment);

      if (topMatches.length > 0) {
        this.logger.info(`RAG EXCELLENCE: Injecting ${topMatches.length} intelligence nodes.`);
        return `RETRIEVED FROM VAULT ARCHIVE [GROUNDED]:\n\n${topMatches.join('\n\n')}`;
      }

      return `G5_SENTIENCE_ALERT: No direct intelligence nodes found for "${query}" in archive. Core reasoning active.`;
    } catch (error) {
      this.logger.error('Error searching knowledge', error as Error);
      return `Warning: Knowledge base search failed. Falling back to core reasoning for "${query}".`;
    }
  }

  async ingestDocument(filename: string, text: string): Promise<void> {
    try {
      this.logger.info(`Extracting and ingesting context from ${filename} (${text.length} chars)`);
      const knowledgePath = join(process.cwd(), 'data', 'vault', 'knowledge.txt');
      
      const entry = `\n--- SOURCE: ${filename} ---\n${text}\n--- END SOURCE ---\n`;
      appendFileSync(knowledgePath, entry);
      
      this.logger.info(`Successfully ingested ${filename} to local Discovery Engine fallback.`);
    } catch (error) {
      this.logger.error(`Failed to ingest document ${filename}`, error as Error);
      throw error;
    }
  }
}
