import { Router, Request, Response } from 'express';
import { clientManager } from '../services/client-manager';
import { approvalWorkflow } from '../services/approval-workflow';

const router = Router();

// Client Management
router.get('/list', async (_req: Request, res: Response) => {
  try {
    const clients = await clientManager.listClients();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const client = await clientManager.getClientProfile(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// Approval Workflows
router.get('/dockets/:clientId', async (req: Request, res: Response) => {
  try {
    const dockets = await approvalWorkflow.getClientDockets(req.params.clientId);
    res.json(dockets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch approval dockets' });
  }
});

router.post('/dockets/:id/status', async (req: Request, res: Response) => {
  try {
    const { status, comment } = req.body;
    await approvalWorkflow.updateStatus(req.params.id, status, comment);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update docket status' });
  }
});

export default router;
