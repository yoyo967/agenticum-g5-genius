import type { ActivityEntry } from './ActivityFeed';

/** Utility: create a timestamped ActivityEntry */
export function makeEntry(
  agent: string,
  message: string,
  type: ActivityEntry['type'] = 'action'
): ActivityEntry {
  const now = new Date();
  const time = now.toTimeString().slice(0, 8);
  return { id: `${Date.now()}-${Math.random()}`, time, agent, message, type };
}
