import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Scale, Clock } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { formatDate } from '../utils/formatDate';
import { ExportMenu } from './ui';
import { downloadJSON, downloadCSV, downloadPDF } from '../utils/export';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';

interface SenateCase {
  id: string;
  agentId?: string;
  agent: string;
  type: string;
  risk: string;
  title: string;
  payload: string;
  verdict: 'PENDING' | 'APPROVED' | 'REJECTED';
  aiVerdict?: string;
  aiScore?: number;
  runId?: string;
  campaignId?: string;
  reason?: string;
  timestamp?: string;
  reviewedAt?: string;
}

export function SecuritySenate() {
  const [cases, setCases] = useState<SenateCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<SenateCase | null>(null);
  const [filter, setFilter] = useState<'all' | 'PENDING' | 'APPROVED' | 'REJECTED'>('all');
  const [verdictReason, setVerdictReason] = useState('');
  const [castingVerdict, setCastingVerdict] = useState(false);
  const [verdictError, setVerdictError] = useState('');
  const [verdictToast, setVerdictToast] = useState('');

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'senate_queue'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: SenateCase[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          agentId: data.agentId || data.agent?.toLowerCase(),
          agent: data.agent,
          type: data.type,
          risk: data.risk,
          title: data.title,
          payload: data.payload,
          verdict: data.verdict,
          aiVerdict: data.aiVerdict,
          aiScore: data.aiScore,
          runId: data.runId,
          campaignId: data.campaignId,
          reason: data.reason,
          timestamp: data.timestamp?.toDate?.()?.toISOString() || data.timestamp,
          reviewedAt: data.reviewedAt?.toDate?.()?.toISOString() || data.reviewedAt,
        } as SenateCase);
      });
      setCases(list);
      setLoading(false);
    }, (error) => {
      console.warn('[Senate] Firestore observer error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const castVerdict = async (caseId: string, verdict: 'APPROVED' | 'REJECTED') => {
    setCastingVerdict(true);
    try {
      // 1. Update the docket entry
      await updateDoc(doc(db, 'senate_queue', caseId), {
        verdict,
        reason: verdictReason,
        reviewedAt: new Date()
      });
      
      // 2. Perform follow-up actions based on case type/metadata
      if (verdict === 'APPROVED' && selectedCase) {
        // Handle Blog articles
        const slugMatch = selectedCase.title.match(/Audit: (.*)\.\.\./) || selectedCase.title.match(/Article: (.*)/);
        const slug = slugMatch ? slugMatch[1].trim().toLowerCase().replace(/\s+/g, '-') : null;
        
        if (slug && (selectedCase.type.includes('CONTENT') || selectedCase.type.includes('PILLAR'))) {
          await fetch(`${API_BASE_URL}/blog/article/${slug}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'published' }),
          }).catch(err => console.error('[Senate] Publication failed:', err));
        }

        // Handle SWARM Campaign activation (if pending senate approval)
        if (selectedCase.campaignId && selectedCase.type === 'CAMPAIGN_SAFETY') {
          await fetch(`${API_BASE_URL}/campaigns/${selectedCase.campaignId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'ACTIVE' }),
          }).catch(err => console.error('[Senate] Campaign activation failed:', err));
        }
      }

      setSelectedCase(null);
      setVerdictReason('');
      setVerdictToast(`${verdict === 'APPROVED' ? '✓ Approved' : '✗ Rejected'} — verdict recorded in G5 Ledger.`);
      setTimeout(() => setVerdictToast(''), 4000);
    } catch (e) {
      console.warn('[Senate] Verdict cast failed:', e);
      setVerdictError('Senate update failed — please retry.');
      setTimeout(() => setVerdictError(''), 4000);
    } finally {
      setCastingVerdict(false);
    }
  };

  const filtered = cases.filter(c => filter === 'all' || c.verdict === filter);
  const pending = cases.filter(c => c.verdict === 'PENDING').length;
  const approved = cases.filter(c => c.verdict === 'APPROVED').length;
  const rejected = cases.filter(c => c.verdict === 'REJECTED').length;

  return (
    <>
    <div id="senate-export-container" className="h-full flex flex-col gap-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,215,0,0.1)' }}>
            <Shield size={20} className="text-gold" />
          </div>
          <div>
            <h2 className="font-display text-xl uppercase tracking-tight">Security Senate</h2>
            <p className="font-mono text-[10px] text-white/30">ra01 Autonomous Content & Brand Safety Tribunal</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Stats */}
          <div className="flex gap-3">
            <span className="badge badge-warning">{pending} Pending</span>
            <span className="badge badge-online">{approved} Approved</span>
            <span className="badge badge-error">{rejected} Rejected</span>
          </div>
          <ExportMenu options={[
            { label: 'JSON Docket', format: 'JSON', onClick: () => downloadJSON({ cases: filtered, stats: { pending, approved, rejected } }, 'G5_Senate_Docket') },
            { label: 'CSV Report', format: 'CSV', onClick: () => downloadCSV(filtered.map(c => ({ id: c.id, agent: c.agent, type: c.type, risk: c.risk, title: c.title, verdict: c.verdict, reason: c.reason || '', timestamp: c.timestamp || '' })), 'G5_Senate_Report') },
            { label: 'PDF Snapshot', format: 'PDF', onClick: () => downloadPDF('senate-export-container', 'G5_Senate_Snapshot') },
          ]} />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 shrink-0">
        {(['all', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-colors ${filter === f ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}>
            {f === 'all' ? `All (${cases.length})` : `${f} (${f === 'PENDING' ? pending : f === 'APPROVED' ? approved : rejected})`}
          </button>
        ))}
      </div>

      {/* Audit Analytics */}
      {cases.length > 0 && (
        <div className="flex gap-4 shrink-0">
          {/* Approval Rate */}
          <div className="glass-card px-4 py-3 flex items-center gap-3 flex-1">
            <div className="text-center">
              <div className="font-display text-xl font-bold" style={{ color: approved / Math.max(approved + rejected, 1) > 0.7 ? 'var(--color-emerald)' : 'var(--color-gold)' }}>
                {((approved / Math.max(approved + rejected, 1)) * 100).toFixed(0)}%
              </div>
              <div className="font-mono text-[8px] text-white/30 uppercase">Approval Rate</div>
            </div>
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${(approved / Math.max(cases.length, 1)) * 100}%`, background: 'var(--color-emerald)' }} />
            </div>
          </div>
          {/* Risk Distribution */}
          <div className="glass-card px-4 py-3 flex-1">
            <div className="font-mono text-[8px] text-white/30 uppercase mb-1">Risk Distribution</div>
            <div className="flex gap-1 h-3 rounded-full overflow-hidden">
              {['HIGH', 'MEDIUM', 'LOW'].map(risk => {
                const count = cases.filter(c => c.risk === risk).length;
                const pct = (count / cases.length) * 100;
                return pct > 0 ? (
                  <div key={risk} className="h-full rounded-sm transition-all" title={`${risk}: ${count}`}
                    style={{ width: `${pct}%`, background: risk === 'HIGH' ? 'var(--color-magenta)' : risk === 'MEDIUM' ? 'var(--color-gold)' : 'var(--color-emerald)' }} />
                ) : null;
              })}
            </div>
            <div className="flex justify-between mt-1">
              {['HIGH', 'MEDIUM', 'LOW'].map(risk => (
                <span key={risk} className="font-mono text-[8px] text-white/20">{risk}: {cases.filter(c => c.risk === risk).length}</span>
              ))}
            </div>
          </div>
          {/* Agent Breakdown */}
          <div className="glass-card px-4 py-3 flex-1">
            <div className="font-mono text-[8px] text-white/30 uppercase mb-1">By Agent</div>
            <div className="space-y-1">
              {Array.from(new Set(cases.map(c => c.agent))).slice(0, 4).map(agent => {
                const count = cases.filter(c => c.agent === agent).length;
                return (
                  <div key={agent} className="flex items-center gap-2">
                    <span className="font-mono text-[8px] text-white/40 w-10 shrink-0">{agent}</span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-accent/50" style={{ width: `${(count / cases.length) * 100}%` }} />
                    </div>
                    <span className="font-mono text-[8px] text-white/20 w-4 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 gap-5 min-h-0">
        {/* Left: Case List */}
        <div className="w-1/2 flex flex-col gap-3 overflow-y-auto">
          {loading ? (
            [...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 w-full" />)
          ) : filtered.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <Scale size={40} className="text-white/10 mb-3" />
              <p className="font-display text-sm uppercase text-white/20">
                {filter === 'all' ? 'No Cases in Docket' : `No ${filter} Cases`}
              </p>
              <p className="font-mono text-[10px] text-white/15 mt-1">Senate docket is clean. RA-01 standing by.</p>
            </div>
          ) : (
            filtered.map(c => (
              <motion.div key={c.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`card cursor-pointer group hover:border-white/20 ${selectedCase?.id === c.id ? 'border-accent/30' : ''}`}
                onClick={() => setSelectedCase(c)}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {c.verdict === 'PENDING' && <AlertTriangle size={14} className="text-gold" />}
                    {c.verdict === 'APPROVED' && <CheckCircle2 size={14} className="text-emerald" />}
                    {c.verdict === 'REJECTED' && <XCircle size={14} className="text-magenta" />}
                    <span className="font-mono text-[9px] uppercase text-white/40">{c.agent}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`badge ${c.verdict === 'PENDING' ? 'badge-warning' : c.verdict === 'APPROVED' ? 'badge-online' : 'badge-error'}`}>
                      {c.verdict}
                    </span>
                    {c.aiScore !== undefined && (
                      <span className="font-mono text-[8px] text-white/20">AI: {c.aiScore}%</span>
                    )}
                  </div>
                </div>
                <h4 className="font-display text-sm uppercase text-white group-hover:text-accent transition-colors mb-1">
                  {c.title || c.type}
                </h4>
                <div className="flex items-center justify-between mt-2">
                   <div className="flex items-center gap-2 text-white/20">
                     <span className="font-mono text-[9px]">{c.risk} risk</span>
                     {c.timestamp && <span className="font-mono text-[9px] flex items-center gap-1"><Clock size={8} />{formatDate(c.timestamp)}</span>}
                   </div>
                   {c.runId && (
                     <span className="font-mono text-[8px] text-accent/40 bg-accent/5 px-1.5 py-0.5 rounded border border-accent/10">
                       {c.runId}
                     </span>
                   )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Right: Case Detail + Verdict */}
        <div className="w-1/2 glass flex flex-col overflow-hidden">
          {selectedCase ? (
            <>
              <div className="p-4 border-b border-white/5 shrink-0 bg-white/2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={16} className="text-gold" />
                    <h3 className="font-display text-sm uppercase">{selectedCase.title || 'Case Review'}</h3>
                  </div>
                  {selectedCase.runId && (
                    <button 
                      onClick={() => navigator.clipboard.writeText(selectedCase.runId!)}
                      className="font-mono text-[8px] text-white/30 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded"
                    >
                      ID: {selectedCase.runId}
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <span className="badge badge-processing">{selectedCase.type}</span>
                  <span className={`badge ${selectedCase.risk === 'HIGH' ? 'badge-error' : 'badge-warning'}`}>{selectedCase.risk} risk</span>
                  <span className="font-mono text-[9px] text-white/25 ml-auto">{selectedCase.agentId?.toUpperCase() || selectedCase.agent}</span>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <h4 className="label mb-2">Payload Under Review</h4>
                <div className="p-4 rounded-lg bg-black/30 border border-white/5 font-mono text-xs text-white/60 whitespace-pre-wrap leading-relaxed mb-4">
                  {selectedCase.payload || 'No payload data available.'}
                </div>

                {selectedCase.reason && (
                  <div className="mb-4">
                    <h4 className="label mb-2">Previous Verdict Reason</h4>
                    <div className="p-3 rounded-lg bg-black/20 border border-white/5 font-mono text-xs text-white/40">
                      {selectedCase.reason}
                    </div>
                  </div>
                )}

                {/* GenIUS Intelligence Section */}
                {(selectedCase.aiScore !== undefined || selectedCase.aiVerdict) && (
                  <div className="mb-6 p-4 rounded-xl border border-accent/20 bg-accent/5 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <Scale size={48} />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-mono text-[10px] uppercase tracking-widest text-accent">GenIUS Intelligence Dashboard</h5>
                      {selectedCase.aiVerdict && (
                        <span className={`font-mono text-[9px] px-2 py-0.5 rounded border ${
                          selectedCase.aiVerdict === 'APPROVED' ? 'border-emerald-500/30 text-emerald-400' : 'border-red-500/30 text-red-400'
                        }`}>
                          AI VERDICT: {selectedCase.aiVerdict}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-6">
                      {selectedCase.aiScore !== undefined && (
                        <div className="text-center">
                          <div className="font-display text-4xl font-black text-white">
                            {selectedCase.aiScore}
                          </div>
                          <div className="font-mono text-[8px] uppercase tracking-tighter text-white/30">/ 100 Score</div>
                        </div>
                      )}
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[9px] text-white/40">Compliance Probability</span>
                          <span className="font-mono text-[9px] text-white">{selectedCase.aiScore}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent transition-all duration-1000" 
                            style={{ width: `${selectedCase.aiScore || 0}%`, boxShadow: '0 0 10px var(--color-accent)' }} 
                          />
                        </div>
                        <p className="font-mono text-[9px] text-white/20 italic mt-2">
                          "Autonomous Market Intelligence suggests {selectedCase.aiScore && selectedCase.aiScore > 70 ? 'High' : 'Mixed'} Quality alignment."
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {verdictError && (
                <div className="mx-4 mt-3 p-2 rounded bg-red-900/30 border border-red-700/30 text-red-400 font-mono text-[10px]">
                  ⚠ {verdictError}
                </div>
              )}
              {selectedCase.verdict === 'PENDING' && (
                <div className="p-4 border-t border-white/5 flex flex-col gap-3 shrink-0">
                  <div>
                    <label className="label">Verdict Reason (Optional)</label>
                    <input type="text" value={verdictReason} onChange={e => setVerdictReason(e.target.value)}
                      placeholder="e.g. Content meets brand guidelines" className="input" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => castVerdict(selectedCase.id, 'APPROVED')} disabled={castingVerdict}
                      className="btn flex-1" style={{ background: 'var(--color-emerald)', borderColor: 'var(--color-emerald)', color: 'var(--color-void)' }}>
                      <CheckCircle2 size={14} /> Approve
                    </button>
                    <button onClick={() => castVerdict(selectedCase.id, 'REJECTED')} disabled={castingVerdict}
                      className="btn btn-danger flex-1">
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <Scale size={48} className="text-white/5 mb-4" />
              <p className="font-display text-lg uppercase text-white/15">Select a Case</p>
              <p className="font-mono text-xs text-white/10 mt-1">Review and cast verdicts on pending content</p>
            </div>
          )}
        </div>
      </div>
    </div>
    {verdictToast && (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-xl font-mono text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 border bg-emerald-950 border-emerald-700 text-emerald-300"
      >
        {verdictToast}
      </motion.div>
    )}
    </>
  );
}
