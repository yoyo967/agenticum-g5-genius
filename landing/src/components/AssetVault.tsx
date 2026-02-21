import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, Image as ImageIcon, File, CheckCircle, Database } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'parsing' | 'ready' | 'error';
}

export function AssetVault() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = async (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    
    const newUploads = fileArray.map(f => ({
      id: Math.random().toString(36).substring(7),
      name: f.name,
      size: f.size,
      type: f.type,
      status: 'uploading' as const,
      file: f // keep reference for FormData
    }));

    setFiles(prev => [...newUploads, ...prev]);

    // Construct FormData and upload all at once
    const formData = new FormData();
    fileArray.forEach(f => formData.append('files', f));

    try {
      // Set to parsing to indicate backend is thinking/processing
      setFiles(prev => prev.map(f => newUploads.find(u => u.id === f.id) ? { ...f, status: 'parsing' } : f));
      
      const res = await fetch('http://localhost:8080/api/vault/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) throw new Error('Upload failed');
      
      // Complete
      setFiles(prev => prev.map(f => newUploads.find(u => u.id === f.id) ? { ...f, status: 'ready' } : f));
    } catch (err) {
      console.error(err);
      setFiles(prev => prev.map(f => newUploads.find(u => u.id === f.id) ? { ...f, status: 'error' } : f));
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <ImageIcon size={20} className="text-neural-purple" />;
    if (type.includes('pdf') || type.includes('text')) return <FileText size={20} className="text-neural-blue" />;
    return <File size={20} className="text-white/50" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="h-full flex flex-col border border-white/5 rounded-2xl bg-black/20 glass overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40 shrink-0">
        <div>
           <h2 className="text-2xl font-display font-black uppercase italic tracking-tighter text-white flex items-center gap-2">
             <Database size={24} className="text-neural-blue" />
             Asset Vault & Omni-Brief
           </h2>
           <p className="text-white/40 font-light text-xs mt-1">Ingest Context. Fuel the Discovery Engine.</p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Drag & Drop Zone */}
        <div className="w-1/2 p-6 border-r border-white/5 flex flex-col">
          <div 
            className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${isDragging ? 'border-neural-blue bg-neural-blue/5 scale-[0.98]' : 'border-white/10 hover:border-neural-blue/30 hover:bg-white/2'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
             <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileInput} multiple />
             
             <div className="w-16 h-16 rounded-full bg-neural-blue/10 flex items-center justify-center mb-6">
               <UploadCloud size={32} className="text-neural-blue" />
             </div>
             
             <h3 className="text-lg font-display font-black uppercase tracking-tight text-white mb-2">Initialize Payload</h3>
             <p className="text-white/40 text-xs text-center max-w-xs leading-relaxed">
               Drag & Drop brand guidelines, competitor assets, or text briefs here. <br/><br/>
               <span className="text-neural-blue opacity-80">Click to browse local files.</span>
             </p>
          </div>
        </div>

        <div className="w-1/2 p-6 flex flex-col bg-white/1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6 flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
             Active Context Streams
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-none flex flex-col gap-3">
             <AnimatePresence>
               {files.length === 0 && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center opacity-20">
                    <Database size={32} className="mb-4" />
                    <p className="text-[10px] uppercase font-black tracking-widest">Vault Empty</p>
                 </motion.div>
               )}
               {files.map(file => (
                 <motion.div 
                   key={file.id}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="glass p-4 rounded-xl border border-white/5 flex items-center gap-4 bg-black/40"
                 >
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{file.name}</h4>
                      <div className="flex items-center gap-3 mt-1.5">
                         <span className="text-[9px] font-mono text-white/30">{formatSize(file.size)}</span>
                         <div className="flex items-center gap-1.5">
                           {file.status === 'uploading' && (
                             <><div className="w-1 h-1 rounded-full bg-neural-blue animate-pulse" /><span className="text-[9px] font-black uppercase tracking-widest text-neural-blue/70">Warping to Cloud</span></>
                           )}
                           {file.status === 'parsing' && (
                             <><div className="w-1 h-1 rounded-full bg-neural-gold animate-ping" /><span className="text-[9px] font-black uppercase tracking-widest text-neural-gold/70">Ingesting to Matrix</span></>
                           )}
                           {file.status === 'ready' && (
                             <><CheckCircle size={10} className="text-green-500" /><span className="text-[9px] font-black uppercase tracking-widest text-green-500/70">Grounded in Context</span></>
                           )}
                         </div>
                      </div>
                    </div>
                    
                    {file.status === 'parsing' && (
                      <div className="w-8 h-8 flex items-center justify-center">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-4 h-4 border-2 border-neural-gold border-t-transparent rounded-full" />
                      </div>
                    )}
                 </motion.div>
               ))}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
