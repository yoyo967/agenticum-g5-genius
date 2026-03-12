import { Router, Request, Response } from 'express';
import { SN00Orchestrator } from '../agents/sn00-orchestrator';
import { Logger } from '../utils/logger';

const router = Router();
const logger = new Logger('SwarmRoute');

/**
 * POST /api/v1/swarm/launch
 * Unified entry point for AGENTICUM G5 Swarm Orchestration.
 * Returns runId immediately; final outputs are streamed via Firestore Event Fabric.
 */
router.post('/launch', async (req: Request, res: Response) => {
  try {
    const { prompt, campaignId } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5) {
      return res.status(400).json({ error: 'Prompt must be at least 5 characters.' });
    }

    const orchestrator = new SN00Orchestrator();
    
    // Generate IDs for tracking
    const runId = `run-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const effectiveCampaignId = campaignId || `camp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    logger.info(`Launching swarm for run: ${runId} (Campaign: ${effectiveCampaignId})`);

    // Fire and forget: the orchestration happens asynchronously.
    // Progress and outputs are persisted to Firestore via BaseAgent.
    orchestrator.execute(prompt, runId, effectiveCampaignId).catch(err => {
      logger.error(`[Background] Orchestration failed for run ${runId}`, err);
    });

    return res.json({
      success: true,
      runId,
      campaignId: effectiveCampaignId,
      message: 'Swarm orchestration initialized. Follow progress via Neural Fabric.'
    });
  } catch (error) {
    logger.error('Failed to launch swarm', error as Error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/v1/swarm/pause
 */
router.post('/pause', async (req: Request, res: Response) => {
  const { runId } = req.body;
  if (!runId) return res.status(400).json({ error: 'runId is required' });

  const { ChainManager } = require('../services/chain-manager');
  ChainManager.getInstance().pauseProtocol(runId);
  
  return res.json({ success: true, message: `Swarm ${runId} paused.` });
});

/**
 * POST /api/v1/swarm/resume
 */
router.post('/resume', async (req: Request, res: Response) => {
  const { runId } = req.body;
  if (!runId) return res.status(400).json({ error: 'runId is required' });

  const { ChainManager } = require('../services/chain-manager');
  ChainManager.getInstance().resumeProtocol(runId);
  
  return res.json({ success: true, message: `Swarm ${runId} resumed.` });
});

export default router;
