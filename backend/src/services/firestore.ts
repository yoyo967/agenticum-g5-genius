import { Firestore } from '@google-cloud/firestore';

// Initialize the Google Cloud Firestore instance.
// It will automatically use the Application Default Credentials.
export const db = new Firestore();

export const Collections = {
  PILLARS: 'pillars',
  CLUSTERS: 'clusters'
};
