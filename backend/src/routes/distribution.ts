import { Router } from 'express';
import { distributionService } from '../services/distribution';
import { roiEngine } from '../services/roi-engine';
import { Logger } from '../utils/logger';

const router = Router();
const logger = new Logger('DistributionRouter');

router.post('/publish', async (req, res) => {
  const { channel, content, payload } = req.body;
  
  logger.info(`Manual distribution request for channel: ${channel}`);

  try {
    let result;
    switch (channel) {
      case 'linkedin':
        result = await distributionService.publishToLinkedIn(payload || content);
        break;
      case 'email':
        result = await distributionService.publishToEmail({
          subject: 'G5 Swarm Dispatch',
          body: payload || content,
          recipients: ['executive@agenticum.ai']
        });
        break;
      case 'wordpress':
      case 'blog':
        result = await distributionService.publishToWordPress({
          title: 'G5 Sentience Update',
          body: payload || content
        });
        break;
      case 'social_echo':
        result = await distributionService.publishToSocialEcho(payload || content);
        break;
      default:
        return res.status(400).json({ success: false, error: 'Unsupported channel' });
    }

    // Record ROI impact
    roiEngine.recordDistributionEvent(channel);

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    logger.error(`Distribution failed: ${channel}`, error as Error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;
