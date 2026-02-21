import { Router, Request, Response } from 'express';
import multer from 'multer';
import { storageService } from '../services/storage';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.array('files'), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files provided in payload.' });
    }

    const uploadPromises = files.map(file => 
      storageService.uploadFile(file.originalname, file.buffer, file.mimetype)
    );

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

export default router;
