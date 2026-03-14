import { Router, Request, Response } from 'express';
import axios from 'axios';
import { Logger } from '../utils/logger';

const router = Router();
const logger = new Logger('ColumnaBridge');

const ENGINE_URL = process.env.ENGINE_URL || 'https://genius-backend-697051612685.europe-west1.run.app';

/**
 * POST /api/v1/columna/track
 * Pushes a target URL to the Python Columna Decompiler engine.
 */
router.post('/track', async (req: Request, res: Response) => {
  const { url, competitor_name, session_id } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid target URL' });
  }

  // Safe hostname extraction — rejects malformed URLs
  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return res.status(400).json({ error: 'Malformed target URL' });
  }

  logger.info(`Relaying decompile request for ${hostname} to Python Engine`);

  try {
    const response = await axios.post(
      `${ENGINE_URL}/columna/decompile`,
      { url, competitor_name: competitor_name || hostname, session_id },
      { timeout: 15000 }
    );

    res.json(response.data);
  } catch (error: any) {
    logger.error('Failed to relay to Columna Engine', error);
    // Do not expose internal network details
    res.status(502).json({ error: 'Columna Engine unreachable. Please try again later.' });
  }
});

export default router;
