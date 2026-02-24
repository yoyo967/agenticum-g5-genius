import { useState, useEffect } from 'react';
import { Settings, Key, Server, Cpu, Eye, EyeOff, Save, RefreshCw } from 'lucide-react';
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
    agentModel: 'gemini-2.0-pro',
    temperature: 70,
    topK: 40,
    tokenLimit: 8192,
    safetyThreshold: 'BLOCK_MEDIUM_AND_ABOVE',
    swarms: {
      sn00: true, sp01: true, cc06: true, da03: true, ra01: true, pm07: true, ve01: true
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
                <option value="gemini-2.0-pro">Gemini 2.0 Pro</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
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
              { key: 'sp01', name: 'sp01', role: 'Strategist', color: 'var(--color-gold)' },
              { key: 'cc06', name: 'cc06', role: 'Copywriter', color: 'var(--color-emerald)' },
              { key: 'da03', name: 'da03', role: 'Visual Architect', color: 'var(--color-magenta)' },
              { key: 'ra01', name: 'ra01', role: 'Auditor', color: 'var(--color-gold)' },
              { key: 'pm07', name: 'pm07', role: 'Pillar Master', color: 'var(--color-emerald)' },
              { key: 've01', name: 've01', role: 'Motion Director', color: '#FF6B00' },
            ].map(agent => (
              <div key={agent.key} className="flex items-center justify-between p-3 rounded-lg bg-white/2 border border-white/5 group hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`status-dot ${(settings.swarms as Record<string, boolean>)[agent.key] ? 'processing' : 'offline'}`} />
                  <div>
                    <span className="font-display text-xs uppercase" style={{ color: agent.color }}>{agent.name}</span>
                    <span className="font-mono text-[9px] text-white/25 block">{agent.role}</span>
                  </div>
                </div>
                <button onClick={() => setSettings(prev => ({
                  ...prev,
                  swarms: { ...prev.swarms, [agent.key]: !(prev.swarms as Record<string, boolean>)[agent.key] }
                }))}
                  className={`w-10 h-5 rounded-full transition-colors ${(settings.swarms as Record<string, boolean>)[agent.key] ? 'bg-emerald' : 'bg-white/10'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${(settings.swarms as Record<string, boolean>)[agent.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
