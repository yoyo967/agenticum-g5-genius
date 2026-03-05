import { Router } from 'express';
import { distributionService } from '../services/distribution';
import { roiEngine } from '../services/roi-engine';
import { Logger } from '../utils/logger';

const router = Router();
const logger = new Logger('DistributionRouter');

const SUPPORTED_CHANNELS = ['linkedin', 'email', 'wordpress', 'blog', 'social_echo'];
const DEFAULT_RECIPIENTS = (process.env.EMAIL_RECIPIENTS || 'team@agenticum.ai').split(',');

router.post('/publish', async (req, res) => {
  const { channel, content, payload, recipients, subject, title } = req.body;

  logger.info(`Manual distribution request for channel: ${channel}`);

  if (!SUPPORTED_CHANNELS.includes(channel)) {
    return res.status(400).json({
      success: false,
      error: 'Unsupported channel',
      supported: SUPPORTED_CHANNELS
    });
  }

  try {
    let result;
    switch (channel) {
      case 'linkedin':
        result = await distributionService.publishToLinkedIn(payload || content);
        break;
      case 'email': {
        const emailRecipients: string[] = Array.isArray(recipients) && recipients.length > 0
          ? recipients
          : DEFAULT_RECIPIENTS;
        result = await distributionService.publishToEmail({
          subject: subject || 'G5 Swarm Dispatch',
          body: payload || content,
          recipients: emailRecipients
        });
        break;
      }
      case 'wordpress':
      case 'blog':
        result = await distributionService.publishToWordPress({
          title: title || 'G5 Sentience Update',
          body: payload || content
        });
        break;
      case 'social_echo':
        result = await distributionService.publishToSocialEcho(payload || content);
        break;
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
    // Do not leak internal error details to client
    res.status(500).json({ success: false, error: 'Distribution service unavailable. Please try again.' });
  }
});

export default router;
