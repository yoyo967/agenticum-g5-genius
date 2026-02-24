import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Type, Image as ImageIcon, Download, RefreshCw, X, Sparkles, Cpu, Upload, Film } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { ExportMenu } from './ui';
import { convertImageFormat } from '../utils/export';

interface CreativeAsset {
  id: string;
  type: 'image' | 'copy' | 'video';
  title: string;
  agent: string;
  timestamp: string;
  content: string;
}

type TabFilter = 'all' | 'copy' | 'image' | 'video' | 'cinematic';

export function CreativeStudio() {
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [assets, setAssets] = useState<CreativeAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<CreativeAsset | null>(null);

  // Generation
  const [generatingType, setGeneratingType] = useState<'image' | 'copy' | 'video' | null>(null);
  const [mediaPrompt, setMediaPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generationResult, setGenerationResult] = useState<string | null>(null);

  // Copy editor
  const [editorContent, setEditorContent] = useState('');
  const [editingAsset, setEditingAsset] = useState<CreativeAsset | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredAssets = assets.filter(a => activeTab === 'all' || a.type === activeTab);

  // Fetch assets from Vault
  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/vault/list`);
      if (res.ok) {
        const data = await res.json();
        const vaultAssets: CreativeAsset[] = (data.files || []).map((f: { name: string; url: string; timestamp?: string }) => ({
          id: f.name,
          type: f.name.match(/\.(mp4|webm)$/i) ? 'video' : f.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'image' : 'copy',
          title: f.name.replace(/[-_]/g, ' ').replace(/\.\w+$/, ''),
          agent: f.name.startsWith('da03') ? 'da03' : f.name.startsWith('cc06') ? 'cc06' : 'Vault',
          timestamp: f.timestamp || new Date().toISOString(),
          content: f.url.startsWith('http') ? f.url : `${API_BASE_URL.replace('/api/v1', '')}${f.url.startsWith('/') ? '' : '/'}${f.url}`,
        }));
        setAssets(vaultAssets);
      }
    } catch (e) {
      console.warn('[CreativeStudio] Vault unavailable:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssets(); }, []);

  // Listen for swarm status updates
  useEffect(() => {
    const handleSwarmStatus = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string; state: string; progress: number; lastStatus: string; payload?: Record<string, unknown> }>;
      const agentUpdate = customEvent.detail;
      if (!agentUpdate || !agentUpdate.id) return;

      if (agentUpdate.state === 'idle' && agentUpdate.lastStatus) {
        // If it's a new asset, add it to the list
        const isImage = agentUpdate.lastStatus.startsWith('data:image') || agentUpdate.lastStatus.match(/\.(jpg|jpeg|png|webp)$/i);
        const newAsset: CreativeAsset = {
          id: `gen-${Date.now()}`,
          type: isImage ? 'image' : 'copy',
          title: `AI Generated ${isImage ? 'Visual' : 'Copy'}`,
          agent: agentUpdate.id,
          timestamp: new Date().toISOString(),
          content: agentUpdate.lastStatus,
        };
        setAssets(prev => [newAsset, ...prev]);
        setGenerationResult(null);
        setIsProcessing(false);
      }
    };

    window.addEventListener('swarm-status', handleSwarmStatus);
    return () => window.removeEventListener('swarm-status', handleSwarmStatus);
  }, []);

  // Generate image/copy via DA-03/CC-06
  const handleGenerate = async () => {
    if (!mediaPrompt.trim()) return;
    setIsProcessing(true);
    setGenerationResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/blog/agent-dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: mediaPrompt,
          type: generatingType === 'image' ? 'image' : 'cluster',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setGenerationResult(data.message || 'Agent dispatched. Processing...');
        setMediaPrompt('');
      }
    } catch {
      setGenerationResult('Failed to dispatch. Is the backend running?');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSynthesizeVideo = async (topic: string) => {
    setIsProcessing(true);
    setGenerationResult('Initiating Veo-X Cinematic Production...');
    try {
      // Step 1: Forge Storyboard
      const forgeRes = await fetch(`${API_BASE_URL}/blog/cinematic/forge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      
      if (forgeRes.ok) {
        const asset = await forgeRes.json();
        // Step 2: Request Video Synthesis
        const synthRes = await fetch(`${API_BASE_URL}/blog/cinematic/synthesize-video`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assetId: asset.id })
        });
        
        if (synthRes.ok) {
          setGenerationResult('Video Synthesis Complete. Check the Vault.');
          setMediaPrompt('');
          fetchAssets();
        }
      }
    } catch {
      setGenerationResult('Cinematic production failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Upload files to Vault
  const handleUpload = async (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('files', f));
    try {
      const res = await fetch(`${API_BASE_URL}/vault/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        fetchAssets();
      }
    } catch {
      console.warn('[CreativeStudio] Upload failed');
    }
  };


  /* 
  const toggleSelect = (id: string, _e: React.MouseEvent) => {
    _e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  */

  const handleDownload = async (url: string, title: string, format: string = 'jpg') => {
    const safeName = title.replace(/\s+/g, '_');
    if (['png', 'webp'].includes(format)) {
      try {
        const mimeType = format === 'png' ? 'image/png' : 'image/webp';
        await convertImageFormat(url, mimeType as 'image/png' | 'image/jpeg' | 'image/webp', safeName);
        return;
      } catch { /* fall through to default */ }
    }
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}.${format}`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };



  return (
    <div className="h-full flex flex-col gap-5 overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.1)' }}>
            <Palette size={20} className="text-purple-400" />
          </div>
          <div>
            <h2 className="font-display text-xl uppercase tracking-tight">Creative Studio</h2>
            <p className="font-mono text-[10px] text-white/30">da03 Imagen 3 + cc06 Copy Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Tab Filters */}
          <div className="flex bg-white/5 rounded-lg p-1 gap-1">
            {(['all', 'image', 'copy', 'video'] as TabFilter[]).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md font-mono text-[10px] uppercase tracking-wider transition-colors ${activeTab === tab ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}>
                {tab === 'all' ? 'All' : tab === 'image' ? 'Images' : tab === 'video' ? 'Videos' : 'Copy'}
              </button>
            ))}
          </div>
          <button onClick={fetchAssets} className="btn btn-ghost btn-sm">
            <RefreshCw size={12} className={loading || isProcessing ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="btn btn-ghost btn-sm">
            <Upload size={12} /> Upload
          </button>
          <input ref={fileInputRef} type="file" multiple hidden onChange={e => e.target.files && handleUpload(e.target.files)} />
        </div>
      </div>

      <div className="flex flex-1 gap-5 min-h-0">
        
        {/* Left: Asset Gallery */}
        <div className={`flex flex-col gap-3 overflow-y-auto transition-all ${editingAsset || generatingType ? 'w-1/2' : 'w-full'}`}>
          
          {/* Generate buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setGeneratingType('image')} className="btn btn-ghost gap-2">
              <ImageIcon size={14} className="text-purple-400" /> Generate Image (Imagen 3)
            </button>
            <button onClick={() => setGeneratingType('copy')} className="btn btn-ghost gap-2">
              <Type size={14} className="text-emerald" /> Generate Copy (cc06)
            </button>
            <button onClick={() => setGeneratingType('video')} className="btn btn-ghost gap-2 border-magenta/20 col-span-2">
              <Film size={14} className="text-magenta" /> Create Cinematic Storyboard (Veo-X)
            </button>
          </div>

          {/* Asset Grid */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-40 w-full" />)}
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <Sparkles size={40} className="text-white/10 mb-3" />
              <p className="font-display text-sm uppercase text-white/20">No Assets</p>
              <p className="font-mono text-[10px] text-white/15 mt-1">Upload assets or generate with DA-03</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredAssets.map(asset => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card group cursor-pointer hover:border-purple-400/30 overflow-hidden"
                  onClick={() => {
                    if (asset.type === 'copy') {
                      setEditingAsset(asset);
                      setEditorContent(asset.content);
                    } else {
                      setSelectedAsset(asset);
                    }
                  }}
                >
                  {asset.type === 'image' ? (
                    <div className="relative aspect-4/3 -m-4 mb-3 overflow-hidden rounded-t-lg">
                      <img src={asset.content} alt={asset.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all" />
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        <ExportMenu label="" options={[
                          { label: 'JPG', format: 'JPG', onClick: () => handleDownload(asset.content, asset.title, 'jpg') },
                          { label: 'PNG', format: 'PNG', onClick: () => handleDownload(asset.content, asset.title, 'png') },
                        ]} />
                      </div>
                    </div>
                  ) : asset.type === 'video' ? (
                    <div className="relative aspect-4/3 -m-4 mb-3 overflow-hidden rounded-t-lg bg-black/40 flex flex-col items-center justify-center p-4">
                       <Film size={24} className="text-magenta mb-2" />
                       <p className="font-mono text-[8px] text-white/50 text-center uppercase">Cinematic Synthesis Complete</p>
                       <div className="absolute bottom-2 right-2">
                        <a href={asset.content} download className="btn btn-ghost btn-xs text-white/40 hover:text-white">
                          <Download size={10} />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-white/2 rounded-lg -m-1 mb-2 max-h-32 overflow-hidden">
                      <p className="font-mono text-[10px] text-white/50 leading-relaxed line-clamp-5">{asset.content}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="font-display text-xs uppercase truncate">{asset.title}</p>
                    <span className="font-mono text-[9px] text-white/20">{asset.agent}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side Panel (Editor / Generator / Preview) */}
        <AnimatePresence>
          {(editingAsset || generatingType || selectedAsset) && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-1/2 glass flex flex-col overflow-hidden"
            >
              {/* Generator */}
              {generatingType && (
                <>
                  <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                    <h3 className="font-display text-sm uppercase flex items-center gap-2">
                      {generatingType === 'image' ? <ImageIcon size={14} className="text-purple-400" /> : generatingType === 'video' ? <Film size={14} className="text-magenta" /> : <Type size={14} className="text-emerald" />}
                      {generatingType === 'image' ? 'Imagen 3 Generator' : generatingType === 'video' ? 'Veo-X Cinematic Production' : 'cc06 Copywriter'}
                    </h3>
                    <button onClick={() => { setGeneratingType(null); setGenerationResult(null); }} className="text-white/30 hover:text-white">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="p-4 flex flex-col gap-4">
                    <div>
                      <label className="label">
                        {generatingType === 'image' ? 'Visual Concept / Prompt' : 'Content Topic'}
                      </label>
                      <textarea value={mediaPrompt} onChange={e => setMediaPrompt(e.target.value)} className="textarea h-28"
                        placeholder={generatingType === 'image' 
                          ? 'e.g. Futuristic cyberpunk office with neural networks visualized as glowing blue pathways, dark atmosphere, high detail'
                          : generatingType === 'video'
                          ? 'e.g. A 30rd anniversary brand video for a leading AI agency, high energy, technical excellence'
                          : 'e.g. LinkedIn announcement post for the new AI orchestration platform launch'} />
                    </div>
                    <button onClick={() => generatingType === 'video' ? handleSynthesizeVideo(mediaPrompt) : handleGenerate()} disabled={isProcessing || !mediaPrompt.trim()}
                      className="btn btn-primary w-full" style={{ background: generatingType === 'image' ? 'var(--color-magenta)' : generatingType === 'video' ? 'var(--color-accent)' : 'var(--color-emerald)' }}>
                      <Cpu size={14} /> {isProcessing ? 'Agent Active...' : `Generate with ${generatingType === 'image' ? 'da03' : generatingType === 'video' ? 'Veo-X' : 'cc06'}`}
                    </button>
                    {generationResult && (
                      <div className="p-3 rounded-lg bg-black/30 border border-white/5 font-mono text-xs text-accent">
                        {generationResult}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Copy Editor */}
              {editingAsset && !generatingType && (
                <>
                  <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                    <h3 className="font-display text-sm uppercase">Edit: {editingAsset.title}</h3>
                    <button onClick={() => setEditingAsset(null)} className="text-white/30 hover:text-white">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex-1 p-4">
                    <textarea value={editorContent} onChange={e => setEditorContent(e.target.value)}
                      className="textarea w-full h-full font-mono text-sm" />
                  </div>
                  <div className="p-4 border-t border-white/5 flex justify-end gap-3">
                    <button onClick={() => setEditingAsset(null)} className="btn btn-ghost btn-sm">Cancel</button>
                    <button onClick={() => {
                      setAssets(prev => prev.map(a => a.id === editingAsset.id ? { ...a, content: editorContent } : a));
                      setEditingAsset(null);
                    }} className="btn btn-primary btn-sm">Save Changes</button>
                  </div>
                </>
              )}

              {/* Image Preview */}
              {selectedAsset && !generatingType && !editingAsset && (
                <>
                  <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                    <h3 className="font-display text-sm uppercase">{selectedAsset.title}</h3>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDownload(selectedAsset.content, selectedAsset.title)} className="btn btn-ghost btn-sm">
                        <Download size={12} /> Download
                      </button>
                      <button onClick={() => setSelectedAsset(null)} className="text-white/30 hover:text-white">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 p-4 flex items-center justify-center bg-black/20">
                    <img src={selectedAsset.content} alt={selectedAsset.title} className="max-w-full max-h-full rounded-lg border border-white/5" />
                  </div>
                  <div className="p-3 border-t border-white/5 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-white/20">Agent: {selectedAsset.agent} · {new Date(selectedAsset.timestamp).toLocaleDateString('en-US')}</span>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
