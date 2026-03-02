import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud, FileText, Image as ImageIcon, File, Video,
  CheckCircle, Database, RefreshCw, Download, Eye,
  FolderOpen, CheckSquare, Search, Grid, List, Share2,
  Tag, X, Clock, Shield, Loader2, Copy, Check, Filter
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

// ── Auto-tag generator (local heuristic for demo) ────────────────────────────
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/vault/list`);
      if (res.ok) {
        const data = await res.json();
        // Enrich with auto-tags + default status
        const enriched: VaultFile[] = (data.files || []).map((f: VaultFile) => ({
          ...f,
          tags: f.tags ?? autoTags(f.name),
          status: f.status ?? 'Approved',
        }));
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

    // Simulate progress (real XHR progress would require XMLHttpRequest)
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

    return catMatch && statusMatch && searchMatch;
  });

  // ── Selection ────────────────────────────────────────────────────────────
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

  // ── Batch ZIP ────────────────────────────────────────────────────────────
  const handleBatchZIP = async () => {
    const sel = files.filter(f => selectedNames.has(f.name));
    if (!sel.length) return;
    await downloadZIP(
      sel.map(f => ({ name: f.name, content: f.url })),
      `G5_Vault_Export_${Date.now()}`
    );
  };

  // ── Share Link ───────────────────────────────────────────────────────────
  const handleShare = (file: VaultFile) => {
    setShareLoading(true);
    // Generate a pseudo expiring share link (real implementation would be signed GCS URL)
    setTimeout(() => {
      const link = file.url.startsWith('http')
        ? file.url
        : `${window.location.origin}${file.url}?share=1&exp=${Date.now() + 86400000}`;
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

  // ── Icons ────────────────────────────────────────────────────────────────
  const getIcon = (name: string, size = 16) => {
    if (isImage(name))  return <ImageIcon size={size} className="text-purple-400" />;
    if (isVideo(name))  return <Video size={size} className="text-blue-400" />;
    if (isDoc(name))    return <FileText size={size} className="text-cyan-400" />;
    return <File size={size} className="text-zinc-500" />;
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="h-full flex flex-col gap-4 overflow-hidden"
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files); }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-purple-500/10 border border-purple-500/20">
            <Database size={18} className="text-purple-400" />
          </div>
          <div>
            <h2 className="font-mono text-base font-bold text-white uppercase tracking-widest">Asset Vault</h2>
            <p className="font-mono text-[10px] text-zinc-600">DAM · Module 04 · Cloud Storage + Discovery Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-zinc-600">{filteredFiles.length}/{files.length}</span>
          <button onClick={fetchFiles} title="Refresh" className="p-1.5 rounded hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-white">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
          {/* View Toggle */}
          <div className="flex border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setViewMode('list')} className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-600 hover:text-white'}`}><List size={13} /></button>
            <button onClick={() => setViewMode('grid')} className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-zinc-700 text-white' : 'text-zinc-600 hover:text-white'}`}><Grid size={13} /></button>
          </div>
          {selectedNames.size > 0 && (
            <button onClick={handleBatchZIP} className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-purple-600 text-purple-400 font-mono text-xs hover:bg-purple-600/10 transition-colors">
              <Download size={12} /> ZIP ({selectedNames.size})
            </button>
          )}
          <button onClick={selectAll} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-zinc-700 text-zinc-400 font-mono text-xs hover:text-white hover:border-zinc-500 transition-colors">
            <CheckSquare size={12} /> {selectedNames.size === filteredFiles.length && filteredFiles.length > 0 ? 'Deselect All' : 'Select All'}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs rounded transition-colors"
          >
            <UploadCloud size={13} /> Upload
          </button>
          <input ref={fileInputRef} type="file" multiple hidden onChange={e => e.target.files && uploadFiles(e.target.files)} />
        </div>
      </div>

      {/* ── Search + Status Filter ───────────────────────────────────────── */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name or tag..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 pl-9 font-mono text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-600 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white">
              <X size={12} />
            </button>
          )}
        </div>
        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <Filter size={12} className="text-zinc-600" />
          {['all', 'Draft', 'Review', 'Approved', 'Archived'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-2 py-1 rounded font-mono text-[10px] transition-colors uppercase ${
                filterStatus === s ? 'bg-zinc-700 text-white' : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Category Tabs ────────────────────────────────────────────────── */}
      <div className="flex gap-1 shrink-0 border-b border-zinc-900 pb-0">
        {CATEGORY_TABS.map(tab => (
          <button key={tab.key} onClick={() => setCategory(tab.key)}
            className={`px-3 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors relative ${
              category === tab.key ? 'text-purple-400' : 'text-zinc-600 hover:text-zinc-400'
            }`}>
            {tab.label}
            {category === tab.key && (
              <motion.div layoutId="vault-tab-line" className="absolute bottom-0 left-0 right-0 h-px bg-purple-500" />
            )}
          </button>
        ))}
      </div>

      {/* ── Upload Progress Bar ──────────────────────────────────────────── */}
      <AnimatePresence>
        {uploadState !== 'idle' && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`flex items-center gap-3 p-3 rounded-lg border font-mono text-xs ${
              uploadState === 'done'  ? 'border-green-700 bg-green-950/30 text-green-400' :
              uploadState === 'error' ? 'border-red-800 bg-red-950/30 text-red-400' :
              'border-purple-700 bg-purple-950/30 text-purple-300'
            }`}>
            {uploadState === 'uploading' && <Loader2 size={13} className="animate-spin shrink-0" />}
            {uploadState === 'done'      && <CheckCircle size={13} className="shrink-0" />}
            <div className="flex-1 min-w-0">
              <span>{uploadState === 'done' ? 'Upload complete — files ingested into DAM' : uploadState === 'error' ? 'Upload failed — please retry' : 'Uploading and ingesting into Discovery Engine...'}</span>
              {uploadState === 'uploading' && (
                <div className="mt-1.5 h-1 bg-purple-900/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-purple-500 rounded-full"
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ ease: 'linear' }}
                  />
                </div>
              )}
            </div>
            <span className="shrink-0 text-zinc-500">{uploadState === 'uploading' ? `${uploadProgress}%` : ''}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Drop Zone Overlay ────────────────────────────────────────────── */}
      <AnimatePresence>
        {dragOver && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-4 z-20 border-2 border-dashed border-purple-500 rounded-xl flex flex-col items-center justify-center bg-purple-950/80 backdrop-blur-sm pointer-events-none">
            <UploadCloud size={48} className="text-purple-400 mb-3" />
            <p className="font-mono text-lg text-purple-300 uppercase tracking-widest">Drop files anywhere</p>
            <p className="font-mono text-xs text-purple-500 mt-1">Images · Videos · Documents · Any format</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content Area ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 gap-4 min-h-0 relative">

        {/* ── File List / Grid ─────────────────────────────────────────── */}
        <div className={`flex-1 overflow-y-auto min-h-0 transition-all ${selectedFile ? 'max-w-[55%]' : ''}`}>

          {loading ? (
            <div className={`grid gap-2 ${viewMode === 'grid' ? 'grid-cols-3' : ''}`}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-14 bg-zinc-900 rounded animate-pulse" />
              ))}
            </div>
          ) : files.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full text-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}>
              <div className="w-20 h-20 rounded-full bg-purple-500/5 border border-purple-500/10 flex items-center justify-center mb-4">
                <UploadCloud size={32} className="text-purple-400/40" />
              </div>
              <p className="font-mono text-sm text-zinc-500 uppercase tracking-widest">Vault Empty</p>
              <p className="font-mono text-xs text-zinc-700 mt-1.5">Click or drag files to upload</p>
              <p className="font-mono text-[10px] text-zinc-800 mt-1">Supports images, videos, documents up to 500MB</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-mono text-xs text-zinc-600">No files match your search or filter.</p>
              <button onClick={() => { setSearchQuery(''); setFilterStatus('all'); }} className="font-mono text-xs text-purple-400 mt-2 hover:underline">Clear filters</button>
            </div>
          ) : viewMode === 'list' ? (
            /* ── List View ─────────────────────────────────────────────── */
            <div className="grid gap-1.5">
              {filteredFiles.map((file, i) => (
                <motion.div key={file.name}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedFile(selectedFile?.name === file.name ? null : file)}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${
                    selectedFile?.name === file.name ? 'border-purple-600/50 bg-purple-950/20' :
                    selectedNames.has(file.name)    ? 'border-purple-800/40 bg-purple-950/10' :
                    'border-zinc-800/60 hover:border-zinc-700 bg-zinc-900/40'
                  }`}>
                  {/* Checkbox */}
                  <button onClick={e => { e.stopPropagation(); toggleSelect(file.name); }}
                    className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                      selectedNames.has(file.name) ? 'bg-purple-600 border-purple-600' : 'border-zinc-700 opacity-0 group-hover:opacity-100'
                    }`}>
                    {selectedNames.has(file.name) && <CheckSquare size={8} className="text-white" />}
                  </button>
                  {getIcon(file.name)}
                  {/* Name */}
                  <p className="flex-1 font-mono text-xs text-white truncate">{file.name}</p>
                  {/* Tags */}
                  <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
                    {(file.tags ?? []).slice(0, 2).map(t => (
                      <span key={t} className="font-mono text-[9px] text-zinc-600 border border-zinc-800 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <Tag size={7} /> {t}
                      </span>
                    ))}
                  </div>
                  {/* Status Badge */}
                  {file.status && (
                    <span className={`hidden sm:inline font-mono text-[9px] px-1.5 py-0.5 rounded border uppercase ${STATUS_COLORS[file.status]}`}>
                      {file.status}
                    </span>
                  )}
                  {/* Size + Date */}
                  <span className="font-mono text-[10px] text-zinc-700 hidden md:block">{formatSize(file.size)}</span>
                  {/* Actions (hover) */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isImage(file.name) && <Eye size={12} className="text-zinc-500 hover:text-white cursor-pointer" />}
                    <button onClick={e => { e.stopPropagation(); handleShare(file); setSelectedFile(file); }} title="Share">
                      <Share2 size={12} className="text-zinc-500 hover:text-purple-400 transition-colors" />
                    </button>
                    <a href={file.url} download onClick={e => e.stopPropagation()}>
                      <Download size={12} className="text-zinc-500 hover:text-white" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* ── Grid View ─────────────────────────────────────────────── */
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredFiles.map((file, i) => (
                <motion.div key={file.name}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedFile(selectedFile?.name === file.name ? null : file)}
                  className={`group relative rounded-lg border overflow-hidden cursor-pointer transition-all aspect-square ${
                    selectedFile?.name === file.name ? 'border-purple-600' : 'border-zinc-800 hover:border-zinc-600'
                  }`}>
                  {isImage(file.name) ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center gap-2">
                      {getIcon(file.name, 28)}
                      <p className="font-mono text-[10px] text-zinc-600 px-2 text-center truncate w-full">{file.name}</p>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={e => { e.stopPropagation(); handleShare(file); setSelectedFile(file); }}
                      className="p-2 bg-white/10 rounded hover:bg-white/20 transition-colors">
                      <Share2 size={14} className="text-white" />
                    </button>
                    <a href={file.url} download onClick={e => e.stopPropagation()}
                      className="p-2 bg-white/10 rounded hover:bg-white/20 transition-colors">
                      <Download size={14} className="text-white" />
                    </a>
                  </div>
                  {/* Status badge */}
                  {file.status && (
                    <span className={`absolute top-2 left-2 font-mono text-[8px] px-1.5 py-0.5 rounded uppercase border ${STATUS_COLORS[file.status]}`}>
                      {file.status}
                    </span>
                  )}
                  {/* Select */}
                  <button
                    onClick={e => { e.stopPropagation(); toggleSelect(file.name); }}
                    className={`absolute top-2 right-2 w-5 h-5 rounded border flex items-center justify-center transition-all ${
                      selectedNames.has(file.name) ? 'bg-purple-600 border-purple-600 opacity-100' : 'border-white/30 bg-black/40 opacity-0 group-hover:opacity-100'
                    }`}>
                    {selectedNames.has(file.name) && <Check size={9} className="text-white" />}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ── Preview / Detail Panel ───────────────────────────────────── */}
        <AnimatePresence>
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }}
              className="w-64 shrink-0 flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Preview</span>
                <button onClick={() => { setSelectedFile(null); setShareLink(null); }} className="text-zinc-600 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              </div>

              {/* Preview Area */}
              <div className="flex-1 flex items-center justify-center p-3 bg-black/30 min-h-0">
                {isImage(selectedFile.name) ? (
                  <img src={selectedFile.url} alt={selectedFile.name} className="max-w-full max-h-40 object-contain rounded border border-zinc-800" />
                ) : isVideo(selectedFile.name) ? (
                  <video src={selectedFile.url} controls className="max-w-full max-h-40 rounded" />
                ) : (
                  <div className="text-center py-6">
                    {getIcon(selectedFile.name, 36)}
                    <p className="font-mono text-[10px] text-zinc-600 mt-3">No preview available</p>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="px-4 py-3 border-t border-zinc-800 space-y-3">
                <p className="font-mono text-xs text-white break-all leading-tight">{selectedFile.name}</p>

                <div className="space-y-1.5 font-mono text-[10px] text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <Clock size={10} /> {formatTs(selectedFile.timestamp)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Database size={10} /> {formatSize(selectedFile.size)}
                  </div>
                  {selectedFile.status && (
                    <div className="flex items-center gap-1.5">
                      <Shield size={10} />
                      <span className={`px-1.5 py-0.5 rounded border text-[9px] uppercase ${STATUS_COLORS[selectedFile.status]}`}>
                        {selectedFile.status}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {(selectedFile.tags ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {(selectedFile.tags ?? []).map(t => (
                      <span key={t} className="flex items-center gap-0.5 font-mono text-[9px] text-zinc-600 border border-zinc-800 px-1.5 py-0.5 rounded-full">
                        <Tag size={7} /> {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Share Link */}
                <div className="space-y-1.5">
                  <button
                    onClick={() => handleShare(selectedFile)}
                    disabled={shareLoading}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 border border-purple-700 text-purple-400 font-mono text-[10px] rounded hover:bg-purple-900/20 transition-colors disabled:opacity-50"
                  >
                    {shareLoading ? <Loader2 size={10} className="animate-spin" /> : <Share2 size={10} />}
                    Generate Share Link
                  </button>
                  {shareLink && (
                    <div className="flex items-center gap-1">
                      <input
                        readOnly value={shareLink}
                        className="flex-1 bg-zinc-900 border border-zinc-800 px-2 py-1 font-mono text-[9px] text-zinc-400 rounded truncate focus:outline-none"
                      />
                      <button onClick={copyLink} className="shrink-0 p-1.5 border border-zinc-700 rounded hover:border-zinc-500 text-zinc-500 hover:text-white transition-colors">
                        {copiedLink ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Download */}
                <a
                  href={selectedFile.url} download
                  className="flex items-center justify-center gap-1.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-[10px] rounded transition-colors"
                >
                  <Download size={10} /> Download Original
                </a>

                {/* Senate badge */}
                <div className="flex items-center gap-1.5 pt-1 border-t border-zinc-900">
                  <CheckCircle size={10} className="text-green-600" />
                  <span className="font-mono text-[9px] text-zinc-600">RA-01 Vault-Sealed · G5 DAM</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Stats Bar ────────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-4 pt-2 border-t border-zinc-900 font-mono text-[10px] text-zinc-700">
        <div className="flex items-center gap-1.5">
          <FolderOpen size={10} />
          <span>{files.length} files total</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ImageIcon size={10} />
          <span>{files.filter(f => isImage(f.name)).length} images</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileText size={10} />
          <span>{files.filter(f => isDoc(f.name)).length} docs</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Video size={10} />
          <span>{files.filter(f => isVideo(f.name)).length} videos</span>
        </div>
        {selectedNames.size > 0 && (
          <div className="flex items-center gap-1.5 text-purple-400">
            <CheckSquare size={10} />
            <span>{selectedNames.size} selected</span>
          </div>
        )}
      </div>
    </div>
  );
}
