import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Terminal, FileText, Database, Users, Shield, Compass, Image as ImageIcon, Briefcase, Hash } from 'lucide-react';

interface SearchItem {
  id: string;
  title: string;
  type: 'module' | 'client' | 'asset' | 'vector';
  icon: any;
  route?: string;
  meta?: string;
  color: string;
}

const SEARCH_DATABASE: SearchItem[] = [
  // Modules
  { id: 'm-1', title: 'Global Configurations', type: 'module', icon: Terminal, route: 'settings', color: 'text-white' },
  { id: 'm-2', title: 'Swarm Analytics', type: 'module', icon: Users, route: 'analytics', color: 'text-neural-blue' },
  { id: 'm-3', title: 'Security Senate', type: 'module', icon: Shield, route: 'senate', color: 'text-neural-gold' },
  { id: 'm-4', title: 'Project Memory', type: 'module', icon: Database, route: 'memory', color: 'text-pink-500' },
  { id: 'm-5', title: 'Synergy Map', type: 'module', icon: Compass, route: 'synergy', color: 'text-green-500' },
  
  // Clients (Mock)
  { id: 'c-1', title: 'CyberDyne Systems', type: 'client', icon: Briefcase, route: 'memory', meta: 'Active • 124 Vectors', color: 'text-white' },
  { id: 'c-2', title: 'Neon Cortex Inc.', type: 'client', icon: Briefcase, route: 'memory', meta: 'Archived • 42 Vectors', color: 'text-white/50' },

  // Assets/Vectors (Mock)
  { id: 'v-1', title: 'Brand_Guidelines_2026.pdf', type: 'vector', icon: FileText, route: 'vault', meta: '2.4 MB • Context', color: 'text-neural-purple' },
  { id: 'v-2', title: 'Neural Mesh Hero Concept', type: 'asset', icon: ImageIcon, route: 'studio', meta: 'DA-03 • Visual', color: 'text-yellow-500' },
  { id: 'v-3', title: 'LinkedIn Campaign: G5 Launch', type: 'asset', icon: Hash, route: 'studio', meta: 'CC-06 • Copy', color: 'text-neural-blue' }
];

export function OmniscientSearch({ isOpen, onClose, onNavigate }: { isOpen: boolean, onClose: () => void, onNavigate: (route: string) => void }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  // Filter Logic
  const filteredResults = query === '' 
    ? SEARCH_DATABASE.slice(0, 5) // Show top modules by default
    : SEARCH_DATABASE.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.type.toLowerCase().includes(query.toLowerCase()) ||
        (item.meta && item.meta.toLowerCase().includes(query.toLowerCase()))
      );

  // Keyboard Navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults[activeIndex]) {
          const selected = filteredResults[activeIndex];
          if (selected.route) {
            onNavigate(selected.route);
            onClose();
          }
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, filteredResults, onNavigate, onClose]);

  // Reset index when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        document.getElementById('omniscient-search-input')?.focus();
      }, 100);
    } else {
      setQuery('');
      setActiveIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-start justify-center pt-[15vh] px-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
         <motion.div 
           initial={{ opacity: 0, scale: 0.95, y: -20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: -20 }}
           className="w-full max-w-2xl bg-black/90 border border-neural-blue/30 rounded-2xl shadow-[0_0_100px_rgba(0,229,255,0.1)] overflow-hidden flex flex-col glass"
           onClick={e => e.stopPropagation()}
         >
            {/* Search Input Box */}
            <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-white/5 relative">
               <Search size={20} className="text-neural-blue animate-pulse" />
               <input 
                 id="omniscient-search-input"
                 type="text"
                 placeholder="Search Swarm Modules, Vectors, & Assets..."
                 value={query}
                 onChange={e => setQuery(e.target.value)}
                 className="flex-1 bg-transparent border-none text-lg text-white font-mono placeholder-white/30 focus:outline-none"
                 autoComplete="off"
                 spellCheck="false"
               />
               <kbd className="px-2 py-1 rounded bg-white/10 text-[10px] uppercase font-black tracking-widest text-white/50">
                 ESC
               </kbd>
               
               {/* Animated bottom scan line */}
               <div className="absolute bottom-0 left-0 h-px bg-linear-to-r from-transparent via-neural-blue to-transparent w-full" />
            </div>

            {/* Results Output */}
            <div className="max-h-[50vh] overflow-y-auto scrollbar-none flex flex-col p-2">
               {filteredResults.length === 0 ? (
                 <div className="py-12 text-center flex flex-col items-center justify-center text-white/30">
                   <Compass size={32} className="mb-4 opacity-50" />
                   <p className="font-mono text-sm">No neural pathways found matching "{query}".</p>
                 </div>
               ) : (
                 filteredResults.map((item, idx) => {
                   const Icon = item.icon;
                   const isActive = idx === activeIndex;
                   
                   return (
                     <div 
                       key={item.id}
                       onMouseEnter={() => setActiveIndex(idx)}
                       onClick={() => {
                         if (item.route) {
                           onNavigate(item.route);
                           onClose();
                         }
                       }}
                       className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border ${isActive ? 'bg-neural-blue/10 border-neural-blue/30 shadow-[0_0_20px_rgba(0,229,255,0.1)]' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                     >
                       <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${isActive ? 'bg-neural-blue/20 border-neural-blue/50 text-neural-blue' : 'bg-white/5 border-white/10 text-white/50'}`}>
                         <Icon size={18} className={item.color !== 'text-white' && item.color !== 'text-white/50' ? item.color : ''} />
                       </div>
                       
                       <div className="flex-1 flex flex-col">
                         <span className={`font-mono text-sm ${isActive ? 'text-white font-bold' : 'text-white/80'}`}>{item.title}</span>
                         <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-0.5">
                           {item.type} {item.meta && ` • ${item.meta}`}
                         </span>
                       </div>
                       
                       {isActive && (
                         <div className="flex items-center text-neural-blue text-[10px] uppercase font-black tracking-widest gap-2">
                           <span className="animate-pulse">Execute</span>
                           <kbd className="px-2 py-0.5 rounded border border-neural-blue/30 bg-neural-blue/10">↵</kbd>
                         </div>
                       )}
                     </div>
                   );
                 })
               )}
            </div>

            {/* Footer Metadata */}
            <div className="px-6 py-3 border-t border-white/5 bg-black/60 flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                <Terminal size={10} /> Omniscient Search Engaged
              </span>
              <div className="flex gap-4">
                <span className="flex items-center gap-1 text-[9px] font-mono text-white/30"><kbd className="px-1 border border-white/10 rounded">↑</kbd> <kbd className="px-1 border border-white/10 rounded">↓</kbd> Navigate</span>
                <span className="flex items-center gap-1 text-[9px] font-mono text-white/30"><kbd className="px-1 border border-white/10 rounded">↵</kbd> Select</span>
              </div>
            </div>
         </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
