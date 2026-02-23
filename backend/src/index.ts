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

// API Routes
app.use('/api/blog', blogRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/workflow', workflowRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/pmax', pmaxRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/senate', senateRoutes);
app.use('/api/deploy', deploymentRoutes);
app.use('/api/clients', clientsRouter);
app.use('/api/bridge', bridgeRoutes);

// --- SOVEREIGN AI / GEOPOLITICS ROUTES ---

app.get('/api/sovereign/nodes', async (req, res) => {
  try {
    const nodes = await sovereignService.getGlobalNodes();
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch global nodes.' });
  }
});

app.post('/api/sovereign/sync', async (req, res) => {
  try {
    const result = await sovereignService.initiateFederatedSync();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Federated sync failed.' });
  }
});

app.post('/api/sovereign/audit', async (req, res) => {
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

wss.on('connection', (ws: WebSocket) => {
  liveApi.handleConnection(ws);
});

app.get('/health', (_req: express.Request, res: express.Response) => {
  res.json({ status: 'Neural Fabric Active', project: 'AGENTICUM G5 GENIUS' });
});

httpServer.listen(port, async () => {
  logger.info(`AGENTICUM G5 OS [GENIUS] active on port ${port}`);
  
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
