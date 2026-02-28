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
import deploymentRoutes from './routes/deployment';
import clientsRouter from './routes/clients';
import bridgeRoutes from './routes/bridge';
import columnaRoutes from './routes/columna';
import { sovereignService } from './services/sovereign-service';
import { autopilotService } from './services/cron';
import { clientManager } from './services/client-manager';
import { SettingsService } from './services/settings-service';
import { join } from 'path';
import { VaultManager } from './services/vault-manager';

dotenv.config();

const app = express();
const logger = new Logger('System');
const port = process.env.PORT || 8080;
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });
const liveApi = new LiveApiManager();

// Initialize the Real-time Event Fabric
import { eventFabric } from './services/event-fabric';
eventFabric.initialize(wss);

// Global Exception Handling
process.on('uncaughtException', (err) => {
  logger.error('CRITICAL: Uncaught Exception', err);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('CRITICAL: Unhandled Rejection at', reason as Error);
});

app.use(cors());
app.use(express.json());

// API v1 Routes
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/vault', vaultRoutes);
app.use('/api/v1/workflow', workflowRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/pmax', pmaxRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/senate', senateRoutes);
app.use('/api/v1/deploy', deploymentRoutes);
app.use('/api/v1/clients', clientsRouter);
app.use('/api/v1/bridge', bridgeRoutes);
app.use('/api/v1/columna', columnaRoutes);

// --- SOVEREIGN AI / GEOPOLITICS ROUTES ---

app.get('/api/v1/sovereign/nodes', async (req, res) => {
  try {
    const nodes = await sovereignService.getGlobalNodes();
    res.json({
      success: true,
      data: nodes,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch global nodes.' }
    });
  }
});

app.post('/api/v1/sovereign/sync', async (req, res) => {
  try {
    const result = await sovereignService.initiateFederatedSync();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Federated sync failed.' });
  }
});

app.post('/api/v1/sovereign/audit', async (req, res) => {
  try {
    const { content, zone } = req.body;
    const audit = await sovereignService.auditCompliance(content, zone);
    res.json(audit);
  } catch (error) {
    res.status(500).json({ error: 'Compliance audit failed.' });
  }
});

logger.info('API Routes Registered: /api/blog, /api/vault, /api/workflow, /api/settings, /api/pmax, /api/analytics, /api/senate, /api/deploy, /api/clients, /api/sovereign, /api/bridge');
app.use('/vault', express.static(join(process.cwd(), 'data', 'vault')));

app.get('/api/v1/health', (_req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    data: { status: 'healthy', project: 'AGENTICUM G5 GenIUS' },
    meta: { timestamp: new Date().toISOString() }
  });
});

app.get('/', (_req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    message: 'AGENTICUM G5 Core API Online',
    service: 'agenticum-backend'
  });
});

app.get('/robots.txt', (_req: express.Request, res: express.Response) => {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /');
});

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (data: string) => {
    try {
      const message = JSON.parse(data);
      if (message.type === 'executive-intervention') {
        const { InterventionManager } = require('./services/intervention-manager');
        InterventionManager.getInstance().handleIntervention(message.data);
      }
    } catch (e) {
      // Ignore malformed messages
    }
  });
  liveApi.handleConnection(ws);
});

httpServer.listen(port, async () => {
  logger.info(`AGENTICUM G5 OS [GenIUS] active on port ${port}`);
  
  try {
    // 1. Initialize Global Settings FIRST
    await SettingsService.getInstance().getSettings();
    logger.info('Global Configuration synchronized.');

    // 2. Initialize Vault Grounding
    const vaultManager = VaultManager.getInstance();
    await vaultManager.scanAndIngest();
    vaultManager.watchVault();

    // 3. Set up default client
    clientManager.setupDefaultClient();

    logger.info(`Perfect Twin Archive initialized. Autopilot Jobs: ${autopilotService.getActiveTasks().length}`);
    logger.info('Neural Fabric fully operational.');
  } catch (err) {
    logger.error('Failed to initialize system services', err as Error);
  }
});
