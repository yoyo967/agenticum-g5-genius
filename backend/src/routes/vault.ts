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
      // 1. Upload to storage (local fallback or GCS)
      const url = await storageService.uploadFile(file.originalname, file.buffer, file.mimetype);
      
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
          await DiscoveryEngineService.getInstance().ingestDocument(file.originalname, text);
        }
      } catch (parseError) {
        console.error(`Failed to parse document context ${file.originalname}:`, parseError);
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

router.get('/list', async (_req: Request, res: Response) => {
  try {
    const files = await storageService.listFiles();
    res.json({ files });
  } catch (error) {
    console.error('Failed to list vault files:', error);
    res.status(500).json({ error: 'Failed to list vault files.' });
  }
});

export default router;
