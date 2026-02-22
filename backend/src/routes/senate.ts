import { Router, Request, Response } from 'express';
import { db, Collections } from '../services/firestore';

const router = Router();

// GET /api/senate/docket - List all senate cases
router.get('/docket', async (_req: Request, res: Response) => {
  try {
    const snapshot = await db.collection(Collections.SENATE_DOCKET).get();
    const cases = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    cases.sort((a: any, b: any) => {
      const ta = a.timestamp?.toDate?.() || new Date(a.timestamp || 0);
      const tb = b.timestamp?.toDate?.() || new Date(b.timestamp || 0);
      return tb.getTime() - ta.getTime();
    });
    res.json({ cases });
  } catch (error) {
    console.error('Senate docket fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch senate docket' });
  }
});

// POST /api/senate/submit - Submit a new case for review
router.post('/submit', async (req: Request, res: Response) => {
  try {
    const { agent, type, risk, title, payload } = req.body;
    const docRef = await db.collection(Collections.SENATE_DOCKET).add({
      agent,
      type: type || 'CONTENT_REVIEW',
      risk: risk || 'medium',
      title,
      payload,
      verdict: 'PENDING',
      timestamp: new Date(),
      createdAt: new Date(),
    });
    res.status(201).json({ id: docRef.id, status: 'submitted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit case' });
  }
});

// PUT /api/senate/verdict/:id - Cast verdict on a case
router.put('/verdict/:id', async (req: Request, res: Response) => {
  try {
    const { verdict, reason } = req.body; // verdict: 'APPROVED' | 'REJECTED'
    await db.collection(Collections.SENATE_DOCKET).doc(req.params.id).update({
      verdict,
      reason: reason || '',
      reviewedAt: new Date(),
    });
    res.json({ status: 'success', id: req.params.id, verdict });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cast verdict' });
  }
});

export default router;
