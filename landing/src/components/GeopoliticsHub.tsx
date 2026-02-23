import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Shield, RefreshCw, Zap, Server, Activity, Network } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface SovereignNode {
  id: string;
  region: string;
  status: 'online' | 'syncing' | 'sovereign';
  complianceLevel: string;
  lastSeen: string;
}

export function GeopoliticsHub() {
  const [nodes, setNodes] = useState<SovereignNode[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const fetchNodes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/sovereign/nodes`);
      if (res.ok) setNodes(await res.json());
    } catch {
      console.error('Failed to fetch global nodes');
    }
  };

  useEffect(() => { fetchNodes(); }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Initiating Federated Intelligence Sync...');
    try {
      const res = await fetch(`${API_BASE_URL}/api/sovereign/sync`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setSyncStatus(`Sync Successful: ${data.dataExchangedKB} KB of intelligence shared.`);
        fetchNodes();
      }
    } catch {
      setSyncStatus('Sync Failed: Network connection to primary node lost.');
    } finally {
      setTimeout(() => {
        setIsSyncing(false);
        setSyncStatus(null);
      }, 5000);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center border border-accent/30">
            <Globe className="text-accent" size={24} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-white">Geopolitics Hub</h2>
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Global Sovereign AI Mesh Controller — Phase 11 Active</p>
          </div>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="btn btn-primary gap-2"
          style={{ background: isSyncing ? 'var(--color-magenta)' : 'var(--color-accent)', borderColor: isSyncing ? 'var(--color-magenta)' : 'var(--color-accent)', color: 'black' }}
        >
          {isSyncing ? <RefreshCw className="animate-spin" size={14} /> : <Network size={14} />}
          {isSyncing ? 'Synchronizing Swarm...' : 'Federated Intelligence Sync'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stats Grid */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-4 border-accent/20">
            <h3 className="text-[10px] font-mono text-white/30 uppercase mb-2">Global Coverage</h3>
            <p className="text-3xl font-display font-bold text-accent">4 ZONES</p>
          </div>
          <div className="glass-card p-4 border-emerald/20">
            <h3 className="text-[10px] font-mono text-white/30 uppercase mb-2">Sovereign Compliance</h3>
            <p className="text-3xl font-display font-bold text-emerald">100%</p>
          </div>
          <div className="glass-card p-4 border-magenta/20">
            <h3 className="text-[10px] font-mono text-white/30 uppercase mb-2">Mesh Latency</h3>
            <p className="text-3xl font-display font-bold text-magenta">1.2ms</p>
          </div>
          
          <div className="card-accent p-4 rounded-xl border-accent/30 bg-accent/5">
            <h4 className="font-display text-xs font-bold uppercase text-accent mb-2 flex items-center gap-2">
              <Shield size={12} /> Privacy Gateway
            </h4>
            <p className="text-[10px] text-white/50 leading-relaxed">
              All intelligence data is filtered through regional sovereign gateways. No raw PII escapes the jurisdictional containment zones.
            </p>
          </div>
        </div>

        {/* Global Node Map (Simulated) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass holo-card p-1 border-white/5 aspect-16/8 relative overflow-hidden bg-black/40">
            {/* Simple simulated world map visualization */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="w-full h-full bg-[radial-gradient(circle_at_center,var(--color-accent)_0%,transparent_70%)] opacity-20" />
                <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-accent blur-xl" />
                <div className="absolute bottom-1/3 right-1/4 w-12 h-12 rounded-full bg-magenta blur-xl" />
            </div>
            
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                  <div className="space-y-1">
                      <span className="font-mono text-[9px] text-accent uppercase tracking-widest">Neural Link Latency</span>
                      <div className="flex items-center gap-1">
                          <Activity size={12} className="text-accent animate-pulse" />
                          <span className="font-display text-lg font-bold">1.2ms</span>
                      </div>
                  </div>
                  <div className="text-right space-y-1">
                      <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Sovereign Clock</span>
                      <p className="font-mono text-xs">{new Date().toLocaleTimeString()}</p>
                  </div>
              </div>

              {/* Node Indicators on "Map" */}
              <div className="relative flex-1">
                 {/* Europe */}
                 <div className="absolute top-[30%] left-[45%] group cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-accent absolute" style={{ animation: 'neuralPulse 2s infinite' }} />
                    <div className="w-2 h-2 rounded-full bg-accent relative" />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/80 border border-accent/30 p-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <p className="text-[10px] font-bold text-accent uppercase">EU-CENTRAL-1</p>
                        <p className="text-[8px] text-white/50">Compliance: EU-GDPR</p>
                    </div>
                 </div>
                 {/* US */}
                 <div className="absolute top-[35%] left-[20%] group cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-emerald relative" />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/80 border border-emerald/30 p-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <p className="text-[10px] font-bold text-emerald uppercase">US-EAST-4</p>
                        <p className="text-[8px] text-white/50">Compliance: HIPAA/SEC</p>
                    </div>
                 </div>
                 {/* Tokyo */}
                 <div className="absolute top-[40%] right-[15%] group cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-magenta relative" />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/80 border border-magenta/30 p-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <p className="text-[10px] font-bold text-magenta uppercase">AS-TOKYO-2</p>
                        <p className="text-[8px] text-white/50">Compliance: APEC</p>
                    </div>
                 </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-md">
                 <AnimatePresence mode="wait">
                    {syncStatus ? (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-3">
                         <Zap className="text-accent animate-pulse" size={16} />
                         <span className="font-mono text-xs text-accent uppercase tracking-wider">{syncStatus}</span>
                      </motion.div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex gap-6">
                           <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                             <span className="font-mono text-[9px] text-white/40 uppercase">Sovereign Agent Node</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald" />
                             <span className="font-mono text-[9px] text-white/40 uppercase">Standard Cloud Node</span>
                           </div>
                        </div>
                        <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">Global Mesh V2.4-SOV</span>
                      </div>
                    )}
                 </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Node List Table */}
          <div className="glass-card overflow-hidden">
             <table className="w-full text-left font-mono text-[10px]">
                <thead className="bg-white/5 text-white/30 uppercase tracking-widest border-b border-white/10">
                   <tr>
                      <th className="px-6 py-3 font-bold">Node Identifier</th>
                      <th className="px-6 py-3 font-bold">Geographic Zone</th>
                      <th className="px-6 py-3 font-bold">Compliance Status</th>
                      <th className="px-6 py-3 font-bold text-right">Operational Mode</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {nodes.map(node => (
                      <tr key={node.id} className="hover:bg-white/5 transition-colors">
                         <td className="px-6 py-4 flex items-center gap-2">
                            <Server size={14} className="text-white/20" />
                            <span className="font-bold">{node.id}</span>
                         </td>
                         <td className="px-6 py-4 text-white/60">{node.region}</td>
                         <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px]">
                               {node.complianceLevel}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'sovereign' ? 'bg-accent' : node.status === 'syncing' ? 'bg-gold' : 'bg-emerald'} animate-pulse`} />
                               <span className="uppercase text-white/40">{node.status}</span>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
}
