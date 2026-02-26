import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy, where } from 'firebase/firestore';

export interface Article {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'optimizing' | 'published';
  timestamp: string;
  agent?: string;
  authorAgent?: string;
  excerpt?: string;
  content?: string;
  tag?: string;
  type?: string;
  pillarId?: string;
}

export function useBlogFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let pillarsData: Article[] = [];
    let clustersData: Article[] = [];
    let pillarsLoaded = false;
    let clustersLoaded = false;

    const updateCombined = () => {
      if (pillarsLoaded && clustersLoaded) {
        const combined = [...pillarsData, ...clustersData];
        combined.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
        setArticles(combined);
        setLoading(false);
      }
    };

    const qPillars = query(
      collection(db, 'pillars'), 
      where('visibility', '==', 'public'),
      orderBy('timestamp', 'desc')
    );
    const unsubscribePillars = onSnapshot(qPillars, (snapshot) => {
      pillarsData = snapshot.docs.map(doc => ({ id: doc.id, type: 'pillar', ...doc.data() } as Article));
      pillarsLoaded = true;
      updateCombined();
    }, (err) => {
      console.error("Error listening to pillars:", err);
      setError(err);
      setLoading(false); // Ensure loading stops on error
      pillarsLoaded = true;
      updateCombined();
    });

    const qClusters = query(
      collection(db, 'clusters'), 
      where('visibility', '==', 'public'),
      orderBy('timestamp', 'desc')
    );
    const unsubscribeClusters = onSnapshot(qClusters, (snapshot) => {
      clustersData = snapshot.docs.map(doc => ({ id: doc.id, type: 'cluster', ...doc.data() } as Article));
      clustersLoaded = true;
      updateCombined();
    }, (err) => {
      console.error("Error listening to clusters:", err);
      setError(err);
      setLoading(false); // Ensure loading stops on error
      clustersLoaded = true;
      updateCombined();
    });

    return () => {
      unsubscribePillars();
      unsubscribeClusters();
    };
  }, []);

  return { articles, loading, error };
}
