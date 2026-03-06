import { Router, Request, Response } from 'express';
import multer from 'multer';
import { storageService } from '../services/storage';
import { DiscoveryEngineService } from '../services/discovery-engine';
const pdfParse = require('pdf-parse');

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.array('files'), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files provided in payload.' });
    }

    const uploadPromises = files.map(async file => {
      // Decode originalname from latin1 to utf8 to fix common encoding issues with Multer/browsers
      const decodedName = Buffer.from(file.originalname, 'latin1').toString('utf8');
      
      // 1. Upload to storage (local fallback or GCS)
      const url = await storageService.uploadFile(decodedName, file.buffer, file.mimetype);
      
      // 2. Parse text and send to Discovery Engine
      try {
        let text = '';
        if (file.mimetype === 'application/pdf') {
          if (!file.buffer || file.buffer.length === 0) {
            throw new Error('Empty PDF buffer provided.');
          }
          try {
            const pdfData = await pdfParse(file.buffer);
            text = pdfData.text || '';
          } catch (pdfError) {
            console.error('PDF parsing library threw a fatal error:', pdfError);
            text = '[UNPARSABLE PDF CONTENT]';
          }
        } else if (file.mimetype.includes('text')) {
          text = file.buffer.toString('utf-8');
        }
        
        if (text.trim()) {
          await DiscoveryEngineService.getInstance().ingestDocument(decodedName, text);
        }
      } catch (parseError) {
        console.error(`Failed to parse document context ${decodedName}:`, parseError);
        // Continue without failing the whole upload
      }
      
      return url;
    });

    const urls = await Promise.all(uploadPromises);

    res.json({
      status: 'success',
      message: `${files.length} assets successfully ingested into the Vault.`,
      urls
    });
  } catch (error) {
    console.error('Vault ingestion error:', error);
    res.status(500).json({ error: 'Vault ingestion failed.' });
  }
});

router.get('/usage', async (_req: Request, res: Response) => {
  try {
    const usage = await storageService.getBucketUsage();
    res.json({ status: 'ok', ...usage });
  } catch (error) {
    console.error('Failed to get bucket usage:', error);
    res.status(500).json({ error: 'Failed to retrieve storage usage.' });
  }
});

router.get('/list', async (_req: Request, res: Response) => {
  try {
    const files = await storageService.listFiles();
    res.json({ files });
  } catch (error) {
    console.error('Failed to list vault files:', error);
    res.status(500).json({ error: 'Failed to list vault files.' });
  }
});

router.get('/files', async (_req: Request, res: Response) => {
  try {
    const files = await storageService.listFiles();
    // Wrap in object to stay consistent with other endpoints if needed
    res.json({ status: 'success', files });
  } catch (error) {
    console.error('Failed to list vault files:', error);
    res.status(500).json({ error: 'Failed to list vault files.' });
  }
});

/**
 * POST /api/v1/vault/twin-log
 * Perfect Twin Audit — log every AI output to Firestore for audit trail
 */
router.post('/twin-log', async (req: Request, res: Response) => {
  try {
    const { action, input, output, agent, timestamp, senateApproved } = req.body;

    if (!action || !agent) {
      return res.status(400).json({ error: 'Missing required fields: action, agent' });
    }

    // Try to persist to Firestore
    try {
      const { FirestoreManager } = require('../services/firestore');
      const firestore = FirestoreManager.getInstance();
      const db = firestore.getDb();

      if (db) {
        const docRef = await db.collection('perfect_twin_logs').add({
          action,
          input: typeof input === 'string' ? input.slice(0, 500) : JSON.stringify(input).slice(0, 500),
          outputSummary: typeof output === 'string'
            ? output.slice(0, 300)
            : JSON.stringify(output).slice(0, 300),
          agent,
          timestamp: timestamp || new Date().toISOString(),
          senateApproved: senateApproved ?? true,
          createdAt: new Date(),
        });

        return res.json({
          status: 'sealed',
          id: docRef.id,
          docId: docRef.id,
          agent,
          message: `Perfect Twin log sealed in Firestore — ID: ${docRef.id}`,
        });
      }
    } catch (firestoreErr) {
      console.warn('[Twin Log] Firestore unavailable, using fallback ID:', firestoreErr);
    }

    // Fallback: return a deterministic pseudo-ID
    const fallbackId = `twin-${Date.now()}-${agent.toLowerCase()}`;
    return res.json({
      status: 'sealed',
      id: fallbackId,
      docId: fallbackId,
      agent,
      message: 'Perfect Twin log sealed (local fallback — Firestore offline)',
    });

  } catch (err) {
    console.error('[Twin Log] Error:', err);
    return res.status(500).json({ error: 'Twin log failed', details: String(err) });
  }
});

export default router;
