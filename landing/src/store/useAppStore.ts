import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from 'firebase/auth';

interface CampaignDraft {
  id: string;
  name: string;
  status: 'DRAFT' | 'PENDING_AGENTS' | 'ACTIVE';
  objective: string;
  budget: number;
}

interface AppState {
  // Auth State
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;

  // Global Campaigns
  activeCampaigns: CampaignDraft[];
  setCampaigns: (campaigns: CampaignDraft[]) => void;
  addCampaign: (campaign: CampaignDraft) => void;

  // Swarm Status
  globalSwarmActive: boolean;
  setGlobalSwarmActive: (isActive: boolean) => void;

  // Generated Assets
  globalAssets: Array<{ url: string; type: string; timestamp: Date; agent: string }>;
  setGlobalAssets: (assets: Array<{ url: string; type: string; timestamp: Date; agent: string }>) => void;
  addGlobalAsset: (asset: { url: string; type: string; timestamp: Date; agent: string }) => void;

  // Thought Stream
  globalThoughts: Array<{ id: string; agentId: string; text: string; type: 'thought' | 'scavenge' | 'verdict' | 'visual' }>;
  addGlobalThought: (thought: { id: string; agentId: string; text: string; type: 'thought' | 'scavenge' | 'verdict' | 'visual' }) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      activeCampaigns: [],
      setCampaigns: (campaigns) => set({ activeCampaigns: campaigns }),
      addCampaign: (campaign) => set((state) => ({ 
        activeCampaigns: [campaign, ...state.activeCampaigns] 
      })),

      globalSwarmActive: false,
      setGlobalSwarmActive: (isActive) => set({ globalSwarmActive: isActive }),

      globalAssets: [],
      setGlobalAssets: (assets) => set({ globalAssets: assets }),
      addGlobalAsset: (asset) => set((state) => ({ globalAssets: [asset, ...state.globalAssets] })),

      globalThoughts: [],
      addGlobalThought: (thought) => set((state) => ({ globalThoughts: [thought, ...state.globalThoughts].slice(0, 50) })),
    }),
    {
      name: 'genius-os-storage',
      partialize: (state) => ({ 
        // Only persist non-sensitive, non-volatile data
        isAuthenticated: state.isAuthenticated,
        user: state.user ? { uid: state.user.uid, email: state.user.email } as User : null
      }),
    }
  )
);
