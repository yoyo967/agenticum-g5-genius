import { kpiEngine } from './services/kpi-engine';
import { analyticsService } from './services/analytics';
import * as dotenv from 'dotenv';

dotenv.config();

async function runTest() {
  console.log('--- STARTING PERFORMANCE HUB VERIFICATION ---');
  
  const campaignId = 'test-campaign-001';
  
  // 1. Initialize A/B Test
  console.log('Initializing Mock A/B Test...');
  const testId = await kpiEngine.initializeMockABTest(campaignId);
  console.log(`Test ID: ${testId}`);

  // 2. Seed Mock KPI Events
  console.log('Seeding Mock KPI Events...');
  
  // Variant 1 (Obsidian Pulse)
  for (let i = 0; i < 50; i++) {
    await kpiEngine.recordEvent({ type: 'view', campaignId, variantId: 'v1', platform: 'google-ads' });
  }
  for (let i = 0; i < 15; i++) {
    await kpiEngine.recordEvent({ type: 'click', campaignId, variantId: 'v1', platform: 'google-ads' });
  }
  for (let i = 0; i < 3; i++) {
    await kpiEngine.recordEvent({ type: 'conversion', campaignId, variantId: 'v1', platform: 'google-ads' });
  }

  // Variant 2 (Gold Precision)
  for (let i = 0; i < 50; i++) {
    await kpiEngine.recordEvent({ type: 'view', campaignId, variantId: 'v2', platform: 'google-ads' });
  }
  for (let i = 0; i < 8; i++) {
    await kpiEngine.recordEvent({ type: 'click', campaignId, variantId: 'v2', platform: 'google-ads' });
  }
  for (let i = 0; i < 1; i++) {
    await kpiEngine.recordEvent({ type: 'conversion', campaignId, variantId: 'v2', platform: 'google-ads' });
  }

  // 3. Verify Analytics Reporting
  console.log('\nVerifying Analytics Aggregation...');
  const kpis = await analyticsService.getPerformanceKPIs();
  console.log('Overall KPIs:', kpis);

  const abResults = await analyticsService.analyzeABTests();
  console.log('A/B Test Results:', JSON.stringify(abResults, null, 2));

  console.log('\n--- VERIFICATION FINISHED ---');
}

runTest().catch(console.error);
