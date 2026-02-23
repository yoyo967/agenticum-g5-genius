import { Router, Request, Response } from 'express';
import { analyticsService } from '../services/analytics';
import { roiEngine } from '../services/roi-engine';
import { abTestingService } from '../services/ab-testing';

const router = Router();

router.get('/throughput', async (req: Request, res: Response) => {
  try {
    const data = await analyticsService.getThroughputData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch throughput data' });
  }
});

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await analyticsService.getSwarmStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch swarm stats' });
  }
});

router.get('/agents', async (req: Request, res: Response) => {
  try {
    const agents = await analyticsService.getAgentsData();
    if (!agents || agents.length === 0) {
      return res.status(200).json([]);
    }
    res.json(agents); 
  } catch (error) {
    console.error('CRITICAL: Failed to fetch agent analytics', error);
    res.status(500).json({ error: 'Failed to fetch agent analytics' });
  }
});

router.get('/kpis', async (req: Request, res: Response) => {
  try {
    const kpis = await analyticsService.getPerformanceKPIs();
    res.json(kpis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch performance KPIs' });
  }
});

router.get('/ab-tests', async (req: Request, res: Response) => {
  try {
    const tests = await analyticsService.analyzeABTests();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze A/B tests' });
  }
});

router.get('/seo-rankings', async (req: Request, res: Response) => {
  try {
    const rankings = await analyticsService.getSEORankings();
    res.json(rankings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SEO rankings' });
  }
});

router.post('/roi/optimize', async (_req: Request, res: Response) => {
  try {
    const optimization = await roiEngine.analyzeAndOptimize();
    res.json(optimization);
  } catch (error) {
    res.status(500).json({ error: 'ROI Optimization failed' });
  }
});

router.post('/ab/generate', async (req: Request, res: Response) => {
  try {
    const { original, type, count } = req.body;
    const variants = await abTestingService.generateVariants(original, type, count);
    res.json(variants);
  } catch (error) {
    res.status(500).json({ error: 'A/B Variant generation failed' });
  }
});

export default router;
