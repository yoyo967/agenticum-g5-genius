import { Router, Request, Response } from 'express';
import { db, Collections } from '../services/firestore';
import { v4 as uuidv4 } from 'uuid';
import { PM07Manager } from '../agents/pm07-manager';
import { googleAdsService } from '../services/google-ads';
import { eventFabric } from '../services/event-fabric';

const router = Router();
const pm07 = new PM07Manager();

// PMax Complex Type Definitions mapping to Google Ads
export interface PMaxCampaign {
  id: string;
  name: string;
  status: 'ENABLED' | 'PAUSED' | 'DRAFT';
  objective: 'SALES' | 'LEADS' | 'WEBSITE_TRAFFIC' | 'LOCAL_STORE_VISITS';
  budget: {
    dailyAmount: number;
    currency: string;
  };
  biddingStrategy: {
    type: 'MAXIMIZE_CONVERSIONS' | 'MAXIMIZE_CONVERSION_VALUE';
    targetCpa?: number; // Optional tCPA
    targetRoas?: number; // Optional tROAS
    customerAcquisition: 'NEW_CUSTOMERS_ONLY' | 'BID_HIGHER_FOR_NEW' | 'STANDARD';
  };
  settings: {
    finalUrlExpansion: boolean;
    locationTargeting: string[];
    languageTargeting: string[];
  };
  assetGroups: PMaxAssetGroup[];
  createdAt: string;
  updatedAt: string;
}

export interface PMaxAssetGroup {
  id: string;
  name: string;
  status: 'ENABLED' | 'PAUSED';
  adStrength: 'INCOMPLETE' | 'POOR' | 'AVERAGE' | 'GOOD' | 'EXCELLENT';
  assets: {
    headlines: { text: string; pinned?: boolean }[]; // Max 15, length 30
    longHeadlines: { text: string }[]; // Max 5, length 90
    descriptions: { text: string }[]; // Max 4, length 90
    businessName: string; // Length 25
    images: { url: string; aspectRatio: 'SQUARE' | 'LANDSCAPE' | 'PORTRAIT' }[]; // Max 20 total
    videos: { url: string; type: 'YOUTUBE' | 'VEO' }[]; // Max 5
    logos: { url: string; aspectRatio: 'SQUARE' | 'LANDSCAPE' }[]; // Max 5
  };
  signals: PMaxAudienceSignal;
}

export interface PMaxAudienceSignal {
  searchThemes: string[]; // Max 25
  customSegments: string[]; // E.g. Competitor URLs, intent
  yourData: string[]; // E.g. CRM lists
  demographics: {
    ageSegments: string[];
    genders: string[];
  };
}

