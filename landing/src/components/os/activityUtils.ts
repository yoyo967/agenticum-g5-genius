export interface ActivityEntry {
  id: string;
  time: string;
  timestamp: number;
  agent: string;
  message: string;
  type?: 'dispatch' | 'action' | 'senate' | 'output' | 'error';
}

/** Utility: create a timestamped ActivityEntry */
export function makeEntry(
  agent: string,
  message: string,
  type: ActivityEntry['type'] = 'action'
): ActivityEntry {
  const now = new Date();
  const time = now.toTimeString().slice(0, 8);
  const timestamp = now.getTime();
  return { id: `${timestamp}-${Math.floor(Math.random() * 100000)}`, time, timestamp, agent, message, type };
}
