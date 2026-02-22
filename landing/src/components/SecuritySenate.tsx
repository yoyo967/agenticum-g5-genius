import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Scale, RefreshCw, Clock } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { ExportMenu } from './ui';
import { downloadJSON, downloadCSV, downloadPDF } from '../utils/export';

interface SenateCase {
  id: string;
  agent: string;
  type: string;
  risk: string;
  title: string;
  payload: string;
  verdict: 'PENDING' | 'APPROVED' | 'REJECTED';
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

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/senate/docket`);
      if (res.ok) {
        const data = await res.json();
        setCases(data.cases || []);
      }
    } catch (e) {
      console.warn('[Senate] Backend unavailable:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();

    // Listen for real-time senate events
    const handleSenate = (e: Event) => {
      const customEvent = e as CustomEvent<{ cases?: SenateCase[] }>;
      if (customEvent.detail?.cases) setCases(customEvent.detail.cases);
    };
    window.addEventListener('senate-update', handleSenate);
    return () => window.removeEventListener('senate-update', handleSenate);
  }, []);

  const castVerdict = async (caseId: string, verdict: 'APPROVED' | 'REJECTED') => {
    setCastingVerdict(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/senate/verdict/${caseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verdict, reason: verdictReason }),
      });
      if (res.ok) {
        setCases(prev => prev.map(c => c.id === caseId ? { ...c, verdict, reason: verdictReason, reviewedAt: new Date().toISOString() } : c));
        setSelectedCase(null);
        setVerdictReason('');
      }
    } catch (e) {
      console.warn('[Senate] Verdict cast failed:', e);
    } finally {
      setCastingVerdict(false);
    }
  };

  const filtered = cases.filter(c => filter === 'all' || c.verdict === filter);
  const pending = cases.filter(c => c.verdict === 'PENDING').length;
  const approved = cases.filter(c => c.verdict === 'APPROVED').length;
  const rejected = cases.filter(c => c.verdict === 'REJECTED').length;

  return (
    <div id="senate-export-container" className="h-full flex flex-col gap-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,215,0,0.1)' }}>
            <Shield size={20} className="text-gold" />
          </div>
          <div>
            <h2 className="font-display text-xl uppercase tracking-tight">Security Senate</h2>
            <p className="font-mono text-[10px] text-white/30">RA-01 Autonomous Content & Brand Safety Tribunal</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Stats */}
          <div className="flex gap-3">
            <span className="badge badge-warning">{pending} Pending</span>
            <span className="badge badge-online">{approved} Approved</span>
            <span className="badge badge-error">{rejected} Rejected</span>
          </div>
          <button onClick={fetchCases} className="btn btn-ghost btn-sm">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          </button>
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
                  <span className={`badge ${c.verdict === 'PENDING' ? 'badge-warning' : c.verdict === 'APPROVED' ? 'badge-online' : 'badge-error'}`}>
                    {c.verdict}
                  </span>
                </div>
                <h4 className="font-display text-sm uppercase text-white group-hover:text-accent transition-colors mb-1">
                  {c.title || c.type}
                </h4>
                <div className="flex items-center gap-2 text-white/20">
                  <span className="font-mono text-[9px]">{c.risk} risk</span>
                  {c.timestamp && <span className="font-mono text-[9px] flex items-center gap-1"><Clock size={8} />{new Date(c.timestamp).toLocaleDateString('en-US')}</span>}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Right: Case Detail + Verdict */}
        <div className="w-1/2 glass flex flex-col overflow-hidden">
          {selectedCase ? (
            <>
              <div className="p-4 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert size={16} className="text-gold" />
                  <h3 className="font-display text-sm uppercase">{selectedCase.title || 'Case Review'}</h3>
                </div>
                <div className="flex gap-2">
                  <span className="badge badge-processing">{selectedCase.type}</span>
                  <span className="badge badge-warning">{selectedCase.risk} risk</span>
                  <span className="font-mono text-[9px] text-white/25">{selectedCase.agent}</span>
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

                {/* GenIUS Score Display */}
                {(() => {
                  const payload = selectedCase.payload || selectedCase.reason || '';
                  const scoreMatch = payload.match(/GENIUS SCORE:\s*(\d+)\s*\/\s*100/i) ||
                                     payload.match(/GenIUS Score:\s*(\d+)/i) ||
                                     payload.match(/"score":\s*(\d+)/);
                  if (!scoreMatch) return null;
                  const score = parseInt(scoreMatch[1]);
                  const color = score >= 71 ? 'var(--color-emerald)' : score >= 41 ? 'var(--color-gold)' : 'var(--color-magenta)';
                  const label = score >= 71 ? 'EXCELLENT' : score >= 41 ? 'NEEDS REVIEW' : 'CRITICAL';
                  return (
                    <div className="mb-4 p-4 rounded-lg border flex items-center gap-4" style={{ borderColor: color + '40', background: color + '10' }}>
                      <div className="text-center">
                        <div className="font-display text-3xl font-bold" style={{ color }}>{score}</div>
                        <div className="font-mono text-[8px] uppercase tracking-widest text-white/40">/ 100</div>
                      </div>
                      <div>
                        <div className="font-display text-sm uppercase tracking-tight" style={{ color }}>{label}</div>
                        <div className="font-mono text-[10px] text-white/30">GenIUS Predictive Score — RA-01 Assessment</div>
                      </div>
                    </div>
                  );
                })()}
              </div>

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
  );
}
