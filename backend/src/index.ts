import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocket, WebSocketServer } from 'ws';
import { createServer } from 'http';
import { LiveApiManager } from './live-api/live-api-manager';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });
const liveApi = new LiveApiManager();

app.use(cors());
app.use(express.json());

wss.on('connection', (ws: WebSocket) => {
  liveApi.handleConnection(ws);
});

app.get('/health', (_req: express.Request, res: express.Response) => {
  res.json({ status: 'Neural Fabric Active', project: 'AGENTICUM G5 GENIUS' });
});

httpServer.listen(port, () => {
  console.log(`GenIUS Backend listening at http://localhost:${port}`);
});
