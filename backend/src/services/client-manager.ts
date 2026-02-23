import { db, Collections } from './firestore';
import { Logger } from '../utils/logger';

export interface ClientProfile {
  id: string;
  name: string;
  logoUrl?: string;
  primaryColor?: string;
  brandGuidelines?: string;
  brandVoice?: {
    tone: string;
    forbiddenWords: string[];
    targetAudience: string;
  };
}

export class ClientManager {
  private logger = new Logger('ClientManager');
  private static instance: ClientManager;

  private constructor() {}

  public static getInstance(): ClientManager {
    if (!ClientManager.instance) {
      ClientManager.instance = new ClientManager();
    }
    return ClientManager.instance;
  }

  public async getClientProfile(clientId: string): Promise<ClientProfile | null> {
    try {
      const doc = await db.collection('clients').doc(clientId).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() } as ClientProfile;
    } catch (error) {
      this.logger.error(`Failed to fetch client profile for ${clientId}`, error as Error);
      return null;
    }
  }

  public async listClients(): Promise<ClientProfile[]> {
    try {
      const snapshot = await db.collection('clients').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClientProfile));
    } catch (error) {
      this.logger.error('Failed to list clients', error as Error);
      return [];
    }
  }

  public async setupDefaultClient() {
    const defaultClient: ClientProfile = {
      id: 'default-client',
      name: 'Agenticum G5 Main',
      primaryColor: '#00E5FF',
      brandVoice: {
        tone: 'Professional, Technical, Visionary',
        forbiddenWords: ['cheap', 'easy', 'maybe'],
        targetAudience: 'Enterprise Marketing Executives'
      }
    };
    await db.collection('clients').doc(defaultClient.id).set(defaultClient);
    this.logger.info('Default client profile initialized.');
  }
}

export const clientManager = ClientManager.getInstance();
