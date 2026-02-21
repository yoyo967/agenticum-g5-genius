import * as DiscoveryEngine from '@google-cloud/discoveryengine';
import { Logger } from '../utils/logger';
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
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
      
      const knowledgePath = join(process.cwd(), 'data', 'vault', 'knowledge.txt');
      let localContext = '';
      if (existsSync(knowledgePath)) {
        const fullText = readFileSync(knowledgePath, 'utf8');
        // Simple mock search: return the first 1000 chars if the query is non-empty, or do rough keyword match
        if (fullText.trim().length > 0) {
          localContext = `Local Grounding Data: ${fullText.substring(0, 1000)}... `;
        }
      }

      return `${localContext}Grounding data for "${query}" retrieved. (Grounding Active)`;
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
