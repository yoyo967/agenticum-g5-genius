import { WebSocket } from 'ws';
import { SN00Orchestrator } from '../agents/sn00-orchestrator';

export class LiveApiManager {
  private orchestrator: SN00Orchestrator;

  constructor() {
    this.orchestrator = new SN00Orchestrator();
  }

  public handleConnection(ws: WebSocket) {
    console.log('[LiveApi] New client connected');

    ws.on('message', async (data: Buffer | string) => {
      try {
        const message = JSON.parse(data.toString());
        console.log('[LiveApi] Received:', message);

        if (message.type === 'start') {
          ws.send(JSON.stringify({ type: 'status', data: this.orchestrator.getStatus() }));
          
          const result = await this.orchestrator.execute(message.input || 'Initial brief');
          
          ws.send(JSON.stringify({ type: 'output', data: result }));
          ws.send(JSON.stringify({ type: 'status', data: this.orchestrator.getStatus() }));
        }
      } catch (err) {
        console.error('[LiveApi] Error processing message:', err);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      console.log('[LiveApi] Client disconnected');
    });
  }
}
