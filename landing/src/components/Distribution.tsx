import { useState } from 'react';
import { Share2, Linkedin, Mail, Globe, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

export function Distribution() {
  const [loadingChannel, setLoadingChannel] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { status: 'success' | 'error', message: string, url?: string }>>({});

  const channels = [
    { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={20} />, agent: 'CC-02' },
    { id: 'email', label: 'Email Marketing', icon: <Mail size={20} />, agent: 'CC-03' },
    { id: 'wordpress', label: 'Native Blog', icon: <Globe size={20} />, agent: 'CC-04' },
    { id: 'social_echo', label: 'Social Echo', icon: <Share2 size={20} />, agent: 'CC-05' },
  ];

  const handlePublish = async (channelId: string) => {
    setLoadingChannel(channelId);
    try {
      const response = await fetch(`${API_BASE_URL}/distribution/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: channelId,
          content: 'Global Distribution Protocol Activated via GenIUS OS.'
        })
      });

      const data = await response.json();
      if (data.success) {
        setResults(prev => ({
          ...prev,
          [channelId]: { status: 'success', message: 'Published successfully', url: data.data.url }
        }));
      } else {
        throw new Error(data.error || 'Publishing failed');
      }
    } catch (err) {
      setResults(prev => ({
        ...prev,
        [channelId]: { status: 'error', message: (err as Error).message }
      }));
    } finally {
      setLoadingChannel(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/40 rounded-xl border border-white/5 overflow-hidden font-mono">
      <div className="bg-white/5 p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Send size={16} className="text-accent" />
          <span className="text-accent font-black uppercase tracking-widest">Global Distribution Network</span>
        </div>
      </div>
      
      <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-6 content-start overflow-y-auto scrollbar-none">
        {channels.map((channel) => (
          <div key={channel.id} className="p-8 rounded-3xl border border-white/5 bg-white/2 group hover:border-accent/40 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              {channel.icon}
            </div>
            
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-accent transition-colors">
                 {channel.icon}
               </div>
               <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white/80">{channel.label}</h3>
                  <p className="text-[9px] text-accent font-bold uppercase tracking-widest">Agent Protocol: {channel.agent}</p>
               </div>
            </div>

            <div className="space-y-4">
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: '30%' }}
                  animate={{ width: results[channel.id] ? '100%' : '30%' }}
                  className={`h-full ${results[channel.id]?.status === 'success' ? 'bg-green-500' : 'bg-accent/20'} ${!results[channel.id] && 'animate-pulse'}`} 
                />
              </div>
              
              <AnimatePresence mode="wait">
                {results[channel.id] ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 text-[10px] font-bold uppercase ${results[channel.id].status === 'success' ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {results[channel.id].status === 'success' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                    {results[channel.id].message}
                    {results[channel.id].url && (
                      <a href={results[channel.id].url} target="_blank" rel="noreferrer" className="ml-auto underline opacity-50 hover:opacity-100">View</a>
                    )}
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-between">
                     <span className="text-[9px] uppercase font-black text-white/20">Phase 2 Activation</span>
                     <span className="text-[10px] font-bold text-accent uppercase">Ready</span>
                  </div>
                )}
              </AnimatePresence>

              <button 
                onClick={() => handlePublish(channel.id)}
                disabled={loadingChannel === channel.id || results[channel.id]?.status === 'success'}
                className={`w-full py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 
                  ${loadingChannel === channel.id ? 'bg-white/5 border-white/10 text-white/40 cursor-wait' : 
                    results[channel.id]?.status === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500 cursor-default' :
                    'bg-accent/10 border-accent/20 text-accent hover:bg-accent hover:text-obsidian active:scale-95'}`}
              >
                {loadingChannel === channel.id ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Publishing...
                  </>
                ) : results[channel.id]?.status === 'success' ? (
                  'Synchronized'
                ) : (
                  'Configure & Publish'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
