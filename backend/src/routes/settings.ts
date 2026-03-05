import { Router, Request, Response } from 'express';
import { SettingsService } from '../services/settings-service';

const router = Router();
const settingsService = SettingsService.getInstance();

// Allowed top-level keys to protect against corruption
const ALLOWED_KEYS = new Set([
  'gemini', 'wordpress', 'linkedin', 'email', 'gads', 'autopilot',
  'notifications', 'theme', 'timezone', 'language', 'agentBehavior'
]);

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
    const body = req.body;

    if (typeof body !== 'object' || Array.isArray(body) || body === null) {
      return res.status(400).json({ error: 'Settings payload must be a JSON object.' });
    }

    // Strip unknown keys to prevent arbitrary data corruption
    const sanitized: Record<string, unknown> = {};
    for (const key of Object.keys(body)) {
      if (ALLOWED_KEYS.has(key)) {
        sanitized[key] = body[key];
      }
    }

    if (Object.keys(sanitized).length === 0) {
      return res.status(400).json({
        error: 'No valid settings keys provided.',
        allowed: Array.from(ALLOWED_KEYS)
      });
    }

    await settingsService.saveSettings(sanitized);
    res.json({ status: 'success', saved: Object.keys(sanitized) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to write settings' });
  }
});

export default router;
