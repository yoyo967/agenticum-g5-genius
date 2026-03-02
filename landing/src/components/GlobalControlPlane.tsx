import { useState, useEffect } from 'react';
import { Settings, Key, Server, Cpu, Eye, EyeOff, Save, RefreshCw, Palette, Bell, AlertTriangle, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

export function GlobalControlPlane() {
  const [showKeys, setShowKeys] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<'idle' | 'success' | 'error'>('idle');
  const [settings, setSettings] = useState({
    projectId: '',
    geminiKey: '',
    gcsBucket: '',
    localFallback: './data/vault/',
    localOverride: false,
    agentModel: 'gemini-3.1-pro',
    temperature: 70,
    topK: 40,
    tokenLimit: 8192,
    safetyThreshold: 'BLOCK_MEDIUM_AND_ABOVE',
    swarms: {
      sn00: true, so00: true, sp01: true, cc06: true, da03: true, ba07: true, ve01: true, ra01: true
    }
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        if (Object.keys(data).length > 0) setSettings(prev => ({ ...prev, ...data }));
      })
      .catch(() => {});
  }, []);

  const [saveError, setSaveError] = useState('');

  // Brand Identity
  const [brand, setBrand] = useState({
    name: 'AGENTICUM G5',
    tagline: 'The AI Marketing OS',
    primaryColor: '#00E5FF',
    font: 'Roboto Mono',
    logoUrl: '',
  });

  // Notification Preferences
  const [notifs, setNotifs] = useState({
    weeklyReport: true,
    anomalyAlerts: true,
    senateFailures: true,
    deployConfirms: false,
    reportCadence: 'weekly',
  });

  const toggleNotif = (key: keyof typeof notifs) =>
    setNotifs(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));

  const [dangerAction, setDangerAction] = useState<string | null>(null);


  const handleSave = async () => {
    setIsSaving(true);
    setSaveResult('idle');
    setSaveError('');
    try {
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSaveResult('success');
      } else {
        const errData = await res.json().catch(() => ({ error: `Server returned ${res.status}` }));
        setSaveResult('error');
        setSaveError(errData.error || `Save failed (${res.status})`);
      }
    } catch (err) {
      setSaveResult('error');
      setSaveError(err instanceof Error ? err.message : 'Network error — is the backend running?');
    } finally {
      setIsSaving(false);
      // Auto-reset result indicator after 3 seconds
      setTimeout(() => setSaveResult('idle'), 3000);
    }
  };

  const update = (key: string, value: unknown) => setSettings(prev => ({ ...prev, [key]: value }));

  return (
    <div className="h-full flex flex-col gap-5 overflow-y-auto pb-6">
      
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,229,255,0.08)' }}>
            <Settings size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="font-display text-xl uppercase tracking-tight">Configuration</h2>
            <p className="font-mono text-[10px] text-white/30">API Keys, Neural Parameters, and Swarm Control</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={isSaving}
            className={`btn-primary text-[10px] py-2 px-5 flex items-center gap-2 ${saveResult === 'success' ? 'bg-emerald! text-midnight!' : saveResult === 'error' ? 'bg-magenta! text-white!' : ''}`}>
            {isSaving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
            {isSaving ? 'Saving...' : saveResult === 'success' ? 'Saved ✓' : saveResult === 'error' ? 'Failed ✕' : 'Save Configuration'}
          </button>
          {saveError && saveResult === 'error' && (
            <p className="font-mono text-[10px] text-magenta mt-1">{saveError}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* API Security */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm uppercase tracking-wide flex items-center gap-2">
              <Key size={14} className="text-accent" /> API Configuration
            </h3>
            <button onClick={() => setShowKeys(!showKeys)} className="text-white/30 hover:text-white transition-colors">
              {showKeys ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="label">GCP Project ID</label>
              <input type="text" value={settings.projectId} onChange={e => update('projectId', e.target.value)}
                className="input" placeholder="your-project-id" />
            </div>
            <div>
              <label className="label">Gemini API Key</label>
              <input type={showKeys ? 'text' : 'password'} value={settings.geminiKey} onChange={e => update('geminiKey', e.target.value)}
                className="input" placeholder="AIzaSy..." />
            </div>
            <div>
              <label className="label">GCS Bucket</label>
              <input type="text" value={settings.gcsBucket} onChange={e => update('gcsBucket', e.target.value)}
                className="input" placeholder="g5-vault-bucket" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/2 border border-white/5">
              <span className="label">Local Vault Override</span>
              <button onClick={() => update('localOverride', !settings.localOverride)}
                className={`w-10 h-5 rounded-full transition-colors ${settings.localOverride ? 'bg-accent' : 'bg-white/10'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.localOverride ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Neural Hyperparameters */}
        <div className="card">
          <h3 className="font-display text-sm uppercase tracking-wide flex items-center gap-2 mb-4">
            <Cpu size={14} className="text-gold" /> Neural Parameters
          </h3>
          <div className="space-y-4">
            <div>
              <label className="label">Agent Model</label>
              <select value={settings.agentModel} onChange={e => update('agentModel', e.target.value)} className="select">
                <option value="gemini-3.1-pro">Gemini 3.1 Pro</option>
                <option value="gemini-3.1-flash">Gemini 3.1 Flash</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              </select>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="label">Temperature</label>
                <span className="font-mono text-xs text-accent">{(settings.temperature / 100).toFixed(2)}</span>
              </div>
              <input type="range" min={0} max={200} value={settings.temperature}
                onChange={e => update('temperature', parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-full appearance-none accent-gold" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="label">Top K</label>
                <span className="font-mono text-xs text-accent">{settings.topK}</span>
              </div>
              <input type="range" min={1} max={100} value={settings.topK}
                onChange={e => update('topK', parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-full appearance-none accent-accent" />
            </div>
            <div>
              <label className="label">Max Token Limit</label>
              <select value={settings.tokenLimit} onChange={e => update('tokenLimit', parseInt(e.target.value))} className="select">
                <option value={2048}>2,048</option>
                <option value={4096}>4,096</option>
                <option value={8192}>8,192</option>
                <option value={32768}>32,768</option>
              </select>
            </div>
            <div>
              <label className="label">Safety Threshold</label>
              <select value={settings.safetyThreshold} onChange={e => update('safetyThreshold', e.target.value)} className="select">
                <option value="BLOCK_NONE">Block None</option>
                <option value="BLOCK_LOW_AND_ABOVE">Block Low+</option>
                <option value="BLOCK_MEDIUM_AND_ABOVE">Block Medium+</option>
                <option value="BLOCK_HIGH">Block High Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Swarm Agent Control */}
        <div className="card">
          <h3 className="font-display text-sm uppercase tracking-wide flex items-center gap-2 mb-4">
            <Server size={14} className="text-emerald" /> Swarm Control
          </h3>
          <div className="space-y-3">
            {[
              { key: 'sn00', name: 'sn00', role: 'Orchestrator', color: 'var(--color-accent)' },
              { key: 'so00', name: 'so00', role: 'Pilot', color: 'var(--color-accent)' },
              { key: 'sp01', name: 'sp01', role: 'Strategist', color: 'var(--color-gold)' },
              { key: 'cc06', name: 'cc06', role: 'Copywriter', color: 'var(--color-emerald)' },
              { key: 'da03', name: 'da03', role: 'Visual Architect', color: 'var(--color-magenta)' },
              { key: 'ba07', name: 'ba07', role: 'Researcher', color: 'var(--color-emerald)' },
              { key: 've01', name: 've01', role: 'Motion Director', color: '#FF6B00' },
              { key: 'ra01', name: 'ra01', role: 'Auditor', color: 'var(--color-gold)' },
            ].map(agent => (
              <div key={agent.key} className="flex items-center justify-between p-2 rounded-lg bg-white/2 border border-white/5 group hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`status-dot ${(settings.swarms as Record<string, boolean>)[agent.key] ? 'processing' : 'offline'}`} />
                  <div>
                    <span className="font-display text-[10px] uppercase" style={{ color: agent.color }}>{agent.name}</span>
                    <span className="font-mono text-[8px] text-white/25 block">{agent.role}</span>
                  </div>
                </div>
                <button onClick={() => setSettings(prev => ({
                  ...prev,
                  swarms: { ...prev.swarms, [agent.key]: !(prev.swarms as Record<string, boolean>)[agent.key] }
                }))}
                  className={`w-8 h-4 rounded-full transition-colors ${(settings.swarms as Record<string, boolean>)[agent.key] ? 'bg-emerald' : 'bg-white/10'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform ${(settings.swarms as Record<string, boolean>)[agent.key] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Brand Identity ────────────────────────────────────────── */}
      <div className="card">
        <h3 className="font-display text-sm uppercase tracking-wide flex items-center gap-2 mb-5">
          <Palette size={14} className="text-magenta" /> Brand Identity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Brand Name</label>
            <input value={brand.name} onChange={e => setBrand(p => ({ ...p, name: e.target.value }))} className="input" placeholder="AGENTICUM G5" />
          </div>
          <div>
            <label className="label">Tagline</label>
            <input value={brand.tagline} onChange={e => setBrand(p => ({ ...p, tagline: e.target.value }))} className="input" placeholder="The AI Marketing OS" />
          </div>
          <div>
            <label className="label">Logo URL</label>
            <input value={brand.logoUrl} onChange={e => setBrand(p => ({ ...p, logoUrl: e.target.value }))} className="input" placeholder="https://..." />
          </div>
          <div>
            <label className="label">Primary Accent Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={brand.primaryColor} onChange={e => setBrand(p => ({ ...p, primaryColor: e.target.value }))}
                className="w-10 h-9 rounded border border-white/10 bg-transparent cursor-pointer" />
              <input value={brand.primaryColor} onChange={e => setBrand(p => ({ ...p, primaryColor: e.target.value }))}
                className="input flex-1" placeholder="#00E5FF" />
            </div>
          </div>
          <div>
            <label className="label">UI Font</label>
            <select value={brand.font} onChange={e => setBrand(p => ({ ...p, font: e.target.value }))} className="select">
              <option>Roboto Mono</option>
              <option>Inter</option>
              <option>Space Grotesk</option>
              <option>DM Mono</option>
              <option>JetBrains Mono</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="p-4 rounded-lg border border-white/10 bg-white/2 w-full">
              <p className="font-mono text-[10px] text-white/30 mb-1">Preview</p>
              <p className="font-bold uppercase tracking-widest text-sm" style={{ color: brand.primaryColor }}>{brand.name}</p>
              <p className="font-mono text-[10px] text-white/40">{brand.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Notification Preferences ──────────────────────────────── */}
      <div className="card">
        <h3 className="font-display text-sm uppercase tracking-wide flex items-center gap-2 mb-5">
          <Bell size={14} className="text-gold" /> Notification Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-3">
            {([
              { key: 'weeklyReport',   label: 'Weekly KPI Report',         desc: 'CSV + summary every Monday' },
              { key: 'anomalyAlerts',  label: 'Anomaly Alerts',            desc: 'Spike/drop detection push' },
              { key: 'senateFailures', label: 'Senate Gate Failures',      desc: 'Immediate alert on compliance block' },
              { key: 'deployConfirms', label: 'Deploy Confirmations',      desc: 'Firebase + Cloud Run success' },
            ] as { key: keyof typeof notifs; label: string; desc: string }[]).map(n => (
              <div key={n.key} className="flex items-center justify-between p-3 rounded-lg bg-white/2 border border-white/5 hover:border-white/10 transition-colors">
                <div>
                  <p className="font-display text-xs uppercase">{n.label}</p>
                  <p className="font-mono text-[9px] text-white/30 mt-0.5">{n.desc}</p>
                </div>
                <button onClick={() => toggleNotif(n.key)}
                  className={`w-9 h-5 rounded-full transition-colors ${notifs[n.key] ? 'bg-gold' : 'bg-white/10'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifs[n.key] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <div>
              <label className="label">Report Cadence</label>
              <select value={notifs.reportCadence} onChange={e => setNotifs(p => ({ ...p, reportCadence: e.target.value }))} className="select">
                <option value="daily">Daily (08:00 CET)</option>
                <option value="weekly">Weekly (Monday 08:00)</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="p-4 rounded-lg bg-gold/5 border border-gold/20">
              <p className="font-mono text-[10px] text-gold mb-2 uppercase tracking-widest">Next Report</p>
              <p className="font-mono text-xs text-white/70">Monday, Mar 09, 2026 · 08:00 CET</p>
              <p className="font-mono text-[10px] text-white/30 mt-1">KPI Hub CSV · Agent Matrix · Anomaly Log</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Danger Zone ─────────────────────────────────────────────── */}
      <div className="card" style={{ borderColor: 'rgba(255,0,0,0.15)' }}>
        <h3 className="font-display text-sm uppercase tracking-wide flex items-center gap-2 mb-4 text-red-400">
          <AlertTriangle size={14} /> Danger Zone
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: 'reset-config',     label: 'Reset Configuration',  desc: 'Restore all settings to defaults',         confirm: 'Are you sure? This resets all saved config.' },
            { id: 'purge-cache',      label: 'Purge Agent Cache',     desc: 'Clear all cached outputs and responses',  confirm: 'This will delete all cached agent outputs.' },
            { id: 'halt-swarm',       label: 'Emergency Swarm Halt',  desc: 'Stop all active agent tasks immediately', confirm: 'HALT ALL AGENTS? This stops all running tasks.' },
          ].map(action => (
            <div key={action.id} className="p-4 rounded-lg border border-red-900/30 bg-red-950/10">
              <p className="font-display text-xs uppercase text-red-300 mb-1">{action.label}</p>
              <p className="font-mono text-[10px] text-white/30 mb-3">{action.desc}</p>
              {dangerAction === action.id ? (
                <div className="flex gap-2">
                  <button onClick={() => setDangerAction(null)}
                    className="flex-1 py-1.5 border border-white/10 text-white/40 font-mono text-[10px] rounded hover:border-white/30 transition-colors">
                    Cancel
                  </button>
                  <button onClick={() => setDangerAction(null)}
                    className="flex-1 py-1.5 bg-red-700 hover:bg-red-600 text-white font-mono text-[10px] rounded transition-colors">
                    Confirm
                  </button>
                </div>
              ) : (
                <button onClick={() => setDangerAction(action.id)}
                  className="w-full py-1.5 border border-red-800 text-red-400 font-mono text-[10px] uppercase rounded hover:bg-red-900/20 transition-colors flex items-center justify-center gap-1.5">
                  <Trash2 size={10} /> {action.id === 'halt-swarm' ? 'HALT' : 'Execute'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
