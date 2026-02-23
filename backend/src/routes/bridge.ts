import { Router } from 'express';
import { eventFabric } from '../services/event-fabric';

const router = Router();

/**
 * Bridge endpoint for receiving real-time streams (screenshots, logs) 
 * from the Python G5 Engine and broadcasting them to all connected clients.
 */
router.post('/stream', (req, res) => {
  const { sessionId, agentId, type, data } = req.body;

  if (!sessionId || !type || !data) {
    return res.status(400).json({ error: 'Missing stream parameters' });
  }

  // Broadcast to all clients via the Neural Fabric
  eventFabric.broadcastPayload(
    agentId || 'ba-07',
    'os-core',
    `Stream: ${type}`,
    { sessionId, type, data, timestamp: Date.now() }
  );

  res.status(200).json({ status: 'broadcasted' });
});

export default router;
