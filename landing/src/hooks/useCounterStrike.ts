import { useState, useCallback } from 'react';
import { ENGINE_URL } from '../config';

export interface CompetitorOverlap {
  competitor: string;
  url: string;
  their_h2_structure: string[];
}

export const useCounterStrike = () => {
  const [data, setData] = useState<{ overlap: CompetitorOverlap[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeTopic = useCallback(async (topic: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${ENGINE_URL}/engine/counter-strike?topic=${encodeURIComponent(topic)}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, analyzeTopic };
};
