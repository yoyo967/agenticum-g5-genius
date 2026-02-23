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

import { Router, Request, Response } from 'express';
import { SettingsService } from '../services/settings-service';

const router = Router();
const settingsService = SettingsService.getInstance();

router.get('/', async (req: Request, res: Response) => {
  try {
    const settings = await settingsService.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read settings' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    await settingsService.saveSettings(req.body);
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to write settings' });
  }
});

export default router;
