import { Share2, Linkedin, Mail, Globe, Send } from 'lucide-react';

export function Distribution() {
  const channels = [
    { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={20} />, agent: 'CC-02' },
    { id: 'email', label: 'Email Marketing', icon: <Mail size={20} />, agent: 'CC-03' },
    { id: 'blog', label: 'Native Blog', icon: <Globe size={20} />, agent: 'CC-04' },
    { id: 'social', label: 'Social Echo', icon: <Share2 size={20} />, agent: 'CC-05' },
  ];

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
                <div className="h-full bg-accent/20 w-1/3 animate-pulse" />
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-[9px] uppercase font-black text-white/20">Phase 2 Activation</span>
                 <span className="text-[10px] font-bold text-accent uppercase">Coming Soon</span>
              </div>
              <button disabled className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/20 cursor-not-allowed">
                Configure Channel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
