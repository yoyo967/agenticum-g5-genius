import React from 'react';

export const DemoVideoSection: React.FC = () => (
  <section id="demo" className="py-32 px-6 bg-[#030009]">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono">
          Hackathon Submission · Demo Video
        </span>
        <h2 className="text-5xl font-black text-white mt-4">SEE IT LIVE.</h2>
        <p className="text-slate-400 mt-4 font-mono text-sm max-w-xl mx-auto">
          Under 4 minutes. Real software. No mockups. 
          Voice directive in — EU-compliant advertorial out.
        </p>
      </div>

        {/* Video Placeholder - Ultra Professional */}
        <div className="relative rounded-2xl overflow-hidden border border-indigo-900/40 shadow-2xl shadow-purple-900/20 bg-black aspect-video flex items-center justify-center group cursor-pointer">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-900/20 to-transparent pointer-events-none" />
          <div className="flex flex-col items-center gap-4">
             <div className="w-20 h-20 rounded-full border border-accent/20 flex items-center justify-center group-hover:bg-accent/5 transition-colors">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                   <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-accent border-b-8 border-b-transparent ml-1" />
                </div>
             </div>
             <div className="text-center">
                <div className="text-white font-display font-black text-2xl tracking-tighter uppercase italic">Agenticum G5 Official Trailer</div>
                <div className="text-slate-500 text-xs font-mono uppercase tracking-widest mt-1">Awaiting Transmission Sync // Available Globally Q1 2026</div>
             </div>
          </div>
        </div>

      {/* Proof of GCP Deployment */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: "☁️", label: "Cloud Run", val: "genius-backend · europe-west1" },
          { icon: "🗄️", label: "Firestore", val: "perfect_twin_logs · columna_intelligence" },
          { icon: "🚀", label: "Firebase Hosting", val: "online-marketing-manager.web.app" },
        ].map(item => (
          <div key={item.label} className="bg-[#0a0118] border border-green-900/30 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="text-green-400 font-bold text-sm">{item.label}</div>
            <div className="text-slate-500 text-xs font-mono mt-1">{item.val}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
