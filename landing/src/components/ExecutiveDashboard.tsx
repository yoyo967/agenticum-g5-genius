import { motion } from 'framer-motion';
import { Activity, Users, Database, Clock, TrendingUp, Zap } from 'lucide-react';

export function ExecutiveDashboard() {
  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto scrollbar-none pb-6">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
        <StatCard 
          title="Active Workflows" 
          value="4" 
          subtext="Autopilot Sequences Running"
          icon={<Activity />}
          color="text-pink-500"
          bg="bg-pink-500/10"
          border="border-pink-500/20"
        />
        <StatCard 
          title="Vault Storage" 
          value="4.2 GB" 
          subtext="Knowledge Context Ingested"
          icon={<Database />}
          color="text-neural-blue"
          bg="bg-neural-blue/10"
          border="border-neural-blue/20"
        />
        <StatCard 
          title="Swarm Readiness" 
          value="100%" 
          subtext="All 5 Agents Online"
          icon={<Users />}
          color="text-neural-gold"
          bg="bg-neural-gold/10"
          border="border-neural-gold/20"
        />
        <StatCard 
          title="System Latency" 
          value="42ms" 
          subtext="Vertex AI WebSocket Ping"
          icon={<Zap />}
          color="text-green-500"
          bg="bg-green-500/10"
          border="border-green-500/20"
        />
      </div>

      <div className="flex gap-6 flex-1 min-h-[400px]">
        {/* Left: Live Activity Feed */}
        <div className="w-1/3 flex flex-col border border-white/5 rounded-2xl bg-black/40 glass overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
           <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0">
             <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
               <Clock size={16} className="text-white/50" />
               Global Activity Log
             </h3>
           </div>
           <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
              <LogItem time="10:42 AM" agent="DA-03" text="Generated 2 Image Assets for Campaign Alpha" type="success" />
              <LogItem time="09:15 AM" agent="CC-06" text="Completed Markdown Draft: LinkedIn V2" type="success" />
              <LogItem time="09:14 AM" agent="SN-00" text="Dispatched copywriter sequence based on Strategy" type="info" />
              <LogItem time="09:00 AM" agent="SP-01" text="Triggered by Cronjob: Competitor Analysis" type="info" />
              <LogItem time="Yesterday" agent="Boss" text="Uploaded new 45-page Brand Guideline (PDF)" type="user" />
           </div>
        </div>

        {/* Right: Agency Performance Analytics */}
        <div className="w-2/3 flex flex-col border border-white/5 rounded-2xl bg-black/40 glass overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
           <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0">
             <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
               <TrendingUp size={16} className="text-white/50" />
               Agency Throughput
             </h3>
             <select className="bg-black/50 border border-white/10 rounded px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none">
               <option>Last 7 Days</option>
               <option>Last 30 Days</option>
             </select>
           </div>
           
           <div className="flex-1 p-8 flex flex-col">
              {/* Mock Bar Chart Area */}
              <div className="flex-1 flex items-end justify-between gap-2 border-b border-white/10 pb-4 relative">
                {/* Y-Axis lines */}
                <div className="absolute top-0 w-full border-t border-white/5" />
                <div className="absolute top-1/4 w-full border-t border-white/5" />
                <div className="absolute top-2/4 w-full border-t border-white/5" />
                <div className="absolute top-3/4 w-full border-t border-white/5" />
                
                {/* Bars */}
                {[40, 65, 30, 85, 50, 95, 75].map((height, i) => (
                  <div key={i} className="w-full max-w-[40px] flex flex-col items-center gap-2 z-10">
                     <motion.div 
                       initial={{ height: 0 }}
                       animate={{ height: `${height}%` }}
                       transition={{ duration: 1, delay: i * 0.1 }}
                       className="w-full bg-linear-to-t from-neural-blue/20 to-neural-blue rounded-t-sm"
                     />
                     <span className="text-[9px] font-mono text-white/50">{'SMTWTFS'[i]}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 grid grid-cols-3 gap-6">
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                   <p className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-1">Total Outputs</p>
                   <p className="text-2xl font-black text-white">440 <span className="text-[10px] text-green-500 font-bold ml-1">+12%</span></p>
                 </div>
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                   <p className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-1">Tokens Consumed</p>
                   <p className="text-2xl font-black text-white">1.2M <span className="text-[10px] text-red-500 font-bold ml-1">+40%</span></p>
                 </div>
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                   <p className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-1">Senate Blocked</p>
                   <p className="text-2xl font-black text-white">3 <span className="text-[10px] text-white/50 font-medium ml-1">Brand safety</span></p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtext, icon, color, bg, border }: { title: string, value: string, subtext: string, icon: React.ReactNode, color: string, bg: string, border: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl border ${border} ${bg} flex flex-col backdrop-blur-md shadow-xl relative overflow-hidden`}
    >
      <div className={`absolute -right-4 -top-4 opacity-10 scale-150 ${color}`}>{icon}</div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 bg-black/20 ${color}`}>
        {icon}
      </div>
      <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">{title}</h4>
      <p className="text-3xl font-display font-black text-white mb-2">{value}</p>
      <p className="text-[9px] uppercase font-bold tracking-widest text-white/30">{subtext}</p>
    </motion.div>
  );
}

function LogItem({ time, agent, text, type }: { time: string, agent: string, text: string, type: 'success' | 'info' | 'user' }) {
  const getColor = () => {
    if (type === 'success') return 'text-green-500 bg-green-500/10 border-green-500/20';
    if (type === 'user') return 'text-neural-purple bg-neural-purple/10 border-neural-purple/20';
    return 'text-neural-blue bg-neural-blue/10 border-neural-blue/20';
  };

  return (
    <div className="flex gap-4 group">
      <div className="w-12 text-right pt-1 shrink-0">
        <span className="text-[9px] font-mono text-white/30">{time}</span>
      </div>
      <div className="relative flex flex-col items-center">
        <div className="w-px h-full bg-white/5 absolute top-0 bottom-0" />
        <div className={`w-2.5 h-2.5 rounded-full z-10 mt-1.5 ${type === 'success' ? 'bg-green-500' : type === 'user' ? 'bg-neural-purple' : 'bg-neural-blue'} shadow-[0_0_10px_currentColor]`} />
      </div>
      <div className={`flex-1 p-3 rounded-xl border backdrop-blur-sm ${getColor()} transition-colors`}>
         <div className="flex items-center justify-between mb-1">
           <span className="text-[9px] font-black uppercase tracking-widest opacity-70">{agent}</span>
         </div>
         <p className="text-xs font-medium text-white/90 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
