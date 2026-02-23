import fs from 'fs';
import path from 'path';
const pdf = require('pdf-parse');
import { Logger } from '../utils/logger';
import { DiscoveryEngineService } from './discovery-engine';

export class VaultManager {
  private vaultPath: string;
  private logger: Logger;
  private discoveryEngine: DiscoveryEngineService;
  private static instance: VaultManager;

  private constructor() {
    this.logger = new Logger('VaultManager');
    this.vaultPath = path.join(process.cwd(), 'data', 'vault');
    this.discoveryEngine = DiscoveryEngineService.getInstance();

    if (!fs.existsSync(this.vaultPath)) {
      fs.mkdirSync(this.vaultPath, { recursive: true });
    }
  }

  public static getInstance(): VaultManager {
    if (!VaultManager.instance) {
      VaultManager.instance = new VaultManager();
    }
    return VaultManager.instance;
  }

  /**
   * Scans the vault directory for new files and ingests them.
   */
  public async scanAndIngest() {
    this.logger.info(`Scanning vault at: ${this.vaultPath}`);
    const files = fs.readdirSync(this.vaultPath);

    for (const file of files) {
      if (file === 'knowledge.txt') continue; // Skip the index itself

      const filePath = path.join(this.vaultPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        await this.processFile(file, filePath);
      }
    }
  }

  private async processFile(filename: string, filePath: string) {
    try {
      this.logger.info(`Processing vault file: ${filename}`);
      const ext = path.extname(filename).toLowerCase();
      let text = '';

      if (ext === '.pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        text = data.text;
      } else if (ext === '.txt' || ext === '.md') {
        text = fs.readFileSync(filePath, 'utf8');
      } else {
        this.logger.warn(`Unsupported file type in vault: ${filename}`);
        return;
      }

      if (text.trim().length > 0) {
        await this.discoveryEngine.ingestDocument(filename, text);
      }
    } catch (err: any) {
      this.logger.error(`Failed to process vault file ${filename}: ${err.message}`);
    }
  }

  /**
   * Initializes a directory watcher for real-time ingestion.
   */
  public watchVault() {
    this.logger.info('Starting Vault Watcher...');
    fs.watch(this.vaultPath, (eventType, filename) => {
      if (eventType === 'rename' && filename && filename !== 'knowledge.txt') {
        const filePath = path.join(this.vaultPath, filename);
        if (fs.existsSync(filePath)) {
          this.logger.info(`New file detected in vault: ${filename}. Ingesting...`);
          this.processFile(filename, filePath);
        }
      }
    });
  }
}
