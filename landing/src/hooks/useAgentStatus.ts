import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export interface AgentStatus {
    agent_id: string;
    status: 'idle' | 'thinking' | 'working' | 'done' | 'error';
    message: string;
    progress: number;
    updated_at: any;
    run_id?: string;
}

/**
 * Global listener for all agent statuses.
 * Primär genutzt für die Synergy Map (Live Intelligence Stream).
 */
export const useAgentStatus = () => {
  const [statuses, setStatuses] = useState<Record<string, AgentStatus>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'agent_status'), (snapshot) => {
      const newStatuses: Record<string, AgentStatus> = {};
      snapshot.docs.forEach(doc => {
        newStatuses[doc.id] = doc.data() as AgentStatus;
      });
      setStatuses(newStatuses);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to agent statuses:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { statuses, loading };
};
