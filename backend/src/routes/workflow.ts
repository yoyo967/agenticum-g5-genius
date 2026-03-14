import { Router, Request, Response } from 'express';
import axios from 'axios';
import { ChainManager } from '../services/chain-manager';

const ENGINE_URL = process.env.ENGINE_URL || 'https://genius-backend-697051612685.europe-west1.run.app';

const router = Router();

router.post('/deploy', async (req: Request, res: Response) => {
  try {
    const { nodes, edges, workflowId, name } = req.body;

    if (!nodes || !edges) {
      return res.status(400).json({ error: 'Missing nodes or edges payload.' });
    }

    // Acknowledge deployment
    res.json({ status: 'success', message: 'Workflow graph compiled and dispatched to Swarm Cluster.' });

    // Transition to official ChainManager for orchestrated execution
    const chainManager = ChainManager.getInstance();
    const tasks = nodes
      .filter((n: any) => n.type === 'agentNode')
      .map((n: any) => ({
        id: n.id,
        agentId: n.data.agentId,
        description: n.data.config,
        state: 'pending',
        dependencies: edges.filter((e: any) => e.target === n.id).map((e: any) => e.source)
          .filter((id: string) => nodes.find((node: any) => node.id === id)?.type === 'agentNode')
      }));

    const protocol = {
      id: workflowId || `protocol-${Date.now()}`,
      goal: name || 'Ad-hoc swarm execution',
      tasks,
      status: 'active' as any,
      timestamp: new Date().toISOString()
    };

    // Execute in background
    chainManager.executeProtocol(protocol as any);

  } catch (err) {
    console.error('Workflow Deployment Error:', err);
  }
});

router.get('/status', async (_req: Request, res: Response) => {
  try {
    const engineRes = await axios.get(`${ENGINE_URL}/health`, { timeout: 5000 });
    res.json({
      success: true,
      data: {
        status: 'online',
        engine: engineRes.data?.name ?? 'G5 Python Engine',
        version: engineRes.data?.version ?? 'unknown',
        region: process.env.GOOGLE_CLOUD_REGION ?? 'europe-west1',
        engineStatus: engineRes.data?.status ?? 'ok',
      },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (err: any) {
    // Engine unreachable — return degraded status rather than 500
    res.json({
      success: false,
      data: {
        status: 'degraded',
        engine: 'G5 Python Engine',
        region: process.env.GOOGLE_CLOUD_REGION ?? 'europe-west1',
        error: err.code ?? 'ENGINE_UNREACHABLE',
      },
      meta: { timestamp: new Date().toISOString() }
    });
  }
});

export default router;
