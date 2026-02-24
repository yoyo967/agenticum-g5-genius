import { Firestore } from '@google-cloud/firestore';
import path from 'path';
import fs from 'fs';

class FirestoreManager {
  private static instance: FirestoreManager;
  private _db: Firestore | null = null;
  private _projectId: string = '';

  private constructor() {
    this._projectId = this.resolveProjectId();
  }

  public static getInstance(): FirestoreManager {
    if (!FirestoreManager.instance) {
      FirestoreManager.instance = new FirestoreManager();
    }
    return FirestoreManager.instance;
  }

  private resolveProjectId(): string {
    let id = process.env.GOOGLE_CLOUD_PROJECT || 'online-marketing-manager';
    try {
      const settingsPath = path.join(process.cwd(), 'data', 'settings.json');
      if (fs.existsSync(settingsPath)) {
        const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        if (settings.projectId) id = settings.projectId;
      }
    } catch (e) {
      // Don't log to console during resolution to avoid clutter
    }
    return id;
  }

  public get db(): Firestore {
    if (!this._db) {
      const config: any = { projectId: this._projectId };
      
      // Only set keyFilename if the environment variable actually points to an existing file
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
        config.keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      }
      
      this._db = new Firestore(config);
    }
    return this._db;
  }

  public reinitialize(newProjectId?: string) {
    const targetId = newProjectId || this.resolveProjectId();
    this._projectId = targetId;
    
    const config: any = { projectId: this._projectId };
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
      config.keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    }
    
    this._db = new Firestore(config);
  }
}

const manager = FirestoreManager.getInstance();

// Export a Proxy to allow dynamic swapping of the underlying Firestore instance
// without breaking existing imports like "import { db } from './firestore'"
export const db = new Proxy({} as Firestore, {
  get(_, prop) {
    const target = manager.db as any;
    const value = target[prop];
    if (typeof value === 'function') {
      return value.bind(target);
    }
    return value;
  }
});

export const reinitializeFirestore = (projectId?: string) => manager.reinitialize(projectId);

export const Collections = {
  PILLARS: 'pillars',
  CLUSTERS: 'clusters',
  CAMPAIGNS: 'pmax_campaigns',
  SENATE_DOCKET: 'senate_docket',
  KPI_METRICS: 'kpi_metrics',
  AB_TESTS: 'ab_tests',
  SYSTEM_CONFIG: 'system_config',
  USERS: 'users',
  CURRICULUM: 'curriculum',
  TOOLS: 'tools',
  TALENT_GRAPH: 'talent_graph'
};
