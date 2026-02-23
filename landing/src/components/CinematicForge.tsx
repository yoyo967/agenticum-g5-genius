import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Film, Sparkles, Play, Music, RefreshCw, Layers, Download } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { ExportMenu } from './ui';
import { downloadJSON, downloadTextFile, downloadPDF } from '../utils/export';

interface StoryboardShot {
  shotNumber: number;
  visualPrompt: string;
  audioDescription: string;
  durationSec: number;
  mood: string;
  imageUrl?: string;
}

interface CinematicAsset {
  id: string;
  topic: string;
  storyboard: StoryboardShot[];
  status: 'planning' | 'rendering' | 'complete';
  createdAt: string;
}

export function CinematicForge() {
  const [topic, setTopic] = useState('');
  const [isForging, setIsForging] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<CinematicAsset | null>(null);
  const [assets, setAssets] = useState<CinematicAsset[]>([]);
  const [activeShot, setActiveShot] = useState(0);
  const [viewMode, setViewMode] = useState<'interactive' | 'print'>('interactive');

  const fetchAssets = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/blog/cinematic/default-client`);
      if (res.ok) setAssets(await res.json());
    } catch (e) {
      console.error('Failed to fetch cinematic assets', e);
    }
  };

  useEffect(() => { fetchAssets(); }, []);

  const handleForge = async () => {
    if (!topic.trim()) return;
    setIsForging(true);
    setCurrentAsset(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/blog/cinematic/forge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, clientId: 'default-client' })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentAsset(data);
        fetchAssets();
      }
    } catch (e) {
      console.error('Forge failed', e);
    } finally {
      setIsForging(false);
    }
  };

  const handleGenerateVisual = async (shotNumber: number) => {
    if (!currentAsset) return;
    setIsForging(true); // Reuse forging state for visual gen
    try {
      const res = await fetch(`${API_BASE_URL}/api/blog/cinematic/generate-visual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId: currentAsset.id, shotNumber })
      });
      if (res.ok) {
        const { imageUrl } = await res.json();
        // Update local state
        const updatedAsset = { ...currentAsset };
        const shotIndex = updatedAsset.storyboard.findIndex(s => s.shotNumber === shotNumber);
        if (shotIndex !== -1) {
          updatedAsset.storyboard[shotIndex].imageUrl = imageUrl;
          setCurrentAsset(updatedAsset);
          setAssets(prev => prev.map(a => a.id === updatedAsset.id ? updatedAsset : a));
        }
      }
    } catch (e) {
      console.error('Visual generation failed', e);
    } finally {
      setIsForging(false);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-magenta/20 rounded-xl flex items-center justify-center border border-magenta/30">
            <Film className="text-magenta" size={24} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Cinematic Forge</h2>
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Multi-Modal Advertisement Hub — Powered by Veo Simulation</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {currentAsset && (
            <ExportMenu options={[
              { label: 'JSON Manifest', format: 'JSON', onClick: () => downloadJSON(currentAsset, `G5_Storyboard_${currentAsset.id}`) },
              { label: 'Markdown Script', format: 'MD', onClick: () => downloadTextFile(currentAsset.storyboard.map(s => `## SHOT ${s.shotNumber}\n**Visual:** ${s.visualPrompt}\n**Audio:** ${s.audioDescription}\n**Mood:** ${s.mood}`).join('\n\n'), `G5_Script_${currentAsset.id}`, 'md') },
              { label: 'PDF Storyboard', format: 'PDF', onClick: () => downloadPDF('storyboard-container', `G5_Storyboard_${currentAsset.id}`) },
            ]} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Creation Workshop */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border-magenta/20">
            <h3 className="font-display text-sm font-bold uppercase text-magenta mb-4 flex items-center gap-2">
              <Sparkles size={14} /> Mission Briefing
            </h3>
            <div className="space-y-4">
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Describe the campaign theme (e.g., Luxury Cyberpunk Watch Launch)..."
                className="textarea h-32 text-xs"
              />
              <button
                onClick={handleForge}
                disabled={isForging || !topic.trim()}
                className="btn btn-primary w-full gap-2"
                style={{ background: 'var(--color-magenta)', borderColor: 'var(--color-magenta)' }}
              >
                {isForging ? <RefreshCw size={14} className="animate-spin" /> : <Layers size={14} />}
                {isForging ? 'Synthesizing Storyboard...' : 'Initiate Cinematic Forge'}
              </button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-display text-sm font-bold uppercase text-white/40 mb-4">Production History</h3>
            <div className="space-y-3">
              {assets.map(asset => (
                <div key={asset.id} onClick={() => setCurrentAsset(asset)}
                  className="p-3 bg-white/5 rounded-lg border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                  <p className="text-[10px] font-mono text-white/30 uppercase mb-1">{new Date(asset.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs font-bold truncate">{asset.topic}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Storyboard Viewer */}
        <div className="lg:col-span-2 space-y-6">
          {currentAsset ? (
            <div className="space-y-6">
              {/* View Control */}
              <div className="flex justify-between items-center no-print">
                <div className="flex bg-white/5 rounded-lg p-1 gap-1">
                  <button onClick={() => setViewMode('interactive')} 
                    className={`px-3 py-1.5 rounded-md font-mono text-[10px] uppercase transition-all ${viewMode === 'interactive' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}>
                    Interactive
                  </button>
                  <button onClick={() => setViewMode('print')} 
                    className={`px-3 py-1.5 rounded-md font-mono text-[10px] uppercase transition-all ${viewMode === 'print' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}>
                    Print Review
                  </button>
                </div>
                {viewMode === 'print' && (
                  <button onClick={() => downloadPDF('storyboard-container', `G5_Storyboard_${currentAsset.id}`)}
                    className="btn btn-primary btn-xs gap-2" style={{ background: 'var(--color-magenta)', borderColor: 'var(--color-magenta)' }}>
                    <Download size={10} /> Export PDF
                  </button>
                )}
              </div>

              {viewMode === 'interactive' ? (
                <div className="glass-card p-8 border-accent/20">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-display text-xl font-bold uppercase">{currentAsset.topic}</h3>
                      <p className="font-mono text-[10px] text-accent uppercase tracking-widest mt-1">Status: {currentAsset.status}</p>
                    </div>
                    <div className="flex gap-2">
                      {currentAsset.storyboard.map((_, i) => (
                        <button key={i} onClick={() => setActiveShot(i)}
                          className={`w-8 h-8 rounded-lg font-mono text-xs flex items-center justify-center border transition-all ${activeShot === i ? 'bg-accent text-black border-accent' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}>
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div key={activeShot} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="aspect-video bg-black/40 rounded-xl border border-white/10 flex flex-col items-center justify-center p-0 text-center relative overflow-hidden group/viz">
                           {currentAsset.storyboard[activeShot].imageUrl ? (
                             <img src={currentAsset.storyboard[activeShot].imageUrl} alt="Generated Asset" className="w-full h-full object-cover" />
                           ) : (
                             <div className="p-6">
                              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 border border-accent/20 mx-auto">
                                  <Video className="text-accent" size={32} />
                              </div>
                              <p className="font-mono text-[10px] text-white/40 uppercase mb-2">SHOT {currentAsset.storyboard[activeShot].shotNumber} — {currentAsset.storyboard[activeShot].durationSec}S</p>
                              <p className="text-sm italic text-white/80">"{currentAsset.storyboard[activeShot].visualPrompt}"</p>
                             </div>
                           )}
                           <div className={`absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/viz:opacity-100 transition-opacity ${currentAsset.storyboard[activeShot].imageUrl ? '' : 'hidden'}`}>
                              <button onClick={() => handleGenerateVisual(currentAsset.storyboard[activeShot].shotNumber)} className="btn btn-primary btn-sm gap-2">
                                 <RefreshCw size={12} /> Regenerate
                              </button>
                           </div>
                        </div>
                        <div className="p-4 bg-accent/5 rounded-xl border border-accent/10">
                           <div className="flex items-center gap-2 mb-2">
                             <Music size={14} className="text-accent" />
                             <span className="font-display text-[10px] font-bold uppercase tracking-wider text-accent">Audio / SFX</span>
                           </div>
                           <p className="text-xs leading-relaxed text-white/70">{currentAsset.storyboard[activeShot].audioDescription}</p>
                        </div>
                      </div>
                      <div className="space-y-6">
                         <div className="space-y-2">
                            <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Artistic Direction</span>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                               <p className="text-xs font-bold uppercase tracking-widest text-gold mb-1">Mood: {currentAsset.storyboard[activeShot].mood}</p>
                               <p className="text-[11px] text-white/50 leading-relaxed">Dynamic lens movements with cinematic high-contrast lighting.</p>
                            </div>
                         </div>
                         {!currentAsset.storyboard[activeShot].imageUrl && (
                           <button 
                             onClick={() => handleGenerateVisual(currentAsset.storyboard[activeShot].shotNumber)}
                             disabled={isForging}
                             className="btn btn-primary w-full gap-2 shadow-lg shadow-magenta/20" 
                             style={{ background: 'var(--color-magenta)', borderColor: 'var(--color-magenta)' }}
                           >
                             <Sparkles size={14} className={isForging ? 'animate-pulse' : ''} />
                             {isForging ? 'Synthesizing...' : 'Synthesize Visual Asset'}
                           </button>
                         )}
                         <div className="flex gap-3 pt-4">
                          <button className="btn btn-primary btn-sm flex-1 gap-2" style={{ background: 'var(--color-obsidian)', borderColor: 'var(--color-accent)' }}>
                            <Play size={12} /> Preview Animatic
                          </button>
                         </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : (
                <div id="storyboard-container" className="glass-card p-10 border-accent/20 bg-[#0a0118] min-h-[800px]">
                  <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-4">
                    <div>
                      <h3 className="font-display text-2xl font-bold uppercase text-accent">{currentAsset.topic}</h3>
                      <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mt-1">G5 CINEMATIC MASTERPLAN — ID: {currentAsset.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[10px] text-white/30 uppercase">Confidential Storyboard</p>
                      <p className="font-mono text-[10px] text-accent uppercase">{new Date(currentAsset.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-10">
                    {currentAsset.storyboard.map((shot) => (
                      <div key={shot.shotNumber} className="space-y-4 break-inside-avoid">
                        <div className="aspect-video bg-black/40 rounded-lg border border-white/10 overflow-hidden relative">
                           {shot.imageUrl ? (
                             <img src={shot.imageUrl} alt={`Shot ${shot.shotNumber}`} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center opacity-30">
                               <Video size={24} className="mb-2" />
                               <p className="font-mono text-[8px] uppercase">Awaiting Synthesis</p>
                             </div>
                           )}
                           <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded font-mono text-[10px] text-accent font-bold">
                              SHOT {shot.shotNumber}
                           </div>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Visual Composition</p>
                           <p className="text-[11px] text-white/70 leading-relaxed italic">"{shot.visualPrompt}"</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                           <p className="text-[8px] font-bold uppercase text-accent mb-1 flex items-center gap-1"><Music size={10} /> Audio / SFX</p>
                           <p className="text-[10px] text-white/50">{shot.audioDescription}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center glass-card border-dashed border-white/5 py-32 text-center">
              <Video size={48} className="text-white/5 mb-4" />
              <p className="font-display text-sm uppercase text-white/20">Director's Chair Empty</p>
              <p className="font-mono text-[10px] text-white/10 mt-1 max-w-xs">Define a campaign topic to forge a cinematic storyboard with the G5 Swarm.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
