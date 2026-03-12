import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

/**
 * Real-time listener for a specific swarm orchestration run.
 * Tracks task progress, agent assignments, and completion states.
 */
export const useSwarmRun = (runId: string | null) => {
  const [run, setRun] = useState<any>(null);
  const [loading, setLoading] = useState(!!runId);

  useEffect(() => {
    if (!runId) {
        setRun(null);
        setLoading(false);
        return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(doc(db, 'swarm_runs', runId), (snapshot) => {
      if (snapshot.exists()) {
        setRun({ id: snapshot.id, ...snapshot.data() });
      } else {
        setRun(null);
      }
      setLoading(false);
    }, (error) => {
      console.error(`Error listening to swarm run ${runId}:`, error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [runId]);

  return { run, loading };
};
