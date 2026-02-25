import React, { useState } from 'react';

const MOCK_INTEL = [
  { competitor: "AnalyticaInvestor", url: "analyticainvestor.com/robo-billions", status: "DECOMPILED", threat: 74, h2: ["What are humanoid robots?", "Top 5 Robotics Stocks 2026", "How to invest?"] },
  { competitor: "RoboReport.io", url: "roboreport.io/humanoid-market-2026", status: "DECOMPILED", threat: 61, h2: ["Market Size 2026", "Figure AI vs Boston Dynamics", "Investment Risks"] },
  { competitor: "TechAlpha.com", url: "techalpha.com/ai-robotics-stocks", status: "NEW", threat: 88, h2: [] },
];

export const ColumnaRadarSection: React.FC = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="columna-demo" className="py-32 px-6 bg-midnight-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-mono">Columna · Zero-Day Intelligence</span>
          <h2 className="text-5xl font-black text-white mt-4">THE RADAR.</h2>
          <p className="text-slate-400 mt-4 font-mono text-sm max-w-2xl mx-auto">
            SP-01 monitors competitor sitemaps 24/7. The moment they publish,
            our Counter-Strike deploys a superior cluster. We don't react to the market.
            We make competitors react to us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Intel Feed */}
          <div className="bg-[#0a0118] border border-amber-900/30 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-amber-900/20 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">Live Intel Feed</span>
            </div>
            <div className="p-4 space-y-3">
              {MOCK_INTEL.map((intel, i) => (
                <div
                  key={i}
                  onClick={() => setActive(i)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    active === i
                      ? 'border-amber-500/60 bg-amber-900/10'
                      : 'border-slate-800/50 bg-black/20 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-white font-bold text-sm">{intel.competitor}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                      intel.status === 'NEW'
                        ? 'text-rose-300 border-rose-900/50 bg-rose-900/20'
                        : 'text-emerald-300 border-emerald-900/50 bg-emerald-900/20'
                    }`}>
                      {intel.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono truncate">{intel.url}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">ThreatScore:</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${intel.threat > 75 ? 'bg-rose-500' : 'bg-amber-500'}`}
                        style={{ width: `${intel.threat}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-mono ${intel.threat > 75 ? 'text-rose-400' : 'text-amber-400'}`}>
                      {intel.threat}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Skeleton Viewer */}
          <div className="bg-[#0a0118] border border-indigo-900/30 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-indigo-900/20">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
                Decompiled H2 Skeleton — {MOCK_INTEL[active].competitor}
              </span>
            </div>
            <div className="p-5">
              {MOCK_INTEL[active].h2.length > 0 ? (
                <>
                  <div className="space-y-2 mb-6 text-white/70">
                    {MOCK_INTEL[active].h2.map((h, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-slate-800/50">
                        <span className="text-slate-600 font-mono text-xs">H2</span>
                        <span className="text-slate-300 text-sm">{h}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-3 px-4 rounded-xl text-sm transition-all">
                    COUNTER-STRIKE: Generate Superior Cluster →
                  </button>
                </>
              ) : (
                <div className="text-amber-400 text-sm font-mono animate-pulse p-4 text-center">
                  ⚡ NEW THREAT DETECTED — Decompiler running...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
