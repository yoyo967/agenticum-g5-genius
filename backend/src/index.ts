import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocket, WebSocketServer } from 'ws';
import { createServer } from 'http';
import { Logger } from './utils/logger';
import { LiveApiManager } from './live-api/live-api-manager';
import blogRoutes from './routes/blog';
import vaultRoutes from './routes/vault';
import workflowRoutes from './routes/workflow';
import settingsRoutes from './routes/settings';
import pmaxRoutes from './routes/pmax';
import analyticsRoutes from './routes/analytics';
import senateRoutes from './routes/senate';
import { autopilotService } from './services/cron';
import { join } from 'path';

dotenv.config();

const app = express();
const logger = new Logger('System');
const port = process.env.PORT || 8080;
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });
const liveApi = new LiveApiManager();

// Global Exception Handling
process.on('uncaughtException', (err) => {
  logger.error('CRITICAL: Uncaught Exception', err);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('CRITICAL: Unhandled Rejection at', reason as Error);
});

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/blog', blogRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/workflow', workflowRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/pmax', pmaxRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/senate', senateRoutes);
app.use('/vault', express.static(join(process.cwd(), 'data', 'vault')));

wss.on('connection', (ws: WebSocket) => {
  liveApi.handleConnection(ws);
});

app.get('/health', (_req: express.Request, res: express.Response) => {
  res.json({ status: 'Neural Fabric Active', project: 'AGENTICUM G5 GENIUS' });
});

httpServer.listen(port, () => {
  logger.info(`AGENTICUM G5 OS [GENIUS] active on port ${port}`);
  logger.info(`Perfect Twin Archive initialized. Autopilot Jobs: ${autopilotService.getActiveTasks().length}`);
});
