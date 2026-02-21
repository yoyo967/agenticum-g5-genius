import { Storage } from '@google-cloud/storage';
import { Logger } from '../utils/logger';
import { join } from 'path';
import { writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';

export class StorageService {
  private storage?: Storage;
  private logger: Logger;
  private bucketName: string;
  private useLocalFallback: boolean = false;
  private localVaultPath: string;

  constructor() {
    this.logger = new Logger('StorageService');
    const projectId = process.env.GOOGLE_CLOUD_PROJECT || 'online-marketing-manager';
    this.bucketName = process.env.STORAGE_BUCKET || `${projectId}-agenticum-vault`;
    
    // Set up local fallback directory for reliable hackathon demos
    this.localVaultPath = join(process.cwd(), 'data', 'vault');
    if (!existsSync(this.localVaultPath)) {
      mkdirSync(this.localVaultPath, { recursive: true });
    }

    try {
      this.storage = new Storage({ projectId });
      this.logger.info(`Initialized Google Cloud Storage for bucket: ${this.bucketName}`);
    } catch (error) {
      this.logger.warn('Failed to initialize GCP Storage. Falling back to local offline vault.');
      this.useLocalFallback = true;
    }
  }

  async uploadFile(filename: string, buffer: Buffer, mimeType: string): Promise<string> {
    this.logger.info(`Starting ingestion for file: ${filename} (${mimeType})`);

    // Always save locally first for immediate preview reliability
    const localPath = join(this.localVaultPath, filename);
    writeFileSync(localPath, buffer);
    const localUrl = `http://localhost:8080/vault/${filename}`;

    if (this.useLocalFallback) {
      this.logger.info(`Saved ${filename} to local vault.`);
      return localUrl;
    }

    try {
      if (!this.storage) throw new Error('Cloud Storage not initialized.');
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(`uploads/${Date.now()}_${filename}`);
      
      await file.save(buffer, {
        contentType: mimeType,
        resumable: false
      });

      const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${file.name}`;
      this.logger.info(`Successfully uploaded ${filename} to Cloud Storage: ${publicUrl}`);
      return publicUrl;
    } catch (error) {
      this.logger.error(`GCS Upload failed for ${filename}, returning local URL fallback.`, error);
      return localUrl;
    }
  }

  async listFiles(): Promise<{ name: string; url: string; timestamp: string }[]> {
    if (!existsSync(this.localVaultPath)) return [];
    
    const files = readdirSync(this.localVaultPath);
    return files.map((filename: string) => {
      const stats = statSync(join(this.localVaultPath, filename));
      return {
        name: filename,
        url: `http://localhost:8080/vault/${filename}`,
        timestamp: stats.mtime.toLocaleTimeString()
      };
    });
  }
}

export const storageService = new StorageService();
