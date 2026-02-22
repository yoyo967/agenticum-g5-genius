export type BlogStatus = 'draft' | 'optimizing' | 'published';

export interface Pillar {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  authorAgent: string; // "CC-06 Director"
  timestamp: any; // Firestore Timestamp
  status: BlogStatus;
}

export interface Cluster {
  id: string;
  pillarId: string; // Reference to the parent pillar
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  authorAgent: string; // "CC-06 Director"
  timestamp: any; // Firestore Timestamp
  status: BlogStatus;
}

export interface BlogFeedResponse {
  pillars: Pillar[];
  clusters: Cluster[];
}
