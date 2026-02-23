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

logger.info('API Routes Registered: /api/blog, /api/vault, /api/workflow, /api/settings, /api/pmax, /api/analytics, /api/senate, /api/deploy, /api/clients, /api/sovereign');
app.use('/vault', express.static(join(process.cwd(), 'data', 'vault')));

wss.on('connection', (ws: WebSocket) => {
  liveApi.handleConnection(ws);
});

app.get('/health', (_req: express.Request, res: express.Response) => {
  res.json({ status: 'Neural Fabric Active', project: 'AGENTICUM G5 GENIUS' });
});

httpServer.listen(port, () => {
  logger.info(`AGENTICUM G5 OS [GENIUS] active on port ${port}`);
  
  // Initialize Global Settings
  SettingsService.getInstance().getSettings().then(() => {
    logger.info('Global Configuration synchronzed.');
  });

  logger.info(`Perfect Twin Archive initialized. Autopilot Jobs: ${autopilotService.getActiveTasks().length}`);
  
  // Initialize Vault Grounding
  const vaultManager = VaultManager.getInstance();
  vaultManager.scanAndIngest().then(() => vaultManager.watchVault());

  // Set up default client for Phase 7
  clientManager.setupDefaultClient();
});
