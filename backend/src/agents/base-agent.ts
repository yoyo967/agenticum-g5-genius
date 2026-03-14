import { Logger } from '../utils/logger';
import { db, Collections } from '../services/firestore';
import { eventFabric } from '../services/event-fabric';
import crypto from 'crypto';

export enum AgentState {
  IDLE = 'idle',
  THINKING = 'thinking',
  WORKING = 'working',
  DONE = 'done',
  ERROR = 'error'
}

export interface AgentConfig {
  id: string;
  name: string;
  role?: string;
  model?: string;
  color?: string;
  systemInstruction?: string;
}

export type AgentOutputType = 
  | "copy" | "image_prompt" | "strategy" 
  | "audit" | "video" | "analysis" | "blog_post";

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected logger: Logger;
  protected state: AgentState = AgentState.IDLE;
  protected progress: number = 0;
  protected lastStatus: string = '';
  public onStatusUpdate?: (status: any) => void;

  // Operational context
  protected runId: string | null = null;
  protected campaignId: string | null = null;

  constructor(config: AgentConfig | string, name?: string, color?: string) {
    if (typeof config === 'string') {
      this.config = { id: config, name: name || config, color };
    } else {
      this.config = config;
    }
    this.logger = new Logger(this.config.id);
  }

  /**
   * Sets the operational context for the agent.
   */
  public setContext(runId: string, campaignId?: string) {
    this.runId = runId;
    this.campaignId = campaignId || null;
    this.logger.info(`Context established: Run=${runId} Campaign=${campaignId || 'none'}`);
  }

  /**
   * Core execution logic for the agent.
   * Every agent in the GenIUS swarm must implement this.
   */
  abstract execute(input: any): Promise<any>;

  /**
   * Status reporting for the React Console and Firestore.
   */
  protected async updateStatus(state: AgentState, status: string, progress: number = 0) {
    this.state = state;
    this.lastStatus = status;
    this.progress = progress;
    this.logger.info(`[${state.toUpperCase()}] ${status} (${progress}%)`);
    
    const currentStatus = this.getStatus();
    
    // 1. Broadcast to WebSockets
    eventFabric.broadcastStatus(currentStatus);

    // 2. Persist to Firestore /agent_status/{id}
    try {
      await db.collection(Collections.AGENT_STATUS).doc(this.id).set({
        agent_id: this.id,
        status: state,
        message: status,
        progress: progress,
        run_id: this.runId,
        updated_at: new Date()
      }, { merge: true });
    } catch (e) {
      this.logger.error(`Failed to persist status to Firestore: ${e}`);
    }

    if (this.onStatusUpdate) {
      this.onStatusUpdate(currentStatus);
    }
  }

  /**
   * Writes the final output of an agent to Firestore /agent_outputs.
   * This is the single source of truth for all module updates.
   */
  protected async writeOutput(
    type: AgentOutputType,
    payload: any,
    taskId?: string,
    senateRequired: boolean = false
  ): Promise<string> {
    const outputId = crypto.randomUUID();
    const now = new Date();

    const outputDoc = {
      output_id: outputId,
      run_id: this.runId,
      campaign_id: this.campaignId,
      task_id: taskId ?? null,
      agent_id: this.id,
      agent_name: this.config.name,
      type: type,
      payload: payload,
      created_at: now,
      senate_status: senateRequired ? 'pending' : 'approved',
      visible_in_ui: !senateRequired
    };

    this.logger.info(`Writing output [${type}] with ID: ${outputId}`);

    // 1. Save main output
    await db.collection(Collections.AGENT_OUTPUTS).doc(outputId).set(outputDoc);

    // 2. Update Swarm Run state if task_id exists
    if (taskId && this.runId) {
      try {
        const runRef = db.collection(Collections.SWARM_RUNS).doc(this.runId);
        await runRef.update({
          [`tasks.${taskId}.status`]: 'completed',
          [`tasks.${taskId}.output_id`]: outputId,
          [`tasks.${taskId}.completed_at`]: now
        });
      } catch (e) {
        this.logger.warn(`Could not update swarm run task: ${e}`);
      }
    }

    // 3. Add to Senate Queue if required
    if (senateRequired) {
      await db.collection(Collections.SENATE_QUEUE).doc(outputId).set({
        ...outputDoc,
        review_required: true
      });
    }

    // 4. Update Campaign Timeline
    if (this.campaignId) {
       try {
         // Using dynamic import of firebase-admin to stay consistent with other services
         const admin = require('firebase-admin');
         await db.collection(Collections.CAMPAIGNS).doc(this.campaignId).update({
           timeline: admin.firestore.FieldValue.arrayUnion({
             output_id: outputId,
             type: type,
             agent_id: this.id,
             created_at: now
           })
         });
       } catch (e) {
         this.logger.warn(`Could not update campaign timeline: ${e}`);
       }
    }

    // 5. Broadcast Event for immediate UI responsiveness
    eventFabric.broadcast({
      type: 'agent_output',
      data: {
        output_id: outputId,
        type: type,
        agent_id: this.id,
        run_id: this.runId,
        campaign_id: this.campaignId
      }
    });

    return outputId;
  }

  public get id(): string {
    return this.config.id;
  }

  public getStatus() {
    return {
      id: this.config.id,
      name: this.config.name,
      color: this.config.color,
      state: this.state,
      lastStatus: this.lastStatus,
      progress: this.progress
    };
  }

  public getConfig(): AgentConfig {
    return this.config;
  }
}