// Memory Mock Store Fallback (if Firestore not initialized)
let mockCampaignStore: PMaxCampaign[] = [
  {
    id: 'pmax-alpha-001',
    name: 'Q3 Cyber Security Lead Gen',
    status: 'ENABLED',
    objective: 'LEADS',
    budget: { dailyAmount: 500, currency: 'USD' },
    biddingStrategy: {
      type: 'MAXIMIZE_CONVERSIONS',
      targetCpa: 45.00,
      customerAcquisition: 'BID_HIGHER_FOR_NEW'
    },
    settings: {
      finalUrlExpansion: true,
      locationTargeting: ['United States', 'Germany', 'Japan'],
      languageTargeting: ['en']
    },
    assetGroups: [{
      id: 'ag-tech-ciso',
      name: 'CISO Persona Assets',
      status: 'ENABLED',
      adStrength: 'GOOD',
      assets: {
        headlines: [{ text: 'Automate Zero Trust' }, { text: 'AI Security Stack' }],
        longHeadlines: [{ text: 'Stop advanced threats at the edge with predictive AI models.' }],
        descriptions: [{ text: 'Unify your security posture and eliminate blind spots entirely.' }],
        businessName: 'Agenticum G5',
        images: [],
        videos: [],
        logos: []
      },
      signals: {
        searchThemes: ['zero trust architecture', 'enterprise network security'],
        customSegments: ['Competitors: CrowdStrike, Palo Alto'],
        yourData: ['CRM_CISO_MQLs'],
        demographics: { ageSegments: ['25-34', '35-44', '45-54'], genders: ['ALL'] }
      }
    }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/pmax/campaigns - List all campaigns
router.get('/campaigns', async (req: Request, res: Response) => {
  try {
    // Attempt Firestore first
    const snapshot = await db.collection('pmax_campaigns').get();
    if (snapshot.empty && mockCampaignStore.length > 0) {
      return res.json({ campaigns: mockCampaignStore });
    }
    const campaigns = snapshot.docs.map(doc => doc.data() as PMaxCampaign);
    res.json({ campaigns: campaigns.length > 0 ? campaigns : mockCampaignStore });
  } catch (err) {
    console.error('Firestore Pmax fetch failed, returning local mock store:', err);
    res.json({ campaigns: mockCampaignStore });
  }
});

// GET /api/pmax/campaigns/:id - Get specific campaign
router.get('/campaigns/:id', async (req: Request, res: Response) => {
  try {
    const doc = await db.collection('pmax_campaigns').doc(req.params.id).get();
    if (doc.exists) {
      res.json(doc.data());
    } else {
      const local = mockCampaignStore.find(c => c.id === req.params.id);
      if (local) res.json(local);
      else res.status(404).json({ error: 'Campaign not found' });
    }
  } catch (err) {
    const local = mockCampaignStore.find(c => c.id === req.params.id);
    if (local) res.json(local);
    else res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/pmax/campaigns - Create new campaign
router.post('/campaigns', async (req: Request, res: Response) => {
  try {
    const newCampaign: PMaxCampaign = {
      ...req.body,
      id: `pmax-${uuidv4()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Attempt Firestore
    await db.collection('pmax_campaigns').doc(newCampaign.id).set(newCampaign).catch(() => {
        // Fallback
        mockCampaignStore.push(newCampaign);
    });
    
    res.status(201).json(newCampaign);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// PUT /api/pmax/campaigns/:id - Update existing campaign
router.put('/campaigns/:id', async (req: Request, res: Response) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await db.collection('pmax_campaigns').doc(req.params.id).set(updateData, { merge: true }).catch(() => {
        mockCampaignStore = mockCampaignStore.map(c => c.id === req.params.id ? { ...c, ...updateData } : c);
    });
    
    res.json({ status: 'success', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

router.post('/launch', async (req: Request, res: Response) => {
  try {
    const { campaignId, config } = req.body;
    console.log(`[PMax Route] Initiating ecosystem launch for campaign: ${campaignId}`);
    
    // 1. PM-07 handles the strategy report
    const launchReport = await pm07.execute(`LAUNCH CAMPAIGN ${campaignId} WITH CONFIG: ${JSON.stringify(config)}`);
    
    // 2. Trigger the real (simulated) Google Ads Launch
    const campaignDoc = await db.collection('pmax_campaigns').doc(campaignId).get();
    const campaignData = campaignDoc.exists ? campaignDoc.data() : mockCampaignStore.find(c => c.id === campaignId);
    
    if (campaignData) {
      const adsResult = await googleAdsService.createPMaxCampaign({
        name: campaignData.name,
        budgetAmountMicros: campaignData.budget.dailyAmount * 1000000,
        finalUrls: campaignData.settings.finalUrlExpansion ? ['https://agenticum-g5.web.app'] : [],
        headlines: campaignData.assetGroups[0].assets.headlines.map((h: any) => h.text),
        descriptions: campaignData.assetGroups[0].assets.descriptions.map((d: any) => d.text),
        images: [],
      });
      
      eventFabric.broadcast({ type: 'pmax-launch', campaignId, adsResult });
      
      res.json({
        success: true,
        report: launchReport,
        adsResult,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(404).json({ error: 'Campaign details not found for launch' });
    }
  } catch (error) {
    console.error('Launch failed:', error);
    res.status(500).json({ error: 'Ecosystem launch failed' });
  }
});

export default router;
