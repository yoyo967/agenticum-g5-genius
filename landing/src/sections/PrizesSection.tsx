import React from 'react';

const prizes = [
  { rank: "Grand Prize", amount: "$25,000", extras: ["$3,000 GCP Credits", "Google Cloud Next 2026 Tickets", "Travel Stipend Las Vegas", "Demo Slot at Google Cloud Next"], color: "from-amber-500 to-yellow-400", glow: "shadow-amber-500/20" },
  { rank: "Best Creative Storyteller", amount: "$10,000", extras: ["$1,000 GCP Credits", "Google Cloud Next 2026 Tickets", "Virtual Coffee: Google Team"], color: "from-cyan-500 to-blue-500", glow: "shadow-cyan-500/20" },
  { rank: "Best Technical Architecture", amount: "$5,000", extras: ["$500 GCP Credits", "Recognition by Google Engineers"], color: "from-purple-500 to-indigo-500", glow: "shadow-purple-500/20" },
];

export const PrizesSection: React.FC = () => (
  <section id="prizes" className="py-32 px-6 bg-[#050010]">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-mono">Gemini Live Agent Challenge 2026</span>
        <h2 className="text-5xl font-black text-white mt-4">$80,000 IN PRIZES.</h2>
        <p className="text-slate-400 mt-4 font-mono text-sm">
          We are competing in all three tracks. Our architecture is built to win.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {prizes.map(p => (
          <div key={p.rank} className={`bg-[#0a0118] border border-indigo-900/40 rounded-2xl p-6 shadow-xl ${p.glow}`}>
            <div className={`text-3xl font-black bg-gradient-to-r ${p.color} bg-clip-text text-transparent mb-2`}>
              {p.amount}
            </div>
            <div className="text-white font-bold text-sm mb-4">{p.rank}</div>
            <ul className="space-y-1">
              {p.extras.map(e => (
                <li key={e} className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="text-emerald-500">+</span> {e}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="text-slate-500 text-xs font-mono">Deadline: 17. März 2026 @ 01:00 CET · 22 days remaining</div>
        <div className="mt-2">
          <div className="inline-block bg-[#0a0118] border border-indigo-900/40 rounded-full px-4 py-2 text-xs font-mono text-slate-400">
            2489 participants · We are building to win.
          </div>
        </div>
      </div>
    </div>
  </section>
);
