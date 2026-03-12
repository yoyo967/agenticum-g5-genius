import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export interface AgentOutput {
  output_id: string;
  agent_id: string;
  agent_name: string;
  type: string;
  payload: any;
  created_at: any;
  run_id: string;
  campaign_id: string;
  senate_status: string;
}

/**
 * Real-time listener for agent outputs.
 * Enables automatic UI updates as soon as an agent finishes a task.
 */
export const useAgentOutputs = (filter?: { runId?: string, campaignId?: string }) => {
  const [outputs, setOutputs] = useState<AgentOutput[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(collection(db, 'agent_outputs'), orderBy('created_at', 'desc'));
    
    if (filter?.runId) {
      q = query(collection(db, 'agent_outputs'), where('run_id', '==', filter.runId), orderBy('created_at', 'desc'));
    } else if (filter?.campaignId) {
      q = query(collection(db, 'agent_outputs'), where('campaign_id', '==', filter.campaignId), orderBy('created_at', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        output_id: doc.id
      } as AgentOutput));
      setOutputs(data);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to agent outputs:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filter?.runId, filter?.campaignId]);

  return { outputs, loading };
};
