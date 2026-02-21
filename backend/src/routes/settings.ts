import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json');

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

router.get('/', (req: Request, res: Response) => {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      res.json(JSON.parse(data));
    } else {
      res.json({}); // Return empty if doesn't exist yet
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to read settings' });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(req.body, null, 2));
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to write settings' });
  }
});

export default router;
