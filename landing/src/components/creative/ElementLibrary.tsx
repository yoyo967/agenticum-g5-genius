import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, 
  User, Image as ImageIcon, Box, 
  MoreVertical, 
  Trash2, Edit3, Grid, List, ChevronRight
} from 'lucide-react';
import type { StoryboardElement, ElementType } from '../../types';

interface ElementLibraryProps {
  elements: StoryboardElement[];
  onAddElement: (type: ElementType) => void;
  onSelectElement: (element: StoryboardElement) => void;
}

export const ElementLibrary: React.FC<ElementLibraryProps> = ({
  elements,
  onAddElement,
  onSelectElement
}) => {
  const [filter, setFilter] = useState<ElementType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredElements = elements.filter(el => {
    const matchesFilter = filter === 'all' || el.type === filter;
    const matchesSearch = el.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         el.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeIcon = (type: ElementType) => {
    switch (type) {
      case 'character': return <User size={14} />;
      case 'environment': return <ImageIcon size={14} />;
      case 'object': return <Box size={14} />;
      default: return < ImageIcon size={14} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/20 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-white/3">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <Box className="text-accent" size={20} />
              Element Library
            </h2>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">
              Reusable Storyboard Primitives
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-accent/20 text-accent' : 'text-white/40 hover:bg-white/5'}`}
            >
              <Grid size={16} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-accent/20 text-accent' : 'text-white/40 hover:bg-white/5'}`}
            >
              <List size={16} />
            </button>
            <div className="w-px h-8 bg-white/10 mx-2" />
            <button 
              onClick={() => onAddElement('character')}
              className="flex items-center gap-2 bg-accent text-void px-4 py-2 rounded-lg font-bold text-xs hover:bg-accent/80 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] group"
            >
              <Plus size={14} className="group-hover:rotate-90 transition-transform" />
              New Element
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input 
              type="text"
              placeholder="Search elements by name or prompt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-2">
            {(['all', 'character', 'environment', 'object'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                  filter === t 
                    ? 'bg-white/10 border-white/20 text-white' 
                    : 'bg-transparent border-transparent text-white/40 hover:bg-white/5'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {filteredElements.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <Plus size={24} className="text-white/20" />
            </div>
            <h3 className="text-lg font-display font-medium text-white/60">No elements found</h3>
            <p className="text-sm text-white/20 mt-1 max-w-xs">
              Start by creating your first reusable character, environment, or object.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredElements.map((el) => (
                <motion.div
                  key={el.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative h-80 rounded-2xl overflow-hidden border border-white/5 bg-white/3 hover:border-accent/30 transition-all"
                  onClick={() => onSelectElement(el)}
                >
                  <div className="h-48 overflow-hidden relative bg-black/40">
                    {el.images[0] ? (
                      <img 
                        src={el.images[0]} 
                        alt={el.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/5">
                        <ImageIcon size={48} />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-md glass text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 text-accent">
                      {getTypeIcon(el.type)}
                      {el.type}
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-1.5 rounded-lg bg-black/60 text-white/60 hover:text-white transition-colors">
                          <MoreVertical size={14} />
                       </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-white font-display font-bold truncate group-hover:text-accent transition-colors">
                      {el.name}
                    </h3>
                    <p className="text-[10px] text-white/30 line-clamp-3 mt-2 font-mono leading-relaxed">
                      {el.prompt}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-linear-to-t from-black/80 to-transparent">
                     <button className="w-full py-2 rounded-lg bg-accent text-void font-bold text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                        Add to Storyboard
                     </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredElements.map((el) => (
              <div 
                key={el.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/3 hover:border-accent/30 group cursor-pointer transition-all"
                onClick={() => onSelectElement(el)}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                  {el.images[0] ? (
                    <img src={el.images[0]} alt={el.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-black/40 flex items-center justify-center text-white/10">
                      <ImageIcon size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold truncate">{el.name}</h3>
                    <span className="text-[8px] font-black uppercase tracking-tighter text-accent/60 bg-accent/5 px-1.5 py-0.5 rounded">
                      {el.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/40 truncate font-mono mt-0.5">{el.prompt}</p>
                </div>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                   <button className="p-2 text-white/40 hover:text-white"><Edit3 size={14} /></button>
                   <button className="p-2 text-white/40 hover:text-red-400"><Trash2 size={14} /></button>
                   <ChevronRight size={14} className="text-accent" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
