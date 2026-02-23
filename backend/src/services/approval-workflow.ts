import { db, Collections } from './firestore';
import { Logger } from '../utils/logger';
import { eventFabric } from './event-fabric';

export type ApprovalStatus = 'draft' | 'pending_audit' | 'pending_client' | 'approved' | 'rejected';

export interface ApprovalDocket {
  id: string;
  clientId: string;
  assetId: string;
  assetType: 'article' | 'campaign';
  status: ApprovalStatus;
  comments?: string;
  updatedAt: string;
}

export class ApprovalWorkflow {
  private logger = new Logger('ApprovalWorkflow');
  private static instance: ApprovalWorkflow;

  private constructor() {}

  public static getInstance(): ApprovalWorkflow {
    if (!ApprovalWorkflow.instance) {
      ApprovalWorkflow.instance = new ApprovalWorkflow();
    }
    return ApprovalWorkflow.instance;
  }

  public async createDocket(clientId: string, assetId: string, assetType: 'article' | 'campaign'): Promise<string> {
    const docket: ApprovalDocket = {
      id: `docket-${Date.now()}`,
      clientId,
      assetId,
      assetType,
      status: 'pending_audit',
      updatedAt: new Date().toISOString()
    };

    await db.collection('approval_dockets').doc(docket.id).set(docket);
    this.logger.info(`Created approval docket ${docket.id} for client ${clientId}`);
    
    eventFabric.broadcast({
      type: 'approval-requested',
      clientId,
      docketId: docket.id
    });

    return docket.id;
  }

  public async updateStatus(docketId: string, status: ApprovalStatus, comment?: string) {
    await db.collection('approval_dockets').doc(docketId).update({
      status,
      comments: comment,
      updatedAt: new Date().toISOString()
    });
    
    this.logger.info(`Docket ${docketId} updated to ${status}`);
    
    eventFabric.broadcast({
      type: 'approval-updated',
      docketId,
      status
    });
  }

  public async getClientDockets(clientId: string): Promise<ApprovalDocket[]> {
    const snapshot = await db.collection('approval_dockets')
      .where('clientId', '==', clientId)
      .orderBy('updatedAt', 'desc')
      .get();
      
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ApprovalDocket));
  }
}

export const approvalWorkflow = ApprovalWorkflow.getInstance();
