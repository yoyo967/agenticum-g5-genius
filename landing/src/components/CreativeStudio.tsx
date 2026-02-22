import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, PenTool, Type, Image as ImageIcon, Download, RefreshCw, Maximize2, X, FileText, Video, Sparkles, Cpu } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CreativeAsset {
  id: string;
  type: 'image' | 'copy' | 'video';
  title: string;
  agent: string;
  timestamp: string;
  content: string; // URL for image, Markdown for copy
}

const mockAssets: CreativeAsset[] = [
  {
    id: '1',
    type: 'copy',
    title: 'LinkedIn Campaign: G5 Launch',
    agent: 'CC-06',
    timestamp: '10:42 AM',
    content: '# The Future is Autonomous\\n\\nAgenticum G5 is not just another tool. It is the first true **Agency OS**.\\n\\n- End-to-end workflows\\n- Contextual reasoning\\n- Unmatched latency'
  },
  {
    id: '2',
    type: 'image',
    title: 'Hero Neural Mesh Concept',
    agent: 'DA-03',
    timestamp: '10:44 AM',
    content: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '3',
    type: 'image',
    title: 'Cyberpunk Office Abstract',
    agent: 'DA-03',
    timestamp: '10:50 AM',
    content: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop'
  }
];

export function CreativeStudio() {
  const [activeTab, setActiveTab] = useState<'all' | 'copy' | 'image' | 'video'>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState<string>('');
  const [editingAsset, setEditingAsset] = useState<CreativeAsset | null>(null);
  const [generatingMedia, setGeneratingMedia] = useState<'image' | 'video' | null>(null);
  const [mediaPrompt, setMediaPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [remixingId, setRemixingId] = useState<string | null>(null);
  const [localAssets, setLocalAssets] = useState<CreativeAsset[]>(mockAssets);

  const filteredAssets = localAssets.filter(a => activeTab === 'all' || a.type === activeTab);

  const handleSaveAsset = (updatedAsset: CreativeAsset) => {
    setLocalAssets(prev => prev.map(a => a.id === updatedAsset.id ? updatedAsset : a));
    setEditingAsset(null);
  };

  const handleEditCopy = (asset: CreativeAsset) => {
    setEditingAsset(asset);
    setEditorContent(asset.content);
  };

  const handleDownloadImage = (url: string, title: string) => {
    // Robust hackathon payload download mock
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.jpg`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleRemix = (asset: CreativeAsset) => {
    setRemixingId(asset.id);
    setTimeout(() => {
      const newAsset: CreativeAsset = {
        id: `remix-${Date.now()}`,
        type: 'image',
        title: `${asset.title} (Remix)`,
        agent: 'DA-03',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop'
      };
      setLocalAssets(prev => [newAsset, ...prev]);
      setRemixingId(null);
    }, 2500);
  };

  const handleRewrite = () => {
    setEditorContent(prev => prev + '\n\n*Rewrite AI applied.* Analyzing neural constraints...\n');
    setTimeout(() => {
      setEditorContent(prev => prev.replace('*Rewrite AI applied.* Analyzing neural constraints...\n', '> **AI Rewrite:** This campaign is structurally enhanced to drive 300% ROI across enterprise boundaries. Proceed with immediate deployment.'));
    }, 1500);
  };

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
        const response = await fetch(`${baseUrl}/vault/list`);
        if (!response.ok) throw new Error('Vault Sync Failed');
        const data = await response.json();
        
        const vaultAssets: CreativeAsset[] = data.files.map((f: { name: string; url: string; timestamp: string }) => ({
          id: f.name,
          type: (f.name.match(/\.(mp4|webm)$/i) ? 'video' : f.name.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image' : 'copy') as 'video' | 'image' | 'copy',
          title: f.name,
          agent: 'DA-03',
          timestamp: f.timestamp,
          content: f.url
        }));

        setLocalAssets([...vaultAssets, ...mockAssets]);
      } catch (err) {
        console.error('Failed to sync Creative Vault', err);
      }
    };

    fetchAssets();
  }, []);

  const handleGenerateMedia = async () => {
    if (!mediaPrompt.trim()) return;
    setIsProcessing(true);
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
      const response = await fetch(`${baseUrl}/blog/agent-dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: mediaPrompt,
          type: generatingMedia === 'video' ? 'video' : 'cluster' // Use cluster for image generation path in dispatch
        })
      });

      if (!response.ok) throw new Error('Generation Dispatch Failed');
      
      // We don't wait for the file to be ready (it's async in backend)
      // but we inform the user to check back.
      setGeneratingMedia(null);
      setMediaPrompt('');
    } catch (err) {
      console.error('Failed to dispatch generation:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex gap-6">
      {/* Left: Gallery & Masonry */}
      <div className={`flex flex-col border border-white/5 rounded-2xl bg-black/20 glass overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] transition-all duration-500 ${editingAsset || generatingMedia ? 'w-1/2' : 'w-full'}`}>
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-black/40 shrink-0">
          <div>
             <h2 className="text-2xl font-display font-black uppercase italic tracking-tighter text-white flex items-center gap-2">
               <Palette size={24} className="text-neural-purple" />
               Creative Studio
             </h2>
             <p className="text-white/40 font-light text-xs mt-1">DA-03 & CC-06 Workspace</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex bg-white/5 rounded-lg p-1">
              <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')} icon={<PenTool size={14} />} label="All Assets" />
              <TabButton active={activeTab === 'copy'} onClick={() => setActiveTab('copy')} icon={<Type size={14} />} label="Copy" />
              <TabButton active={activeTab === 'image'} onClick={() => setActiveTab('image')} icon={<ImageIcon size={14} />} label="VFX" />
            </div>
            
            <div className="flex items-center gap-2">
               <button 
                 onClick={() => { setEditingAsset(null); setGeneratingMedia('image'); }}
                 className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${generatingMedia === 'image' ? 'bg-neural-purple text-white shadow-[0_0_15px_rgba(186,85,211,0.4)]' : 'bg-white/5 text-white/50 hover:bg-neural-purple/20 hover:text-neural-purple'}`}
               >
                 <Sparkles size={14} /> Imagen 3 Generate
               </button>
               <button 
                 onClick={() => { setEditingAsset(null); setGeneratingMedia('video'); }}
                 className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${generatingMedia === 'video' ? 'bg-blue-600/20 text-blue-400 border-blue-500/50 shadow-[inset_0_0_15px_rgba(59,130,246,0.3)]' : 'bg-transparent text-white/50 border-white/10 hover:border-blue-500/30 hover:text-blue-400'}`}
               >
                 <Video size={14} /> Veo Matrix
               </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto scrollbar-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            <AnimatePresence>
              {filteredAssets.map(asset => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={asset.id} 
                  className="rounded-xl overflow-hidden glass border border-white/10 group bg-black/40 flex flex-col h-64"
                >
                  {asset.type === 'image' || asset.type === 'video' ? (
                    <div className="flex-1 relative overflow-hidden bg-black/50">
                      {asset.type === 'video' ? (
                        <video src={asset.content} controls className="w-full h-full object-cover opacity-80" autoPlay loop muted />
                      ) : (
                        <img src={asset.content} alt={asset.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      )}
                      
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 pointer-events-none">
                         <div className="flex gap-2 pointer-events-auto">
                            <button onClick={() => setSelectedImage(asset.content)} className="p-2 rounded bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors">
                              <Maximize2 size={16} />
                            </button>
                            <button onClick={() => handleDownloadImage(asset.content, asset.title)} className="p-2 rounded bg-neural-blue/20 hover:bg-neural-blue/40 text-neural-blue backdrop-blur-md transition-colors">
                              <Download size={16} />
                            </button>
                         </div>
                         <button 
                           onClick={() => handleRemix(asset)}
                           className="p-2 rounded bg-neural-gold/20 hover:bg-neural-gold/40 text-neural-gold backdrop-blur-md transition-colors flex items-center gap-2 pointer-events-auto"
                         >
                            <RefreshCw size={14} className={remixingId === asset.id ? 'animate-spin' : ''} />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">
                              {remixingId === asset.id ? 'Remixing...' : 'Remix'}
                            </span>
                         </button>
                      </div>
                      
                      {remixingId === asset.id && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-opacity">
                           <div className="w-8 h-8 rounded-full border-2 border-neural-gold border-t-transparent animate-spin mb-3" />
                           <span className="text-[10px] uppercase font-black tracking-[0.2em] text-neural-gold animate-pulse">Running Diffusion...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 p-6 flex flex-col relative overflow-hidden bg-linear-to-br from-white/3 to-transparent">
                      <div className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-4 flex items-center gap-2">
                        <FileText size={14} /> Text Canvas
                      </div>
                      <p className="text-xs text-white/60 font-mono line-clamp-6 leading-relaxed flex-1">
                        {asset.content}
                      </p>
                      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-4">
                         <button onClick={() => handleEditCopy(asset)} className="px-4 py-2 rounded bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-neural-blue hover:text-white transition-colors">
                            Launch Editor
                         </button>
                      </div>
                    </div>
                  )}
                  <div className="p-3 border-t border-white/5 bg-black/60 flex items-center justify-between shrink-0">
                    <div>
                      <h4 className="text-xs font-bold text-white truncate max-w-[150px]">{asset.title}</h4>
                      <p className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5">{asset.agent} • {asset.timestamp}</p>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${asset.type === 'video' ? 'bg-blue-600/20 text-blue-400' : asset.type === 'image' ? 'bg-neural-purple/20 text-neural-purple' : 'bg-neural-blue/20 text-neural-blue'}`}>
                       {asset.type}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right: Copywriter Canvas (Drawer) */}
      <AnimatePresence>
        {editingAsset && (
          <motion.div 
            initial={{ opacity: 0, x: 50, width: 0 }}
            animate={{ opacity: 1, x: 0, width: '60%' }}
            exit={{ opacity: 0, x: 50, width: 0 }}
            className="flex flex-col border border-neural-blue/20 rounded-2xl bg-black/40 glass overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.1)] shrink-0"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-neural-blue/10 shrink-0">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-neural-blue flex items-center justify-center text-obsidian">
                   <PenTool size={16} />
                 </div>
                 <div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-neural-blue">{editingAsset.title}</h3>
                   <span className="text-[10px] uppercase font-mono text-neural-blue/50">Live Editing Mode</span>
                 </div>
              </div>
              <button onClick={() => setEditingAsset(null)} className="p-2 text-white/50 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 p-4 flex flex-col gap-4">
              <div className="flex gap-2">
                 <button className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-colors">Bold</button>
                 <button className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-colors">Italic</button>
                 <button className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-colors">H1</button>
                 <button className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-colors">H2</button>
                 <div className="flex-1" />
                 <button onClick={handleRewrite} className="px-3 py-1.5 rounded bg-neural-blue/20 text-neural-blue hover:bg-neural-blue hover:text-obsidian text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2">
                   <RefreshCw size={12} /> Rewrite AI
                 </button>
              </div>
              
              <div className="flex-1 flex gap-4 min-h-0">
                {/* Raw Editor Pane */}
                <textarea 
                  value={editorContent}
                  onChange={e => setEditorContent(e.target.value)}
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl p-6 text-sm text-white/80 font-mono leading-relaxed resize-none focus:outline-none focus:border-neural-blue/50 transition-colors"
                />
                
                {/* Live Markdown Preview Pane */}
                <div className="flex-1 bg-black/50 border border-white/10 rounded-xl p-6 overflow-y-auto scrollbar-none text-sm text-white/90 leading-relaxed font-body">
                  <style>{`
                    .markdown-preview h1 { font-size: 1.5em; font-weight: 900; margin-bottom: 0.5em; color: #fff; text-transform: uppercase; letter-spacing: -0.05em; }
                    .markdown-preview h2 { font-size: 1.25em; font-weight: 800; margin-bottom: 0.5em; color: #fff; text-transform: uppercase; }
                    .markdown-preview p { margin-bottom: 1.5em; color: rgba(255,255,255,0.7); }
                    .markdown-preview ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1.5em; color: rgba(255,255,255,0.7); }
                    .markdown-preview li { margin-bottom: 0.5em; }
                    .markdown-preview strong { font-weight: 900; color: #00e5ff; }
                    .markdown-preview blockquote { border-left: 2px solid #00e5ff; padding-left: 1rem; margin-left: 0; font-style: italic; color: #00e5ff; }
                  `}</style>
                  <div className="markdown-preview">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {editorContent}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 shrink-0">
                <button 
                  onClick={() => handleSaveAsset({ ...editingAsset, content: editorContent })}
                  className="px-6 py-2 rounded-lg bg-neural-blue text-obsidian hover:bg-white text-xs font-black uppercase tracking-widest transition-colors"
                >
                  Save Changes
                </button>
                <button className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest text-white transition-colors">
                  Export to PDF
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media Generation Canvas (Drawer) */}
      <AnimatePresence>
        {generatingMedia && (
          <motion.div 
            initial={{ opacity: 0, x: 50, width: 0 }}
            animate={{ opacity: 1, x: 0, width: '50%' }}
            exit={{ opacity: 0, x: 50, width: 0 }}
            className={`flex flex-col border rounded-2xl bg-black/40 glass overflow-hidden shadow-2xl shrink-0 ${generatingMedia === 'video' ? 'border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.1)]' : 'border-neural-purple/20 shadow-[0_0_50px_rgba(186,85,211,0.1)]'}`}
          >
            <div className={`p-4 border-b flex items-center justify-between shrink-0 ${generatingMedia === 'video' ? 'bg-blue-600/10 border-blue-500/10' : 'bg-neural-purple/10 border-neural-purple/10'}`}>
              <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${generatingMedia === 'video' ? 'bg-blue-600' : 'bg-neural-purple'}`}>
                   {generatingMedia === 'video' ? <Video size={16} /> : <ImageIcon size={16} />}
                 </div>
                 <div>
                   <h3 className={`text-sm font-black uppercase tracking-widest ${generatingMedia === 'video' ? 'text-blue-400' : 'text-neural-purple'}`}>
                     {generatingMedia === 'video' ? 'Veo Video Matrix' : 'Imagen 3 Core'}
                   </h3>
                   <span className={`text-[10px] uppercase font-mono ${generatingMedia === 'video' ? 'text-blue-400/50' : 'text-neural-purple/50'}`}>DA-03 Visual Generation Node</span>
                 </div>
              </div>
              <button onClick={() => setGeneratingMedia(null)} className="p-2 text-white/50 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 p-6 flex flex-col gap-6">
              
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 ml-1 flex items-center gap-2">
                  <Sparkles size={12} className={generatingMedia === 'video' ? 'text-blue-400' : 'text-neural-purple'} />
                  Media Directives
                </label>
                <textarea 
                  value={mediaPrompt}
                  onChange={e => setMediaPrompt(e.target.value)}
                  placeholder={generatingMedia === 'video' ? 
                    "Describe the video scene... (e.g. 'A cinematic, slow-motion shot of a cybernetic eye opening, neon reflections in the iris.')" : 
                    "Describe the image... (e.g. 'Photorealistic wide shot of an underground hacker den, volumetric lighting, unreal engine 5 style')"
                  }
                  className={`flex-1 bg-black/50 border rounded-xl p-6 text-sm text-white/80 font-mono leading-relaxed resize-none focus:outline-none transition-colors ${generatingMedia === 'video' ? 'border-white/10 focus:border-blue-500/50' : 'border-white/10 focus:border-neural-purple/50'}`}
                />
              </div>

              {/* Generator Configuration options can go here */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                   <span className="block text-[10px] uppercase font-black text-white/40 mb-2">Aspect Ratio</span>
                   <select className="w-full bg-transparent text-xs font-mono text-white/80 focus:outline-none">
                     <option>16:9 Cinematic</option>
                     <option>1:1 Square</option>
                     <option>9:16 Vertical</option>
                   </select>
                 </div>
                 <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                   <span className="block text-[10px] uppercase font-black text-white/40 mb-2">Style Preset</span>
                   <select className="w-full bg-transparent text-xs font-mono text-white/80 focus:outline-none">
                     <option>Photoreal 8K</option>
                     <option>Cyberpunk / Neon</option>
                     <option>3D Render (Unreal 5)</option>
                   </select>
                 </div>
              </div>
              
              <div className="shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isProcessing && (
                    <>
                      <Cpu size={14} className={`animate-pulse ${generatingMedia === 'video' ? 'text-blue-400' : 'text-neural-purple'}`} />
                      <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest animate-pulse">
                        Rendering via Vertex AI...
                      </span>
                    </>
                  )}
                </div>
                <button 
                  onClick={handleGenerateMedia}
                  disabled={isProcessing || !mediaPrompt.trim()}
                  className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 ${
                    isProcessing || !mediaPrompt.trim()
                      ? 'bg-white/10 text-white/30 cursor-not-allowed'
                      : generatingMedia === 'video' 
                        ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                        : 'bg-neural-purple text-white hover:bg-fuchsia-500 shadow-[0_0_20px_rgba(186,85,211,0.3)]'
                  }`}
                >
                  <Sparkles size={16} />
                  {isProcessing ? 'Generating...' : 'Dispatch to DA-03'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-12 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-8 right-8 text-white/50 hover:text-white"><X size={32} /></button>
            <img src={selectedImage} alt="Preview" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" onClick={e => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-colors ${active ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}>
      {icon} {label}
    </button>
  );
}
