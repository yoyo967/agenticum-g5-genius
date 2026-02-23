import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, CheckCircle, XCircle, Clock, Zap, ExternalLink } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface ApprovalDocket {
  id: string;
  clientId: string;
  assetId: string;
  assetType: 'article' | 'campaign';
  status: 'draft' | 'pending_audit' | 'pending_client' | 'approved' | 'rejected';
  comments?: string;
  updatedAt: string;
}

export function ClientNexus() {
  const [clientId] = useState('default-client');
  const [dockets, setDockets] = useState<ApprovalDocket[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');

  const fetchDockets = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/clients/dockets/${clientId}`);
      if (res.ok) {
        setDockets(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch dockets', error);
    }
  }, [clientId]);

  useEffect(() => {
    fetchDockets();
    const interval = setInterval(fetchDockets, 10000);
    return () => clearInterval(interval);
  }, [fetchDockets]);

  const handleAction = async (docketId: string, status: 'approved' | 'rejected', comment: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/clients/dockets/${docketId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, comment })
      });
      if (res.ok) {
        fetchDockets();
      }
    } catch (error) {
      console.error('Action failed', error);
    }
  };

  const filteredDockets = dockets.filter(d => {
    if (filter === 'all') return true;
    if (filter === 'pending') return d.status === 'pending_client' || d.status === 'pending_audit';
    return d.status === 'approved' || d.status === 'rejected';
  });

  return (
    <div className="p-6 space-y-6 animate-in">
      {/* Client Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center border border-accent/30">
            <Shield className="text-accent" size={24} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Client Nexus</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="badge badge-online">Enterprise Portal</span>
              <span className="font-mono text-[10px] text-white/30 tracking-widest uppercase">ID: {clientId}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'completed'].map((f) => (
            <button key={f} onClick={() => setFilter(f as 'all' | 'pending' | 'completed')} 
              className={`px-4 py-2 rounded-lg font-display text-[10px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-accent text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statistics Summary */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-6 border-accent/20">
            <h3 className="font-display text-sm font-bold uppercase text-accent mb-4">Executive Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40">Pending Review</span>
                <span className="font-mono text-xl font-bold text-gold">{dockets.filter(d => d.status === 'pending_client').length}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/40">Total Assets Managed</span>
                <span className="font-mono font-bold text-white/60">{dockets.length}</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex gap-4">
                 <div className="flex-1 text-center">
                   <p className="text-[10px] uppercase text-white/20 mb-1">ROI Score</p>
                   <p className="text-lg font-mono font-bold text-emerald">4.2x</p>
                 </div>
                 <div className="flex-1 text-center">
                   <p className="text-[10px] uppercase text-white/20 mb-1">Compliance</p>
                   <p className="text-lg font-mono font-bold text-accent">99%</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
             <h3 className="font-display text-sm font-bold uppercase text-white/60 mb-4 flex items-center gap-2">
               <Zap size={14} className="text-gold" /> Brand Voice Match
             </h3>
             <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono mb-1">
                  <span>TONE CONGRUENCE</span>
                  <span className="text-emerald">PERFECT</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald" style={{ width: '92%' }} />
                </div>
             </div>
          </div>
        </div>

        {/* Action Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
            <Clock size={14} /> Approval Pipeline
          </h3>
          
          <AnimatePresence mode="popLayout">
            {filteredDockets.length > 0 ? filteredDockets.map((docket) => (
              <motion.div key={docket.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-5 border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                      {docket.assetType === 'article' ? <Eye className="text-emerald" size={18} /> : <Zap className="text-gold" size={18} />}
                    </div>
                    <div>
                      <p className="font-mono text-[9px] text-white/20 uppercase">{docket.assetType} ID: {docket.assetId}</p>
                      <h4 className="font-bold text-sm tracking-tight">{docket.assetType === 'article' ? 'Campaign Post' : 'PMax Strategy'} Update</h4>
                    </div>
                  </div>
                  <span className={`badge text-[10px] ${docket.status === 'approved' ? 'badge-online' : docket.status === 'rejected' ? 'badge-error' : 'badge-processing'}`}>
                    {docket.status.replace('_', ' ')}
                  </span>
                </div>

                {docket.status === 'pending_client' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleAction(docket.id, 'approved', 'Client approved via Nexus.')}
                      className="btn btn-primary btn-sm flex-1" style={{ background: 'var(--color-emerald)', borderColor: 'var(--color-emerald)' }}>
                      <CheckCircle size={14} className="mr-2" /> Approve
                    </button>
                    <button onClick={() => handleAction(docket.id, 'rejected', 'Client requested revisions.')}
                      className="btn btn-ghost btn-sm flex-1 border-white/10">
                      <XCircle size={14} className="mr-2" /> Reject
                    </button>
                    <button className="btn btn-ghost btn-sm p-2 border-white/10"><ExternalLink size={14} /></button>
                  </div>
                )}
              </motion.div>
            )) : (
              <div className="text-center py-20 border border-dashed border-white/5 rounded-2xl">
                <Eye size={40} className="text-white/5 mx-auto mb-4" />
                <p className="font-mono text-xs text-white/20">No pending actions in your queue.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
