import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, FolderHeart, FileText, Search, Target, RefreshCw, Clock, ChevronRight, Building2 } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { ExportMenu } from './ui';
import { downloadJSON, downloadCSV } from '../utils/export';

interface Campaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  budget?: { dailyAmount: number; currency: string };
  createdAt: string;
}

interface VaultFile {
  name: string;
  url: string;
  timestamp?: string;
}

export function ProjectMemory() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [assets, setAssets] = useState<VaultFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [campRes, vaultRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/pmax/campaigns`),
        fetch(`${API_BASE_URL}/api/vault/list`),
      ]);
      if (campRes.ok) {
        const data = await campRes.json();
        setCampaigns(data.campaigns || []);
      }
      if (vaultRes.ok) {
        const data = await vaultRes.json();
        setAssets(data.files || []);
      }
    } catch (e) {
      console.warn('[Memory] Backend unavailable:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredCampaigns = campaigns.filter(c =>
    !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.objective?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.1)' }}>
            <Database size={20} className="text-purple-400" />
          </div>
          <div>
            <h2 className="font-display text-xl uppercase tracking-tight">Project Memory</h2>
            <p className="font-mono text-[10px] text-white/30">Campaign History + Asset Archive</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchData} className="btn btn-ghost btn-sm">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <ExportMenu options={[
            { label: 'JSON All', format: 'JSON', onClick: () => downloadJSON({ campaigns, assets }, 'G5_Project_Memory') },
            { label: 'CSV Campaigns', format: 'CSV', onClick: () => downloadCSV(campaigns.map(c => ({ id: c.id, name: c.name, status: c.status, objective: c.objective, budget: c.budget?.dailyAmount ?? '', created: c.createdAt })), 'G5_Campaigns_Memory') },
          ]} />
        </div>
      </div>

      {/* Search */}
      <div className="relative shrink-0">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search campaigns, objectives..." className="input pl-10" />
      </div>

      <div className="flex flex-1 gap-5 min-h-0">
        {/* Left: Campaign List */}
        <div className="w-1/3 flex flex-col gap-3 overflow-y-auto">
          <h3 className="label">Campaigns ({filteredCampaigns.length})</h3>
          {loading ? (
            [...Array(4)].map((_, i) => <div key={i} className="skeleton h-20 w-full" />)
          ) : filteredCampaigns.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <FolderHeart size={40} className="text-white/10 mb-3" />
              <p className="font-display text-sm uppercase text-white/20">No Campaigns</p>
            </div>
          ) : (
            filteredCampaigns.map(camp => (
              <motion.div key={camp.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`card cursor-pointer group hover:border-white/20 ${selectedCampaign?.id === camp.id ? 'border-accent/30' : ''}`}
                onClick={() => setSelectedCampaign(camp)}>
                <div className="flex items-center gap-3">
                  <Target size={16} className="text-accent shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-xs uppercase truncate">{camp.name}</p>
                    <p className="font-mono text-[9px] text-white/25 mt-0.5">{camp.objective} · {camp.status}</p>
                  </div>
                  <ChevronRight size={12} className="text-white/15 group-hover:text-accent shrink-0" />
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Center: Campaign Detail */}
        <div className="flex-1 glass flex flex-col overflow-hidden">
          {selectedCampaign ? (
            <>
              <div className="p-4 border-b border-white/5 shrink-0">
                <h3 className="font-display text-lg uppercase">{selectedCampaign.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`badge ${selectedCampaign.status === 'ENABLED' ? 'badge-online' : 'badge-processing'}`}>{selectedCampaign.status}</span>
                  <span className="font-mono text-[9px] text-white/25">{selectedCampaign.objective}</span>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <div className="card">
                  <h4 className="label mb-2">Campaign Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="font-mono text-[9px] text-white/25 block">Budget</span>
                      <span className="font-mono text-sm text-white">${selectedCampaign.budget?.dailyAmount || 0}/day</span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] text-white/25 block">Created</span>
                      <span className="font-mono text-sm text-white">{new Date(selectedCampaign.createdAt).toLocaleDateString('en-US')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <Building2 size={48} className="text-white/5 mb-4" />
              <p className="font-display text-lg uppercase text-white/15">Select a Campaign</p>
              <p className="font-mono text-xs text-white/10 mt-1">View campaign details and associated assets</p>
            </div>
          )}
        </div>

        {/* Right: Asset Archive */}
        <div className="w-1/4 flex flex-col gap-3 overflow-y-auto">
          <h3 className="label">Vault Assets ({assets.length})</h3>
          {assets.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={24} className="text-white/10 mx-auto mb-2" />
              <p className="font-mono text-[9px] text-white/15">No assets in vault</p>
            </div>
          ) : (
            assets.slice(0, 20).map(file => (
              <motion.div key={file.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="card p-3! flex items-center gap-2 group hover:border-white/15">
                <FileText size={12} className="text-white/30 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[9px] text-white/60 truncate">{file.name}</p>
                </div>
                {file.timestamp && (
                  <span className="font-mono text-[8px] text-white/15 shrink-0 flex items-center gap-1">
                    <Clock size={8} />{new Date(file.timestamp).toLocaleDateString('en-US')}
                  </span>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
