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
