import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, FolderHeart, Search, Clock, FileText, Image as ImageIcon, ChevronRight, Hash, Building2, Terminal } from 'lucide-react';

const MOCK_CLIENTS = [
  {
    id: 'c-01',
    name: 'CyberDyne Systems',
    status: 'Active',
    vectors: 124,
    lastActive: '2 mins ago',
    campaigns: [
      { id: 'camp-1', name: 'Q3 Product Launch: T-800', type: 'Omnichannel', date: '2026-08-15' },
      { id: 'camp-2', name: 'Rebranding Initiative', type: 'Brand Identity', date: '2026-05-01' }
    ],
    memory: [
      { id: 'm-1', name: 'Brand_Guidelines_2026.pdf', type: 'document', size: '2.4 MB' },
      { id: 'm-2', name: 'Past_Performance_Data.csv', type: 'data', size: '840 KB' },
      { id: 'm-3', name: 'CEO_Vision_Speech.mp3', type: 'audio', size: '12 MB' }
    ]
  },
  {
    id: 'c-02',
    name: 'Neon Cortex Inc.',
    status: 'Archived',
    vectors: 42,
    lastActive: '3 months ago',
    campaigns: [
      { id: 'camp-3', name: 'Neural Implant Promo', type: 'Social Media', date: '2025-11-20' }
    ],
    memory: [
      { id: 'm-4', name: 'Logo_Pack.zip', type: 'asset', size: '45 MB' }
    ]
  }
];

export function ProjectMemory() {
  const [activeClient, setActiveClient] = useState(MOCK_CLIENTS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-full flex flex-col overflow-hidden">
      
      {/* Search Header */}
      <div className="shrink-0 mb-6 flex gap-4">
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={16} className="text-white/40 group-focus-within:text-neural-blue transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Omniscient Search: Query Memory Vectors, Clients, or Payloads..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-neural-blue/50 focus:bg-black/60 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.5)] glass"
          />
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
             <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-black uppercase text-white/40">
               Cmd + K
             </kbd>
          </div>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        
        {/* Left: Client Roster */}
        <div className="w-1/3 flex flex-col gap-4 overflow-y-auto scrollbar-none pb-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
              <FolderHeart size={14} className="text-pink-500" />
              Client Roster
            </h3>
            <span className="text-[9px] font-mono text-white/30">{MOCK_CLIENTS.length} Indexed</span>
          </div>

          <div className="flex flex-col gap-3">
            {MOCK_CLIENTS.map(client => (
              <div 
                key={client.id}
                onClick={() => setActiveClient(client)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden group ${activeClient.id === client.id ? 'bg-neural-blue/5 border-neural-blue/30 shadow-[0_0_30px_rgba(0,229,255,0.1)]' : 'bg-black/40 border-white/5 hover:border-white/20 glass'}`}
              >
                {activeClient.id === client.id && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-neural-blue shadow-[0_0_10px_#00e5ff]" />
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                    <Building2 size={20} className={activeClient.id === client.id ? 'text-neural-blue' : 'text-white/50'} />
                  </div>
                  <span className={`px-2 py-1 rounded border text-[9px] font-black uppercase tracking-widest ${client.status === 'Active' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-white/5 border-white/10 text-white/40'}`}>
                    {client.status}
                  </span>
                </div>

                <h4 className="text-lg font-black text-white mb-1 group-hover:text-neural-blue transition-colors">{client.name}</h4>
                <div className="flex items-center gap-4 text-[10px] uppercase font-mono tracking-widest text-white/40">
                  <span className="flex items-center gap-1"><Hash size={10} /> {client.vectors} Vectors</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {client.lastActive}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Deep Client Catalog */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeClient.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="w-2/3 flex flex-col border border-white/5 rounded-2xl bg-black/40 glass overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
          >
             {/* Header */}
             <div className="p-8 border-b border-white/5 bg-linear-to-br from-neural-blue/10 via-transparent to-transparent flex items-start justify-between">
                <div>
                   <h2 className="text-3xl font-display font-black uppercase italic tracking-tighter text-white mb-2 shadow-neural-blue text-shadow-sm">
                     {activeClient.name}
                   </h2>
                   <p className="text-white/40 font-mono text-xs flex items-center gap-2">
                     ID: {activeClient.id} • Swarm Substrate: Gemini 2.0 Thinking
                   </p>
                </div>
                <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest text-white flex items-center gap-2 transition-colors">
                  <Terminal size={14} /> Open CLI
                </button>
             </div>

             <div className="flex-1 overflow-y-auto scrollbar-none p-8 flex flex-col gap-8">
                
                {/* Active Campaigns */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2 mb-4">
                    <Database size={14} className="text-neural-blue" />
                    Neural Campaigns
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {activeClient.campaigns.map(camp => (
                      <div key={camp.id} className="p-4 rounded-xl border border-white/5 bg-black/50 hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neural-blue/70">{camp.type}</span>
                          <ChevronRight size={14} className="text-white/20 group-hover:text-white transition-colors" />
                        </div>
                        <h4 className="text-sm font-bold text-white mb-2">{camp.name}</h4>
                        <p className="text-[10px] font-mono text-white/40">Initiated: {camp.date}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Memory Vectors (Context Base) */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2 mb-4">
                    <Database size={14} className="text-neural-purple" />
                    Memory Vectors (Context)
                  </h3>
                  <div className="flex flex-col gap-2">
                    {activeClient.memory.map(mem => (
                      <div key={mem.id} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-black/30 hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-white/50">
                            {mem.type === 'document' || mem.type === 'data' ? <FileText size={14} /> : <ImageIcon size={14} />}
                          </div>
                          <div>
                            <p className="text-xs font-mono text-white/80">{mem.name}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">{mem.type}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-white/20">{mem.size}</span>
                      </div>
                    ))}
                  </div>
                </div>

             </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
