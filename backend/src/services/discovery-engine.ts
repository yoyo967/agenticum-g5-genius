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
    const vaultDir = join(process.cwd(), 'data', 'vault');
    if (!existsSync(vaultDir)) {
      mkdirSync(vaultDir, { recursive: true });
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
      let matches: string[] = [];

      for (const file of files) {
        const fullPath = join(vaultDir, file);
        if (lstatSync(fullPath).isDirectory()) continue;

        const content = readFileSync(fullPath, 'utf8');
        const contentLower = content.toLowerCase();
        
        if (keywords.some(k => contentLower.includes(k))) {
          // Extract a meaningful snippet around the first keyword match
          const firstKeyword = keywords.find(k => contentLower.includes(k))!;
          const index = contentLower.indexOf(firstKeyword);
          const start = Math.max(0, index - 300);
          const end = Math.min(content.length, index + 700);
          
          matches.push(`[SOURCE: ${file}]: ...${content.substring(start, end).trim()}...`);
        }
      }

      if (matches.length > 0) {
        this.logger.info(`RAG: Found ${matches.length} relevant fragments in Vault.`);
        return `Retrieved ${matches.length} matching fragments from The Vault Intelligence Hub:\n\n${matches.join('\n\n')}`;
      }

      return `Grounding data for "${query}" searched in ${files.length} vault files, but no direct keyword matches found. Falling back to core intelligence.`;
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
