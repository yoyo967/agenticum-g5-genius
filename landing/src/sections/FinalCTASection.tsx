import React from 'react';
import { useNavigate } from 'react-router-dom';

export const FinalCTASection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section id="final-cta" className="py-40 px-6 bg-[#030009] relative overflow-hidden">
      {/* Glow Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono">Maximum Excellence</span>
        <h2 className="text-6xl md:text-7xl font-black text-white mt-6 leading-none uppercase">
          INITIALIZE<br />
          <span className="text-cyan-400">THE FUTURE.</span>
        </h2>
        <p className="text-slate-400 mt-8 text-lg font-mono max-w-2xl mx-auto leading-relaxed">
          Five specialized AI agents. One voice command. Autonomous publishing.
          EU-first compliance. Perfect Twin audit trail.
          This is not a tool. This is an organism.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/os?module=campaign')}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-10 py-5 rounded-xl text-lg transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
          >
            Initialize Swarm →
          </button>
          <button
            onClick={() => navigate('/os')}
            className="bg-white/5 hover:bg-white/10 text-white font-bold px-10 py-5 rounded-xl text-lg transition-all border border-white/10"
          >
            Enter OS Portal
          </button>
        </div>
      </div>
    </section>
  );
};
