import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, Image as ImageIcon, File, CheckCircle, Database, RefreshCw, Download, Eye, FolderOpen, CheckSquare } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { ExportMenu } from './ui';
import { downloadJSON, downloadZIP } from '../utils/export';

interface VaultFile {
  name: string;
  url: string;
  timestamp?: string;
  size?: number;
}

export function AssetVault() {
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<VaultFile | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState<'all' | 'images' | 'documents' | 'videos' | 'other'>('all');
  const [selectedNames, setSelectedNames] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/vault/list`);
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
      }
    } catch (e) {
      console.warn('[Vault] Backend unavailable:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFiles(); }, []);

  const uploadFiles = async (fileList: FileList | File[]) => {
    setUploading(true);
    const formData = new FormData();
    Array.from(fileList).forEach(f => formData.append('files', f));
    try {
      const res = await fetch(`${API_BASE_URL}/api/vault/upload`, { method: 'POST', body: formData });
      if (res.ok) fetchFiles();
    } catch (e) {
      console.warn('[Vault] Upload failed:', e);
    } finally {
      setUploading(false);
    }
  };

  const getIcon = (name: string) => {
    if (name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return <ImageIcon size={16} className="text-purple-400" />;
    if (name.match(/\.(pdf|doc|txt|md)$/i)) return <FileText size={16} className="text-accent" />;
    return <File size={16} className="text-white/40" />;
  };

  const isImage = (name: string) => !!name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
  const isVideo = (name: string) => !!name.match(/\.(mp4|mov|avi|webm|mkv)$/i);
  const isDoc = (name: string) => !!name.match(/\.(pdf|doc|docx|txt|md|html|csv|json|xlsx)$/i);

  const filteredFiles = files.filter(f => {
    if (category === 'all') return true;
    if (category === 'images') return isImage(f.name);
    if (category === 'videos') return isVideo(f.name);
    if (category === 'documents') return isDoc(f.name);
    return !isImage(f.name) && !isVideo(f.name) && !isDoc(f.name);
  });

  const toggleFileSelect = (name: string) => {
    setSelectedNames(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedNames.size === filteredFiles.length) {
      setSelectedNames(new Set());
    } else {
      setSelectedNames(new Set(filteredFiles.map(f => f.name)));
    }
  };

  const handleBatchZIP = async () => {
    const selected = files.filter(f => selectedNames.has(f.name));
    if (selected.length === 0) return;
    const zipFiles = selected.map(f => ({ name: f.name, content: f.url }));
    await downloadZIP(zipFiles, 'G5_Vault_Assets');
  };

  return (
    <div className="h-full flex flex-col gap-5 overflow-hidden"
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files); }}>

      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.1)' }}>
            <Database size={20} className="text-purple-400" />
          </div>
          <div>
            <h2 className="font-display text-xl uppercase tracking-tight">Asset Vault</h2>
            <p className="font-mono text-[10px] text-white/30">Cloud Storage + Discovery Engine Ingestion</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-white/20">{filteredFiles.length}/{files.length} files</span>
          <button onClick={fetchFiles} className="btn btn-ghost btn-sm">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          </button>
          <ExportMenu options={[
            { label: 'JSON Manifest', format: 'JSON', onClick: () => downloadJSON({ files: filteredFiles.map(f => ({ name: f.name, url: f.url, timestamp: f.timestamp, size: f.size })) }, 'G5_Vault_Manifest') },
          ]} />
          {selectedNames.size > 0 && (
            <>
              <button onClick={handleBatchZIP} className="btn btn-ghost btn-sm text-accent">
                <Download size={12} /> ZIP ({selectedNames.size})
              </button>
            </>
          )}
          <button onClick={selectAll} className="btn btn-ghost btn-sm">
            <CheckSquare size={12} /> {selectedNames.size === filteredFiles.length && filteredFiles.length > 0 ? 'Deselect' : 'Select All'}
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="btn btn-primary">
            <UploadCloud size={14} /> Upload Files
          </button>
          <input ref={fileInputRef} type="file" multiple hidden onChange={e => e.target.files && uploadFiles(e.target.files)} />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 shrink-0">
        {([{ key: 'all', label: 'All', icon: <FolderOpen size={10} /> }, { key: 'images', label: 'Images', icon: <ImageIcon size={10} /> }, { key: 'documents', label: 'Docs', icon: <FileText size={10} /> }, { key: 'videos', label: 'Videos', icon: <File size={10} /> }, { key: 'other', label: 'Other', icon: <File size={10} /> }] as const).map(tab => (
          <button key={tab.key} onClick={() => setCategory(tab.key)}
            className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1 ${category === tab.key ? 'bg-purple-400/15 text-purple-400 border border-purple-400/30' : 'text-white/30 hover:text-white/60 border border-transparent'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-1 gap-5 min-h-0">
        {/* File List */}
        <div className={`flex flex-col gap-3 overflow-y-auto transition-all ${selectedFile ? 'w-1/2' : 'w-full'}`}>
          
          {/* Drop Zone */}
          <AnimatePresence>
            {dragOver && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-12 border-2 border-dashed border-accent rounded-xl text-center bg-accent/5">
                <UploadCloud size={40} className="text-accent mx-auto mb-3" />
                <p className="font-display text-lg uppercase text-accent">Drop Files Here</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {uploading && (
            <div className="card flex items-center gap-3">
              <RefreshCw size={14} className="animate-spin text-accent" />
              <span className="font-mono text-xs text-accent">Uploading and ingesting files...</span>
            </div>
          )}

          {loading ? (
            <div className="grid gap-3">
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 w-full" />)}
            </div>
          ) : files.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <UploadCloud size={48} className="text-white/10 mb-4" />
              <p className="font-display text-lg uppercase text-white/20">Empty Vault</p>
              <p className="font-mono text-xs text-white/15 mt-1">Upload files to ingest into the Discovery Engine</p>
            </div>
          ) : (
            <div className="grid gap-2">
              {filteredFiles.map(file => (
                <motion.div key={file.name}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`card flex items-center gap-3 cursor-pointer group hover:border-white/20 ${selectedFile?.name === file.name ? 'border-accent/30' : ''} ${selectedNames.has(file.name) ? 'border-accent/20 bg-accent/5' : ''}`}
                  onClick={() => setSelectedFile(file)}>
                  <button onClick={e => { e.stopPropagation(); toggleFileSelect(file.name); }}
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all ${selectedNames.has(file.name) ? 'bg-accent text-midnight' : 'border border-white/10 opacity-0 group-hover:opacity-100'}`}>
                    {selectedNames.has(file.name) && <CheckSquare size={8} />}
                  </button>
                  {getIcon(file.name)}
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-white truncate">{file.name}</p>
                    {file.timestamp && <p className="font-mono text-[9px] text-white/20">{new Date(file.timestamp).toLocaleDateString('en-US')}</p>}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isImage(file.name) && <Eye size={12} className="text-white/30" />}
                    <a href={file.url} download className="text-white/30 hover:text-white" onClick={e => e.stopPropagation()}>
                      <Download size={12} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <AnimatePresence>
          {selectedFile && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="w-1/2 glass flex flex-col overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                <h3 className="font-display text-sm uppercase truncate">{selectedFile.name}</h3>
                <button onClick={() => setSelectedFile(null)} className="text-white/30 hover:text-white text-lg">×</button>
              </div>
              <div className="flex-1 flex items-center justify-center p-4 bg-black/20 overflow-auto">
                {isImage(selectedFile.name) ? (
                  <img src={selectedFile.url} alt={selectedFile.name} className="max-w-full max-h-full rounded-lg border border-white/5" />
                ) : (
                  <div className="text-center">
                    {getIcon(selectedFile.name)}
                    <p className="font-mono text-xs text-white/40 mt-3">{selectedFile.name}</p>
                    <a href={selectedFile.url} download className="btn btn-ghost btn-sm mt-3">
                      <Download size={12} /> Download
                    </a>
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-[9px] text-white/20">
                  {selectedFile.timestamp ? new Date(selectedFile.timestamp).toLocaleString('en-US') : 'No timestamp'}
                </span>
                <CheckCircle size={12} className="text-emerald" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
