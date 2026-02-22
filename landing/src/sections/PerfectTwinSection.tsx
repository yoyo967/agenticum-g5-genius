import React, { useState } from 'react';

const MOCK_TWIN = {
  run_id: "run_a7f3c891d2",
  directive: "Generate Pillar: Humanoid Robotics Investment 2026",
  model: "gemini-1.5-pro-002",
  timestamp: "2026-02-22T18:44:02Z",
  search_queries: [
    "humanoid robots market size 2026",
    "Figure AI valuation funding round",
    "Boston Dynamics Atlas commercial"
  ],
  sources: [
    "reuters.com/technology/robotics-2026",
    "techcrunch.com/figure-ai-series-b",
    "bloomberg.com/humanoid-robot-market"
  ],
  senate: {
    compliance_score: 98,
    seo_score: 97,
    wcag_score: 98,
    approved: true
  }
};

export const PerfectTwinSection: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <section id="perfect-twin-demo" className="py-32 px-6 bg-[#030009]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-blue-400 font-mono">Glass Box Mode · Audit Trail</span>
          <h2 className="text-5xl font-black text-white mt-4">PERFECT TWIN.</h2>
          <p className="text-slate-400 mt-4 font-mono text-sm max-w-xl mx-auto">
            Every agent action, every grounding source, every Senate verdict —
            logged immutably in Firestore. Click any content block. See the machine's thinking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left: Generated Content Preview */}
          <div className="bg-[#0a0118] border border-indigo-900/40 rounded-2xl p-6">
            <div className="text-xs text-slate-500 font-mono mb-4 uppercase">Generated Pillar Block</div>
            <div
              onClick={() => setOpen(true)}
              className="cursor-pointer border border-cyan-900/30 rounded-xl p-4 hover:border-cyan-500/50 transition-all group"
            >
              <h3 className="text-white font-bold mb-2">
                The $38B Humanoid Robotics Market: Why 2026 Is the Inflection Point
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                According to verified market data from Reuters and Bloomberg, the global
                humanoid robotics sector is projected to reach $38 billion by 2030,
                driven by Figure AI's recent Series B and Boston Dynamics' commercial expansion...
              </p>
              <div className="mt-3 text-xs text-cyan-400 font-mono group-hover:text-cyan-300 transition-colors">
                → Click to open Perfect Twin Audit
              </div>
            </div>
          </div>

          {/* Right: Twin Inspector */}
          {open ? (
            <div className="bg-[#0a0118] border border-cyan-500/40 rounded-2xl overflow-hidden shadow-xl shadow-cyan-900/20">
              <div className="flex items-center justify-between p-4 border-b border-indigo-900/40 bg-[#0d0221]">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-cyan-400">Glass Box Mode</div>
                  <div className="text-white font-bold text-sm mt-1">Perfect Twin Audit</div>
                </div>
                <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white text-xs">✕ Close</button>
              </div>

              <div className="p-4 space-y-4 font-mono text-xs text-white/70">
                <div>
                  <div className="text-slate-500 uppercase mb-1">Run ID</div>
                  <div className="text-cyan-300">{MOCK_TWIN.run_id}</div>
                </div>
                <div>
                  <div className="text-slate-500 uppercase mb-1">Google Search Queries</div>
                  {MOCK_TWIN.search_queries.map(q => (
                    <div key={q} className="text-cyan-300">» "{q}"</div>
                  ))}
                </div>
                <div>
                  <div className="text-slate-500 uppercase mb-1">Verified Sources</div>
                  {MOCK_TWIN.sources.map(s => (
                    <div key={s} className="text-emerald-400">✓ {s}</div>
                  ))}
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between">
                   <div>
                     <div className="text-slate-500 uppercase mb-1">Senate Score</div>
                     <div className="text-xl font-bold text-white">{MOCK_TWIN.senate.compliance_score}/100</div>
                   </div>
                   <div className="text-right">
                     <div className="text-slate-500 uppercase mb-1">Status</div>
                     <div className="text-emerald-400 font-bold uppercase tracking-widest">APPROVED</div>
                   </div>
                </div>
              </div>
            </div>
          ) : (
             <div className="bg-[#0a0118] border border-indigo-900/10 rounded-2xl p-6 h-64 flex items-center justify-center border-dashed">
                <p className="text-slate-600 font-mono text-xs text-center px-10 italic">
                   The machine is silent. Select a content block to reveal the provenance matrix.
                </p>
             </div>
          )}
        </div>
      </div>
    </section>
  );
};
