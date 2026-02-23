import { Router, Request, Response } from 'express';
import { analyticsService } from '../services/analytics';

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
    res.json(agents); // Frontend expects the array directly or wrapped depending on implementation
  } catch (error) {
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

export default router;
