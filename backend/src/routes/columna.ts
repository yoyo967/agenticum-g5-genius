import { Router, Request, Response } from 'express';
import axios from 'axios';
import { Logger } from '../utils/logger';

const router = Router();
const logger = new Logger('ColumnaBridge');

const ENGINE_URL = process.env.ENGINE_URL || 'https://agenticum-g5-backend-697051612685.europe-west1.run.app';

/**
 * POST /api/v1/columna/track
 * Pushes a target URL to the Python Columna Decompiler engine.
 */
router.post('/track', async (req: Request, res: Response) => {
  const { url, competitor_name, session_id } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Missing target URL' });
  }

  logger.info(`Relaying decompile request for ${url} to Python Engine`);

  try {
    const response = await axios.post(`${ENGINE_URL}/columna/decompile`, {
      url,
      competitor_name: competitor_name || url.split('/')[2],
      session_id
    });

    res.json(response.data);
  } catch (error: any) {
    logger.error('Failed to relay to Columna Engine', error);
    res.status(502).json({ 
      error: 'Columna Engine Unreachable',
      details: error.message 
    });
  }
});

export default router;
