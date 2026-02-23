import { db } from './firestore';
import fs from 'fs';
import path from 'path';
import { Logger } from '../utils/logger';

const logger = new Logger('SettingsService');
const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json');
const CONFIG_COLLECTION = 'system_config';
const GLOBAL_DOC = 'global';

export interface SystemSettings {
  projectId: string;
  geminiKey: string;
  gcsBucket: string;
  localFallback: string;
  localOverride: boolean;
  agentModel: string;
  temperature: number;
  topK: number;
  tokenLimit: number;
  safetyThreshold: string;
  swarms: Record<string, boolean>;
}

export class SettingsService {
  private static instance: SettingsService;
  private currentSettings: Partial<SystemSettings> = {};

  private constructor() {}

  public static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  async getSettings(): Promise<Partial<SystemSettings>> {
    // 1. Try Firestore first (Production Truth)
    try {
      const doc = await db.collection(CONFIG_COLLECTION).doc(GLOBAL_DOC).get();
      if (doc.exists) {
        this.currentSettings = doc.data() as Partial<SystemSettings>;
        return this.currentSettings;
      }
    } catch (err) {
      logger.warn('Firestore settings fetch failed, falling back to local file', err as Error);
    }

    // 2. Fallback to local file (Development/Legacy)
    try {
      if (fs.existsSync(SETTINGS_FILE)) {
        const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
        this.currentSettings = JSON.parse(data);
        return this.currentSettings;
      }
    } catch (err) {
      logger.error('Failed to read local settings', err as Error);
    }

    return {};
  }

  async saveSettings(settings: Partial<SystemSettings>): Promise<void> {
    // 1. Save to Firestore (Primary)
    try {
      await db.collection(CONFIG_COLLECTION).doc(GLOBAL_DOC).set(settings, { merge: true });
      logger.info('Settings saved to Firestore');
    } catch (err) {
      logger.error('Failed to save to Firestore', err as Error);
    }

    // 2. Save to local file (Mirror/Backup)
    try {
      const dataDir = path.dirname(SETTINGS_FILE);
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      logger.info('Settings mirrored to local file');
    } catch (err) {
      logger.error('Failed to mirror settings locally', err as Error);
    }

    this.currentSettings = { ...this.currentSettings, ...settings };
  }

  getCachedSettings(): Partial<SystemSettings> {
    return this.currentSettings;
  }
}
