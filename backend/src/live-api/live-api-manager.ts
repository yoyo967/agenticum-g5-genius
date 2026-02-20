import { WebSocket } from 'ws';
import { SN00Orchestrator } from '../agents/sn00-orchestrator';
import { Logger } from '../utils/logger';

export class LiveApiManager {
  private orchestrator: SN00Orchestrator;
  private logger: Logger;

  constructor() {
    this.orchestrator = new SN00Orchestrator();
    this.logger = new Logger('LiveApi');
  }

  public handleConnection(ws: WebSocket) {
    this.logger.info('New client connected');

    this.orchestrator.onStatusUpdate = (status) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'status', agent: status }));
      }
    };

    ws.on('message', async (data: any) => {
      try {
        const message = JSON.parse(data.toString());
        this.logger.info(`Received ${message.type} message`);

        if (message.type === 'start') {
          // Initial status update
          ws.send(JSON.stringify({ 
            type: 'status', 
            agent: this.orchestrator.getStatus() 
          }));
          
          const result = await this.orchestrator.execute(message.input || 'Initial brief');
          
          ws.send(JSON.stringify({ 
            type: 'output', 
            agentId: 'sn-00',
            data: result 
          }));

          ws.send(JSON.stringify({ 
            type: 'status', 
            agent: this.orchestrator.getStatus() 
          }));
        }
      } catch (err: any) {
        this.logger.error('Error processing message', err);
        console.error('FULL ERROR STACK:', err?.stack || err);
        ws.send(JSON.stringify({ type: 'error', message: 'Internal processing error', detail: err?.message }));
      }
    });

    ws.on('close', () => {
      this.logger.info('Client disconnected');
    });
  }
}
