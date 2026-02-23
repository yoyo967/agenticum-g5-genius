import { WebSocket, WebSocketServer } from 'ws';
import { Logger } from '../utils/logger';

export class EventFabric {
  private static instance: EventFabric;
  private wss: WebSocketServer | null = null;
  private logger: Logger;

  private constructor() {
    this.logger = new Logger('EventFabric');
  }

  public static getInstance(): EventFabric {
    if (!EventFabric.instance) {
      EventFabric.instance = new EventFabric();
    }
    return EventFabric.instance;
  }

  public initialize(wss: WebSocketServer) {
    this.wss = wss;
    this.logger.info('Neural Event Fabric initialized.');
  }

  public broadcast(message: any) {
    if (!this.wss) {
      this.logger.warn('Broadcast attempted before initialization');
      return;
    }
    
    const data = JSON.stringify(message);
    let count = 0;
    
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
        count++;
      }
    });
    
    if (count > 0) {
      this.logger.info(`Broadcasted ${message.type} to ${count} clients`);
    }
  }

  public broadcastStatus(agentStatus: any) {
    this.broadcast({ type: 'status', agent: agentStatus });
  }

  public broadcastPayload(from: string, to: string, payloadType: string, payload: any) {
    this.broadcast({ 
      type: 'swarm-payload', 
      from: from.toUpperCase(), 
      to: to.toUpperCase(), 
      payloadType, 
      payload 
    });
  }

  public broadcastSenate(verdict: string, agent: string, payload: any) {
    this.broadcast({
      type: 'senate',
      verdict,
      agent,
      payload
    });
  }

  public broadcastMetric(metric: string, value: any) {
    this.broadcast({
      type: 'metric',
      metric,
      value,
      timestamp: new Date().toISOString()
    });
  }

  public broadcastTelemetry(stats: any) {
    this.broadcast({
      type: 'telemetry',
      stats,
      timestamp: new Date().toISOString()
    });
  }
}

export const eventFabric = EventFabric.getInstance();
