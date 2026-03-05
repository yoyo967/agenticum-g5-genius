import { Router, Request, Response } from 'express';
import { db, Collections } from '../services/firestore';

const router = Router();

const VALID_TYPES = ['CONTENT_REVIEW', 'COMPLIANCE_CHECK', 'BRAND_SAFETY', 'LEGAL_REVIEW', 'PERFORMANCE_AUDIT'];
const VALID_RISKS = ['low', 'medium', 'high', 'critical'];

// GET /api/senate/docket - List all senate cases
router.get('/docket', async (_req: Request, res: Response) => {
  try {
    const snapshot = await db.collection(Collections.SENATE_DOCKET).get();
    const cases = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    cases.sort((a: any, b: any) => {
      // Safe timestamp handling: support Firestore Timestamp, ISO string, or ms number
      const toMs = (ts: any): number => {
        if (!ts) return 0;
        if (typeof ts === 'string' || typeof ts === 'number') return new Date(ts).getTime();
        if (typeof ts.toDate === 'function') return ts.toDate().getTime();
        return 0;
      };
      return toMs(b.timestamp) - toMs(a.timestamp);
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

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Missing required field: title' });
    }

    const resolvedType = VALID_TYPES.includes(type) ? type : 'CONTENT_REVIEW';
    const resolvedRisk = VALID_RISKS.includes(risk) ? risk : 'medium';

    const docRef = await db.collection(Collections.SENATE_DOCKET).add({
      agent: agent || 'SYSTEM',
      type: resolvedType,
      risk: resolvedRisk,
      title: title.trim(),
      payload,
      verdict: 'PENDING',
      timestamp: new Date(),
      createdAt: new Date(),
    });
    res.status(201).json({ id: docRef.id, status: 'submitted', type: resolvedType, risk: resolvedRisk });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit case' });
  }
});

// PUT /api/senate/verdict/:id - Cast verdict on a case
router.put('/verdict/:id', async (req: Request, res: Response) => {
  try {
    const { verdict, reason } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(verdict)) {
      return res.status(400).json({ error: 'Invalid verdict. Must be APPROVED or REJECTED.' });
    }

    await db.collection(Collections.SENATE_DOCKET).doc(req.params.id).update({
      verdict,
      reason: reason?.trim() || '',
      reviewedAt: new Date(),
    });
    res.json({ status: 'success', id: req.params.id, verdict });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cast verdict' });
  }
});

export default router;
