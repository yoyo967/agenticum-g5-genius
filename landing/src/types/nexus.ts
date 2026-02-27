import { Timestamp } from 'firebase/firestore';

export interface NexusArchiveDocument {
  id: string;
  title: string;
  excerpt: string;
  category: 'Intelligence' | 'Market Data' | 'Swarm Operations';
  createdAt: Timestamp;
  senateScore: number;
  status: 'draft' | 'approved';
  googleSearchQueries: string[];
  verifiedSources: string[];
}
