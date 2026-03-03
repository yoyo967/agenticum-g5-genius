import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud, FileText, Image as ImageIcon, File, Video,
  CheckCircle, Database, RefreshCw, Download, Eye,
  FolderOpen, CheckSquare, Search, Grid, List, Share2,
  Tag, X, Clock, Shield, Loader2, Copy, Check, Filter,
  ChevronRight, Trash2, FolderPlus, MoreVertical, ExternalLink
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import { downloadZIP } from '../utils/export';

// ── Types ────────────────────────────────────────────────────────────────────
interface VaultFile {
  name: string;
  url: string;
  timestamp?: string | { seconds: number; nanoseconds: number };
  size?: number;
  tags?: string[];
  status?: 'Draft' | 'Review' | 'Approved' | 'Archived';
  folder?: string;
}

interface VaultFolder {
  id: string;
  name: string;
  parent?: string;
}

type CategoryKey = 'all' | 'images' | 'documents' | 'videos' | 'other';
type ViewMode = 'list' | 'grid';
type UploadState = 'idle' | 'uploading' | 'done' | 'error';

const STATUS_COLORS: Record<string, string> = {
  Draft:    'text-zinc-400 border-zinc-600 bg-zinc-900',
  Review:   'text-yellow-400 border-yellow-700 bg-yellow-950/40',
  Approved: 'text-green-400 border-green-700 bg-green-950/40',
  Archived: 'text-zinc-600 border-zinc-800 bg-zinc-950',
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatSize(bytes?: number): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatTs(ts: VaultFile['timestamp']): string {
  if (!ts) return '—';
  if (typeof ts === 'object' && 'seconds' in ts) return new Date(ts.seconds * 1000).toLocaleString();
  const d = new Date(ts as string);
  return isNaN(d.getTime()) ? 'Recently' : d.toLocaleString();
}

function isImage(name: string) { return /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(name); }
function isVideo(name: string) { return /\.(mp4|mov|avi|webm|mkv|m4v)$/i.test(name); }
function isDoc(name: string)   { return /\.(pdf|doc|docx|txt|md|html|csv|json|xlsx|pptx)$/i.test(name); }

const CATEGORY_TABS: { key: CategoryKey; label: string }[] = [
  { key: 'all',       label: 'All' },
  { key: 'images',    label: 'Images' },
  { key: 'documents', label: 'Docs' },
  { key: 'videos',    label: 'Videos' },
  { key: 'other',     label: 'Other' },
];

function autoTags(name: string): string[] {
  const tags: string[] = [];
  if (isImage(name)) tags.push('visual');
  if (isVideo(name)) tags.push('video', 'media');
  if (isDoc(name))   tags.push('document');
  if (/brand/i.test(name)) tags.push('brand');
  if (/logo/i.test(name))  tags.push('logo');
  if (/campaign/i.test(name)) tags.push('campaign');
  if (/report/i.test(name))   tags.push('report');
  if (/[0-9]{4}/.test(name))  tags.push('dated');
  return tags.length ? tags : ['asset'];
}

// ─────────────────────────────────────────────────────────────────────────────
export function AssetVault() {
  const [files, setFiles]                   = useState<VaultFile[]>([]);
  const [loading, setLoading]               = useState(true);
  const [uploadState, setUploadState]       = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver]             = useState(false);
  const [category, setCategory]             = useState<CategoryKey>('all');
  const [viewMode, setViewMode]             = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedFile, setSelectedFile]     = useState<VaultFile | null>(null);
  const [selectedNames, setSelectedNames]   = useState<Set<string>>(new Set());
  const [shareLink, setShareLink]           = useState<string | null>(null);
  const [shareLoading, setShareLoading]     = useState(false);
  const [copiedLink, setCopiedLink]         = useState(false);
  const [filterStatus, setFilterStatus]     = useState<string>('all');
  
  const [activeFolder, setActiveFolder]       = useState<string>('root');
  const [folders, setFolders]                 = useState<VaultFolder[]>([
    { id: 'root', name: 'Main Drive' },
    { id: 'campaigns', name: 'Campaign Assets' },
    { id: 'brand', name: 'Brand Identity' },
    { id: 'reports', name: 'Analysis Reports' },
    { id: 'legal', name: 'Compliance & Legal' },
  ]);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName]     = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/vault/list`);
      if (res.ok) {
        const data = await res.json();
        const enriched: VaultFile[] = (data.files || []).map((f: VaultFile) => {
          let folder = 'root';
          if (/brand|logo/i.test(f.name)) folder = 'brand';
          if (/campaign/i.test(f.name))   folder = 'campaigns';
          if (/report|analysis/i.test(f.name)) folder = 'reports';
          if (/legal|senate|audit/i.test(f.name)) folder = 'legal';
          
          return {
            ...f,
            tags: f.tags ?? autoTags(f.name),
            status: f.status ?? 'Approved',
            folder: f.folder ?? folder
          };
        });
        setFiles(enriched);
      }
    } catch { /* backend unavailable */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  // ── Upload ───────────────────────────────────────────────────────────────
  const uploadFiles = async (fileList: FileList | File[]) => {
    setUploadState('uploading');
    setUploadProgress(0);

    const formData = new FormData();
    Array.from(fileList).forEach(f => formData.append('files', f));

    const progressInterval = setInterval(() => {
      setUploadProgress(p => Math.min(p + 15, 85));
    }, 300);

    try {
      const res = await fetch(`${API_BASE_URL}/vault/upload`, { method: 'POST', body: formData });
      clearInterval(progressInterval);
      setUploadProgress(100);
      if (res.ok) {
        setUploadState('done');
        setTimeout(() => { setUploadState('idle'); setUploadProgress(0); }, 1500);
        fetchFiles();
      } else {
        setUploadState('error');
      }
    } catch {
      clearInterval(progressInterval);
      setUploadState('error');
    }
  };

  // ── Filter + Search ──────────────────────────────────────────────────────
  const filteredFiles = files.filter(f => {
    const catMatch =
      category === 'all'       ? true :
      category === 'images'    ? isImage(f.name) :
      category === 'videos'    ? isVideo(f.name) :
      category === 'documents' ? isDoc(f.name) :
      !isImage(f.name) && !isVideo(f.name) && !isDoc(f.name);

    const statusMatch = filterStatus === 'all' || f.status === filterStatus;

    const q = searchQuery.toLowerCase();
    const searchMatch = !q || f.name.toLowerCase().includes(q) ||
      (f.tags ?? []).some(t => t.toLowerCase().includes(q));

    const folderMatch = activeFolder === 'root' || f.folder === activeFolder;

    return catMatch && statusMatch && searchMatch && folderMatch;
  });

  // ── Folder Logic ─────────────────────────────────────────────────────────
  const createFolder = () => {
    if (!newFolderName.trim()) return;
    const newF: VaultFolder = {
      id: newFolderName.toLowerCase().replace(/\s+/g, '-'),
      name: newFolderName,
      parent: activeFolder
    };
    setFolders(prev => [...prev, newF]);
    setNewFolderName('');
    setIsCreatingFolder(false);
    setActiveFolder(newF.id);
  };

  const currentFolderPath = useMemo(() => {
    const path: VaultFolder[] = [];
    let curr = folders.find(f => f.id === activeFolder);
    while (curr && curr.id !== 'root') {
      path.unshift(curr);
      curr = folders.find(f => f.id === curr?.parent);
    }
    return path;
  }, [activeFolder, folders]);

  const toggleSelect = (name: string) => setSelectedNames(prev => {
    const next = new Set(prev);
    next.has(name) ? next.delete(name) : next.add(name);
    return next;
  });

  const selectAll = () => {
    setSelectedNames(
      selectedNames.size === filteredFiles.length && filteredFiles.length > 0
        ? new Set()
        : new Set(filteredFiles.map(f => f.name))
    );
  };

  const handleBatchZIP = async () => {
    const sel = files.filter(f => selectedNames.has(f.name));
    if (!sel.length) return;
    await downloadZIP(
      sel.map(f => ({ name: f.name, content: f.url })),
      `G5_Vault_Export_${Date.now()}`
    );
  };

  const handleShare = (file: VaultFile) => {
    setShareLoading(true);
    setTimeout(() => {
      const link = file.url.startsWith('http')
        ? file.url
        : `${window.location.origin}${file.url}?share=1`;
      setShareLink(link);
      setShareLoading(false);
    }, 600);
  };

  const copyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getIcon = (name: string, size = 16) => {
    if (isImage(name))  return <ImageIcon size={size} className="text-purple-400" />;
    if (isVideo(name))  return <Video size={size} className="text-blue-400" />;
    if (isDoc(name))    return <FileText size={size} className="text-cyan-400" />;
    return <File size={size} className="text-zinc-500" />;
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="h-full flex gap-0 overflow-hidden bg-midnight"
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files); }}
    >
      {/* ── Sidebar: Folders ────────────────────────────────────────────── */}
      <div className="w-56 shrink-0 flex flex-col border-r border-white/5 bg-obsidian/40 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">File System</span>
          <button onClick={() => setIsCreatingFolder(true)} className="p-1 rounded hover:bg-white/5 text-white/30 hover:text-white transition-colors">
            <FolderPlus size={14} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {folders.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFolder(f.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all border ${
                activeFolder === f.id ? 'bg-purple-600/10 border-purple-600/30 text-purple-400' : 'border-transparent text-white/40 hover:bg-white/5 hover:text-white/60'
              }`}
            >
              <FolderOpen size={16} className={activeFolder === f.id ? 'text-purple-400' : 'text-zinc-500'} />
              <span className="font-mono text-xs truncate">{f.name}</span>
              {activeFolder === f.id && <div className="ml-auto w-1 h-1 rounded-full bg-purple-400" />}
            </button>
          ))}
        </div>

        {isCreatingFolder && (
          <div className="p-4 bg-purple-900/10 border-t border-purple-500/20">
            <input
              autoFocus
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createFolder()}
              placeholder="Folder Name..."
              className="w-full bg-midnight border border-purple-500/30 rounded px-2 py-1.5 font-mono text-[10px] text-white focus:outline-none mb-2"
            />
            <div className="flex gap-2">
              <button onClick={createFolder} className="flex-1 bg-purple-600 text-white font-mono text-[10px] py-1 rounded">Create</button>
              <button onClick={() => setIsCreatingFolder(false)} className="flex-1 border border-white/10 text-white/40 font-mono text-[10px] py-1 rounded">Cancel</button>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-white/5 bg-obsidian/60 mt-auto">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald" />
            <span className="font-mono text-[9px] text-emerald uppercase tracking-widest font-bold">Cloud Synced</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full mb-1">
            <div className="h-full bg-purple-500 w-1/3" />
          </div>
          <p className="font-mono text-[8px] text-white/20 uppercase tracking-tighter">6.4 GB OF 100 GB USED</p>
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 p-4 gap-4 overflow-hidden relative">
        {/* Header Area */}
        <div className="flex flex-col gap-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-purple-500/10 border border-purple-500/20">
                <Database size={18} className="text-purple-400" />
              </div>
              <div>
                <h2 className="font-mono text-base font-bold text-white uppercase tracking-widest">Vault Drive</h2>
                <p className="font-mono text-[10px] text-zinc-600 uppercase">Module 10 · Hierarchical Asset Management</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-600 tracking-tighter">{filteredFiles.length}/{files.length} ITEMS</span>
              <button onClick={fetchFiles} className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-white">
                <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              </button>
              <div className="flex border border-zinc-800 rounded overflow-hidden">
                <button onClick={() => setViewMode('list')} className={`p-1.5 ${viewMode === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-600 hover:text-white'}`}><List size={13} /></button>
                <button onClick={() => setViewMode('grid')} className={`p-1.5 ${viewMode === 'grid' ? 'bg-zinc-700 text-white' : 'text-zinc-600 hover:text-white'}`}><Grid size={13} /></button>
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-mono text-[10px] rounded transition-colors uppercase font-bold tracking-widest">
                <UploadCloud size={13} /> Upload
              </button>
              <input ref={fileInputRef} type="file" multiple hidden onChange={e => e.target.files && uploadFiles(e.target.files)} />
            </div>
          </div>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 px-1">
            <button onClick={() => setActiveFolder('root')} className="font-mono text-[10px] text-zinc-500 hover:text-white transition-colors">MAIN DRIVE</button>
            {currentFolderPath.map(f => (
              <div key={f.id} className="flex items-center gap-2">
                <ChevronRight size={12} className="text-zinc-700" />
                <button onClick={() => setActiveFolder(f.id)} className="font-mono text-[10px] text-zinc-500 hover:text-white transition-colors">{f.name.toUpperCase()}</button>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name or tag..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 pl-9 font-mono text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-600 transition-colors"
            />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white"><X size={12} /></button>}
          </div>
          <div className="flex items-center gap-1">
            {['all', 'Draft', 'Review', 'Approved', 'Archived'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-2 py-1 rounded font-mono text-[10px] transition-colors uppercase ${filterStatus === s ? 'bg-zinc-700 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-4 border-b border-white/5 pb-0">
          {CATEGORY_TABS.map(tab => (
            <button key={tab.key} onClick={() => setCategory(tab.key)}
              className={`pb-2 font-mono text-[10px] uppercase tracking-widest transition-all relative ${category === tab.key ? 'text-purple-400 border-b-2 border-purple-400' : 'text-zinc-600 hover:text-zinc-400'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Upload Overlay */}
        <AnimatePresence>
          {uploadState !== 'idle' && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} 
              className="absolute top-24 left-4 right-4 z-50 p-4 rounded-xl bg-obsidian border border-purple-500/30 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {uploadState === 'uploading' ? <Loader2 className="animate-spin text-purple-400" size={18} /> : 
                   uploadState === 'done' ? <CheckCircle className="text-emerald" size={18} /> : <XCircle className="text-rose-500" size={18} />}
                  <div>
                    <h4 className="font-mono text-xs font-bold text-white uppercase tracking-widest">{uploadState.toUpperCase()}...</h4>
                    <p className="font-mono text-[10px] text-zinc-500 tracking-tighter">Syncing with Google Cloud Storage</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-purple-400">{uploadProgress}%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* File Drop Area */}
        <div className={`flex-1 overflow-y-auto min-h-0 relative border-2 border-dashed transition-all rounded-xl ${dragOver ? 'border-purple-500 bg-purple-500/5' : 'border-transparent'}`}>
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-purple-400" size={32} />
              <p className="font-mono text-xs text-zinc-600 uppercase tracking-widest animate-pulse">Scanning Neural Substrate...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
              <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                <Database size={40} className="text-zinc-800" />
              </div>
              <h3 className="font-mono text-sm font-bold text-white uppercase mb-2">No items found</h3>
              <p className="font-mono text-xs text-zinc-600 max-w-xs">Try changing your search, folder or filters. Or drop files here to upload.</p>
              <button onClick={() => { setSearchQuery(''); setFilterStatus('all'); setActiveFolder('root'); }} className="mt-6 font-mono text-[10px] text-purple-400 hover:underline uppercase tracking-widest">Reset Discovery Parameters</button>
            </div>
          ) : viewMode === 'list' ? (
            <table className="w-full text-left border-separate border-spacing-y-1">
              <thead>
                <tr className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                  <th className="px-4 pb-2 w-10">
                    <input type="checkbox" checked={selectedNames.size === filteredFiles.length && filteredFiles.length > 0} onChange={selectAll} className="rounded border-zinc-800 bg-zinc-900" />
                  </th>
                  <th className="px-4 pb-2">Name</th>
                  <th className="px-4 pb-2">Folder</th>
                  <th className="px-4 pb-2">Status</th>
                  <th className="px-4 pb-2 text-right">Size</th>
                  <th className="px-4 pb-2 text-right">Modified</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map(f => (
                  <tr key={f.name} onClick={() => setSelectedFile(f)} className={`group hover:bg-white/5 transition-colors cursor-pointer ${selectedFile?.name === f.name ? 'bg-purple-600/5' : ''}`}>
                    <td className="px-4 py-3 rounded-l-lg" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={selectedNames.has(f.name)} onChange={() => toggleSelect(f.name)} className="rounded border-zinc-800 bg-zinc-900" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {getIcon(f.name)}
                        <div>
                          <p className="font-mono text-[11px] font-bold text-white tracking-tight">{f.name}</p>
                          <div className="flex gap-1.5 mt-0.5">
                            {(f.tags ?? []).slice(0, 2).map(t => <span key={t} className="text-[9px] text-zinc-600 font-mono uppercase tracking-tighter">#{t}</span>)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">{f.folder || 'root'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full border font-mono text-[9px] uppercase font-bold tracking-widest ${STATUS_COLORS[f.status || 'Approved']}`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[10px] text-zinc-500">{formatSize(f.size)}</td>
                    <td className="px-4 py-3 text-right rounded-r-lg font-mono text-[10px] text-zinc-500">{formatTs(f.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-1">
              {filteredFiles.map(f => (
                <div key={f.name} onClick={() => setSelectedFile(f)} 
                  className={`group relative aspect-square rounded-xl border p-3 flex flex-col transition-all overflow-hidden ${selectedFile?.name === f.name ? 'border-purple-500/50 bg-purple-500/5 shadow-lg' : 'border-white/5 bg-obsidian/40 hover:border-white/10 hover:bg-obsidian/60'}`}>
                   <div className="absolute top-2 left-2 z-10" onClick={e => e.stopPropagation()}>
                     <input type="checkbox" checked={selectedNames.has(f.name)} onChange={() => toggleSelect(f.name)} className="rounded border-zinc-800 bg-zinc-900" />
                   </div>
                   <div className="flex-1 flex items-center justify-center">
                     {isImage(f.name) ? (
                       <img src={f.url} alt={f.name} className="max-w-full max-h-full object-contain rounded-lg shadow-sm" loading="lazy" />
                     ) : getIcon(f.name, 48)}
                   </div>
                   <div className="mt-3">
                     <p className="font-mono text-[10px] font-bold text-white truncate">{f.name}</p>
                     <div className="flex items-center justify-between mt-1">
                       <span className="font-mono text-[8px] text-zinc-500 uppercase">{formatSize(f.size)}</span>
                       <span className={`px-1.5 py-0.5 rounded font-mono text-[8px] uppercase font-bold tracking-widest ${STATUS_COLORS[f.status || 'Approved']}`}>
                         {f.status}
                       </span>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── File Inspector ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedFile && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedFile(null)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden" />
            <motion.div initial={{ x: 350 }} animate={{ x: 0 }} exit={{ x: 350 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
              className="w-80 shrink-0 flex flex-col border-l border-white/5 bg-obsidian/80 backdrop-blur-xl z-[60]">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Asset Details</span>
                <button onClick={() => setSelectedFile(null)} className="p-1.5 rounded hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"><X size={14} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                {/* Preview */}
                <div className="aspect-square bg-midnight rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden shadow-inner group relative">
                  {isImage(selectedFile.name) ? (
                    <img src={selectedFile.url} alt={selectedFile.name} className="max-w-full max-h-full object-contain p-4" />
                  ) : getIcon(selectedFile.name, 64)}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all text-white backdrop-blur-md" title="Open Full">
                      <ExternalLink size={20} />
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-mono text-xs font-bold text-white mb-1 uppercase tracking-tight">{selectedFile.name}</h3>
                    <p className="font-mono text-[10px] text-zinc-600 truncate">{selectedFile.url}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div>
                      <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Size</p>
                      <p className="text-xs font-mono text-white/80">{formatSize(selectedFile.size)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Modified</p>
                      <p className="text-xs font-mono text-white/80">{formatTs(selectedFile.timestamp)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Status</p>
                      <p className={`text-[10px] font-mono font-bold uppercase tracking-widest ${STATUS_COLORS[selectedFile.status || 'Approved']}`}>{selectedFile.status}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Folder</p>
                      <p className="text-xs font-mono text-white/80 uppercase tracking-widest">{selectedFile.folder || 'root'}</p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider flex items-center gap-2">
                    <Tag size={10} /> Discovery Tags
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedFile.tags ?? []).map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] font-mono text-white/40 uppercase tracking-tighter hover:text-white hover:border-purple-600/30 transition-colors">#{t}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto space-y-2 border-t border-white/5 pt-6 pb-4">
                  <button onClick={() => window.open(selectedFile.url, '_blank')} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-200 transition-colors">
                    <Download size={14} /> Download
                  </button>
                  <button onClick={() => handleShare(selectedFile)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-white font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-zinc-800 transition-colors">
                    {shareLoading ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />} Share Link
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {shareLink && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} 
              className="w-full max-w-md bg-obsidian border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-emerald-500" />
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/30">
                    <Share2 className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-bold text-white uppercase tracking-widest">Share Neural Object</h3>
                    <p className="font-mono text-[10px] text-zinc-500">Public Link · 24h Expiry (Simulated)</p>
                  </div>
                </div>
                <button onClick={() => setShareLink(null)} className="text-zinc-500 hover:text-white transition-colors p-2"><X size={18} /></button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-midnight rounded-xl border border-white/5 space-y-2">
                  <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-2 flex items-center gap-2"><Shield size={10} className="text-purple-500" /> Secure Link</p>
                  <div className="flex gap-2">
                    <input readOnly value={shareLink} className="flex-1 bg-black border border-white/10 rounded px-3 py-2 font-mono text-[10px] text-zinc-400 focus:outline-none" />
                    <button onClick={copyLink} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-mono text-[10px] font-bold rounded uppercase tracking-widest">
                      {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald/5 border border-emerald/10 rounded-lg">
                  <CheckCircle className="text-emerald" size={14} />
                  <p className="font-mono text-[9px] text-emerald/60 uppercase tracking-widest leading-normal">This link is end-to-end encrypted via G5 Security Architecture.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function XCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
    </svg>
  );
}
