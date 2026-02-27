import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // Pfad anpassen falls abweichend
import type { NexusArchiveDocument } from '../types/nexus';

export const useFeedData = (limitCount: number = 3) => {
  const [data, setData] = useState<NexusArchiveDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'nexus_archives'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as NexusArchiveDocument[];
        
        setData(docs);
        setIsLoading(false);
      }, 
      (err) => {
        console.error("G5 Feed Sync Error:", err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limitCount]);

  return { data, isLoading, error };
};
