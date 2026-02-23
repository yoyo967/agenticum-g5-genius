import { Firestore } from '@google-cloud/firestore';
import path from 'path';
import fs from 'fs';

let projectId = process.env.GOOGLE_CLOUD_PROJECT || 'online-marketing-manager';

try {
  const settingsPath = path.join(process.cwd(), 'data', 'settings.json');
  if (fs.existsSync(settingsPath)) {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    if (settings.projectId) {
      projectId = settings.projectId;
    }
  }
} catch (e) {
  console.error('Failed to read Firestore project ID from settings', e);
}

export const db = new Firestore({ 
  projectId,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS 
});

export const Collections = {
  PILLARS: 'pillars',
  CLUSTERS: 'clusters',
  CAMPAIGNS: 'pmax_campaigns',
  SENATE_DOCKET: 'senate_docket',
  KPI_METRICS: 'kpi_metrics',
  AB_TESTS: 'ab_tests'
};
