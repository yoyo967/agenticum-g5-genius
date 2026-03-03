import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Eye, CheckCircle, XCircle, Clock, Zap, ExternalLink, 
  BarChart3, Globe, Mail, MessageSquare, Download, Share2, 
  Lock, Award, Layout, Smartphone, TrendingUp, Filter, Search,
  Check, Copy, Loader2
} from 'lucide-react';
import { API_BASE_URL } from '../config';

interface ApprovalDocket {
  id: string;
  clientId: string;
  assetId: string;
  assetType: 'article' | 'campaign' | 'strategy' | 'creative';
  status: 'draft' | 'pending_audit' | 'pending_client' | 'approved' | 'rejected';
  comments?: string;
  updatedAt: string;
  title: string;
  previewUrl?: string;
}

interface ClientMetric {
  label: string;
  value: string;
  change: number;
  icon: any;
  color: string;
}

export function ClientNexus() {
  const [clientId] = useState('AGENTICUM-CORP-G5');
  const [clientName] = useState('Global Alpha Logistics');
  const [clientLogo] = useState('https://img.logo.dev/logolog.com?token=pk_STm-yRnuS0GqN-fVfKz1Fg');
  const [dockets, setDockets] = useState<ApprovalDocket[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [activeTab, setActiveTab] = useState<'approvals' | 'reports' | 'audit'>('approvals');
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // ── Mock Metrics for Demo ────────────────────────────────────────────────
  const metrics: ClientMetric[] = [
    { label: 'Neural ROI', value: '4.2x', change: +12, icon: TrendingUp, color: 'text-emerald' },
    { label: 'Market Reach', value: '1.2M', change: +24, icon: Globe, color: 'text-cyan' },
    { label: 'Conversion', value: '8.4%', change: -2, icon: Zap, color: 'text-gold' },
    { label: 'Compliance', value: '99.9%', change: 0, icon: Shield, color: 'text-purple' },
  ];

  // ── Fetch Dockets ───────────────────────────────────────────────────────
  const fetchDockets = useCallback(async () => {
    try {
      // In production, this would be a real API call. For demo, we enrich with titles.
      const res = await fetch(`${API_BASE_URL}/clients/dockets/${clientId}`);
      if (res.ok) {
        const data = await res.json();
        const enriched = data.map((d: any) => ({
          ...d,
          title: d.title || (d.assetType === 'article' ? 'Brand Expansion Strategy' : 'Q1 Performance Ad-set'),
          previewUrl: d.previewUrl || '#'
        }));
        setDockets(enriched);
      } else {
        // Fallback for demo if backend is offline
        setDockets([
          { id: 'DOC-901', clientId, assetId: 'CS-01', assetType: 'article', status: 'pending_client', title: 'LinkedIn Thought Leadership Pillar', updatedAt: new Date().toISOString() },
          { id: 'DOC-902', clientId, assetId: 'DA-03', assetType: 'creative', status: 'pending_client', title: 'Autumn Campaign Hero Visuals', updatedAt: new Date().toISOString() },
          { id: 'DOC-903', clientId, assetId: 'RA-01', assetType: 'strategy', status: 'approved', title: 'Global Compliance Framework v2', updatedAt: new Date().toISOString() },
        ]);
      }
    } catch {
      // Fallback for local demo
      setDockets([
        { id: 'DOC-901', clientId, assetId: 'CS-01', assetType: 'article', status: 'pending_client', title: 'LinkedIn Thought Leadership Pillar', updatedAt: new Date().toISOString() },
        { id: 'DOC-902', clientId, assetId: 'DA-03', assetType: 'creative', status: 'pending_client', title: 'Autumn Campaign Hero Visuals', updatedAt: new Date().toISOString() },
      ]);
    }
  }, [clientId]);

  useEffect(() => {
    fetchDockets();
    const interval = setInterval(fetchDockets, 10000);
    return () => clearInterval(interval);
  }, [fetchDockets]);

  const handleAction = async (docketId: string, status: 'approved' | 'rejected', comment: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/clients/dockets/${docketId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, comment })
      });
      if (res.ok) fetchDockets();
    } catch {
      // Simulated action for demo
      setDockets(prev => prev.map(d => d.id === docketId ? { ...d, status } : d));
    }
  };

  const filteredDockets = dockets.filter(d => {
    if (filter === 'all') return true;
    if (filter === 'pending') return d.status === 'pending_client' || d.status === 'pending_audit';
    return d.status === 'approved' || d.status === 'rejected';
  });

  const handleShare = () => {
    const link = `${window.location.origin}/nexus/${clientId}?access=guest`;
    setShareLink(link);
  };

  const copyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col overflow-hidden bg-midnight">
      {/* ── White-Label Header ────────────────────────────────────────────── */}
      <div className="shrink-0 p-6 border-b border-white/5 bg-obsidian/40 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center p-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-white/10">
              <img src={clientLogo} alt="Client Logo" className="w-full h-full object-contain filter grayscale" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald flex items-center justify-center border-2 border-midnight shadow-lg">
              <Shield size={12} className="text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-bold text-white uppercase tracking-tight">{clientName}</h1>
              <span className="px-2 py-0.5 rounded bg-emerald/10 border border-emerald/20 text-[9px] font-mono text-emerald font-bold uppercase tracking-widest">Enterprise</span>
            </div>
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-1">G5 Client Nexus · Secured Channel: {clientId}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-mono text-[10px] text-white uppercase tracking-widest transition-all">
            <Share2 size={14} /> Share Portal
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl font-mono text-[10px] text-white uppercase tracking-widest transition-all font-bold shadow-lg shadow-purple-900/40">
            <ExternalLink size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* ── Internal Navigation ───────────────────────────────────────────── */}
      <div className="shrink-0 px-6 pt-4 flex gap-8 border-b border-white/5">
        {[
          { id: 'approvals', label: 'Approval Pipeline', icon: Lock },
          { id: 'reports', label: 'Intelligence Reports', icon: BarChart3 },
          { id: 'audit', label: 'Perfect Twin Audit', icon: Award },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 pb-4 font-mono text-[11px] uppercase tracking-widest transition-all relative ${
              activeTab === tab.id ? 'text-white border-b-2 border-purple-500' : 'text-zinc-500 hover:text-zinc-300'
            }`}>
            <tab.icon size={14} className={activeTab === tab.id ? 'text-purple-400' : ''} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Main Content Area ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
        <div className="grid grid-cols-12 gap-6">
          
          {/* ── Left Column: Metrics & Summary ────────────────────────────── */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((m, i) => (
                <div key={i} className="p-4 rounded-2xl bg-obsidian/40 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <m.icon size={16} className={`${m.color} opacity-60`} />
                    <span className={`font-mono text-[9px] ${m.change >= 0 ? 'text-emerald' : 'text-rose-500'}`}>
                      {m.change > 0 ? '+' : ''}{m.change}%
                    </span>
                  </div>
                  <p className="font-mono text-xl font-bold text-white tracking-tighter">{m.value}</p>
                  <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mt-1">{m.label}</p>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-midnight border border-purple-500/20 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl -z-10" />
              <h3 className="font-mono text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                < Award size={14} /> G5 Verified Compliance
              </h3>
              <div className="flex items-start gap-4">
                 <div className="w-16 h-16 rounded-full border-4 border-emerald/20 border-t-emerald flex items-center justify-center relative">
                   <span className="font-mono text-lg font-bold text-white">99</span>
                   <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald flex items-center justify-center border-2 border-midnight">
                     <Check size={10} className="text-white" />
                   </span>
                 </div>
                 <div className="flex-1">
                   <p className="font-mono text-[11px] text-white/80 leading-relaxed italic">
                     "The neural footprint of all content generated matches the specified brand identity with 99.4% congruence."
                   </p>
                   <p className="font-mono text-[9px] text-zinc-600 uppercase mt-2 tracking-widest">— RA-01 Compliance Agent</p>
                 </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-obsidian/40 border border-white/5">
               <h3 className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Channel Performance</h3>
               <div className="space-y-4">
                 {[
                   { label: 'LinkedIn', val: 78, color: 'bg-cyan-500' },
                   { label: 'Google Search', val: 45, color: 'bg-purple-500' },
                   { label: 'Direct Traffic', val: 22, color: 'bg-emerald-500' },
                 ].map((c, i) => (
                   <div key={i}>
                     <div className="flex justify-between font-mono text-[9px] text-zinc-500 mb-1.5 uppercase">
                       <span>{c.label}</span>
                       <span>{c.val}%</span>
                     </div>
                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${c.val}%` }} className={`h-full ${c.color} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* ── Right Column: Tabbed Content ──────────────────────────────── */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {activeTab === 'approvals' && (
              <>
                <div className="flex items-center justify-between mb-4">
                   <h3 className="font-mono text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                     <Clock size={14} className="text-purple-400" /> Pending Review <span className="text-zinc-600">({filteredDockets.length})</span>
                   </h3>
                   <div className="flex border border-white/5 rounded-lg overflow-hidden bg-obsidian">
                     {['all', 'pending', 'completed'].map(f => (
                       <button key={f} onClick={() => setFilter(f as any)} 
                         className={`px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest transition-all ${filter === f ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
                         {f}
                       </button>
                     ))}
                   </div>
                </div>

                <AnimatePresence mode="popLayout">
                  {filteredDockets.map(d => (
                    <motion.div key={d.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="p-5 rounded-2xl bg-obsidian/60 border border-white/5 hover:border-white/20 transition-all mb-4 group ring-1 ring-transparent hover:ring-purple-500/20">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                            d.assetType === 'article' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' :
                            d.assetType === 'creative' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                            'bg-gold/10 border-gold/20 text-gold shadow-[0_0_15px_rgba(255,191,0,0.1)]'
                          }`}>
                            {d.assetType === 'article' ? <FileText size={20} /> : 
                             d.assetType === 'creative' ? <Layout size={20} /> : <Zap size={20} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-display text-base font-bold text-white tracking-tight">{d.title}</h4>
                              <span className="badge badge-online text-[8px] uppercase">{d.assetType}</span>
                            </div>
                            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Ref: {d.id} · Updated: {new Date(d.updatedAt).toLocaleTimeString()}</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-lg border font-mono text-[9px] uppercase tracking-[0.2em] font-bold ${
                          d.status === 'approved' ? 'bg-emerald/10 border-emerald/20 text-emerald' : 
                          d.status === 'rejected' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 
                          'bg-purple-500/10 border-purple-500/20 text-purple-400 animate-pulse'
                        }`}>
                          {d.status.replace('_', ' ')}
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-6">
                         {[
                           { label: 'Neural Score', val: '98/100', icon: Zap },
                           { label: 'SEO Density', val: '2.4%', icon: TrendingUp },
                           { label: 'Brand Voice', val: 'Match', icon: Award },
                           { label: 'Safe-Space', val: 'Safe', icon: Shield },
                         ].map((s, i) => (
                           <div key={i} className="px-3 py-2 rounded-xl bg-white/5 border border-white/5">
                             <p className="text-[8px] font-mono text-zinc-600 uppercase mb-1 flex items-center gap-1"><s.icon size={8} /> {s.label}</p>
                             <p className="text-[10px] font-mono font-bold text-white/80">{s.val}</p>
                           </div>
                         ))}
                      </div>

                      {d.status === 'pending_client' && (
                        <div className="flex gap-3">
                           <button onClick={() => handleAction(d.id, 'approved', 'Approved by Client via G5 Nexus.')}
                             className="flex-1 py-3 bg-emerald hover:bg-emerald-400 text-black font-mono text-[10px] font-bold uppercase tracking-[0.25em] rounded-xl shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2">
                             <CheckCircle size={14} /> Approve for Distribution
                           </button>
                           <button onClick={() => handleAction(d.id, 'rejected', 'Revisions requested.')}
                             className="px-6 py-3 bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-white/40 hover:text-rose-400 font-mono text-[10px] uppercase tracking-widest rounded-xl transition-all">
                             <XCircle size={14} /> Reject
                           </button>
                           <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-zinc-500 hover:text-white transition-all">
                             <Eye size={16} />
                           </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </>
            )}

            {activeTab === 'reports' && (
              <div className="h-[400px] flex flex-col items-center justify-center text-center p-12 bg-obsidian/40 border border-dashed border-white/5 rounded-3xl">
                <BarChart3 size={48} className="text-zinc-800 mb-6" />
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-widest mb-2">Neural Report Engine</h3>
                <p className="font-mono text-[11px] text-zinc-600 max-w-sm">Generating real-time intelligence feeds for {clientName}. This module connects to Google Analytics and LinkedIn Insight Tag.</p>
                <div className="mt-8 flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce delay-75" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-150" />
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-4">
                 <div className="p-8 bg-zinc-950 border border-emerald-500/20 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-4 right-4 text-emerald font-mono text-[10px] flex items-center gap-2">
                       <Shield size={12} /> ENCRYPTED LOG
                    </div>
                    <h3 className="font-display text-xl font-bold text-white mb-6 uppercase tracking-tight">Perfect Twin Verification</h3>
                    <div className="space-y-3">
                       {[
                         { msg: 'Agent SP-01: Market Scan synchronized', time: '10:42:01' },
                         { msg: 'Agent CC-06: Content Integrity Hash generated', time: '10:39:44' },
                         { msg: 'Agent RA-01: Compliance Proof stored in G5 Ledger', time: '10:35:12' },
                         { msg: 'System: Neural Congruence check PASSED', time: '10:30:00' },
                       ].map((l, i) => (
                         <div key={i} className="flex items-center gap-4 py-2 border-b border-white/5 font-mono text-[10px]">
                            <span className="text-zinc-600">[{l.time}]</span>
                            <span className="text-emerald/80">{l.msg}</span>
                            <CheckCircle size={10} className="text-emerald ml-auto" />
                         </div>
                       ))}
                    </div>
                    <div className="mt-8 p-4 bg-emerald/5 border border-emerald/20 rounded-xl flex items-center gap-4">
                       <Award size={24} className="text-emerald" />
                       <div>
                         <p className="text-[10px] font-mono text-white/60 font-bold uppercase tracking-widest">G5-CERTIFIED IMMUTABLE AUDIT</p>
                         <p className="text-[9px] font-mono text-zinc-600 uppercase">Fingerprint: 8af7...33e1</p>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Share Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {shareLink && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} 
              className="w-full max-w-md bg-obsidian border border-white/10 rounded-2xl p-8 shadow-2xl relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/30">
                     <Share2 className="text-purple-400" size={20} />
                   </div>
                   <div>
                     <h3 className="font-mono text-sm font-bold text-white uppercase tracking-widest">Share Client Portal</h3>
                     <p className="font-mono text-[10px] text-zinc-500">Dedicated Guest Access</p>
                   </div>
                </div>
                <button onClick={() => setShareLink(null)} className="text-zinc-500 hover:text-white p-2 transition-colors"><X size={18} /></button>
              </div>
              <div className="p-4 bg-midnight border border-white/5 rounded-xl mb-6">
                <div className="flex gap-2">
                  <input readOnly value={shareLink} className="flex-1 bg-transparent border-none font-mono text-[10px] text-zinc-500 focus:outline-none" />
                  <button onClick={copyLink} className="text-purple-400 hover:text-purple-300 transition-colors">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest text-center">This link provides RO access to the client dash.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function X(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
