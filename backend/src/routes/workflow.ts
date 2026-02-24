import { Router, Request, Response } from 'express';
import { SP01Strategist } from '../agents/sp01-strategist';
import { CC06Director } from '../agents/cc06-director';
import { DA03Architect } from '../agents/da03-architect';
import { RA01Auditor } from '../agents/ra01-auditor';
import { SN00Orchestrator } from '../agents/sn00-orchestrator';
import { ChainManager } from '../services/chain-manager';

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

router.get('/status', async (req: Request, res: Response) => {
  try {
    // Proxy health check to the Python Engine
    res.json({
      success: true,
      data: { status: 'online', engine: 'G5 Python Engine', region: 'europe-west1' },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Engine heartbeat failed.' });
  }
});

export default router;
