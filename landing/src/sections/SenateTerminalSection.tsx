import React, { useEffect, useState } from 'react';

const SENATE_LOGS = [
  { time: "00:00.021", agent: "SN00", msg: "Directive received. Initializing Pillar Graph Engine...", status: "ok" },
  { time: "00:00.890", agent: "GROUNDING", msg: "Google Search Grounding activated. Querying: 'humanoid robotics 2026'", status: "ok" },
  { time: "00:02.140", agent: "GROUNDING", msg: "12 verified sources found. Entity graph built. Hallucination risk: 0%", status: "ok" },
  { time: "00:04.330", agent: "COLUMNA", msg: "Competitor sitemap delta detected: analyticainvestor.com +1 new page", status: "warn" },
  { time: "00:05.100", agent: "COLUMNA", msg: "Decompiler: H1-H3 skeleton extracted. 18 headings. ThreatScore: 74/100", status: "warn" },
  { time: "00:08.220", agent: "PILLAR", msg: "Counter-Strike initiated. Generating superior cluster with 22 H2 nodes...", status: "ok" },
  { time: "00:18.440", agent: "SENATE", msg: "SEO Excellence Score: 97/100. EU AI Act compliance: PASS.", status: "ok" },
  { time: "00:19.110", agent: "SENATE", msg: "WCAG Lighthouse Audit running... Score: 98/100. APPROVED.", status: "ok" },
  { time: "00:19.880", agent: "DEPLOY", msg: "Firebase Hosting REST API: publishing to global cluster...", status: "ok" },
  { time: "00:20.003", agent: "DEPLOY", msg: "✓ LIVE: https://promo.client.com — Maximum Excellence achieved.", status: "success" },
];

export const SenateTerminalSection: React.FC = () => {
  const [visibleLogs, setVisibleLogs] = useState<typeof SENATE_LOGS>([]);
  const [running, setRunning] = useState(false);

  const startSimulation = () => {
    setVisibleLogs([]);
    setRunning(true);
  };

  useEffect(() => {
    if (!running) return;
    
    const timer = setTimeout(() => {
      if (visibleLogs.length >= SENATE_LOGS.length) { 
        setRunning(false); 
      } else {
        setVisibleLogs(prev => [...prev, SENATE_LOGS[prev.length]]);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [running, visibleLogs]);

  const statusColor = (s: string) =>
    s === "success" ? "text-emerald-400" : s === "warn" ? "text-amber-400" : "text-cyan-400";

  return (
    <section id="senate-demo" className="py-32 px-6 bg-[#030009]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-purple-400 font-mono">Live Simulation</span>
          <h2 className="text-5xl font-black text-white mt-4">SENATE TERMINAL.</h2>
          <p className="text-slate-400 mt-4 font-mono text-sm max-w-xl mx-auto">
            Watch the Algorithmic Senate govern every output in real-time.
            EU AI Act. GDPR. WCAG. All enforced before publish.
          </p>
        </div>

        <div className="bg-black rounded-2xl border border-indigo-900/50 overflow-hidden shadow-2xl shadow-purple-900/20">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-indigo-900/40 bg-[#0a0118]">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="ml-3 text-xs font-mono text-slate-500">
              agenticum-g5 · senate-terminal · GenIUS-backend · cloud-run
            </span>
          </div>

          {/* Terminal Body */}
          <div className="p-6 font-mono text-sm min-h-[380px]">
            {visibleLogs.length === 0 && !running && (
              <div className="text-slate-600 text-xs">
                $ awaiting directive...<span className="animate-pulse">_</span>
              </div>
            )}
            {visibleLogs.map((log, i) => (
              <div key={i} className="flex gap-3 mb-1">
                <span className="text-slate-600 shrink-0">[{log.time}]</span>
                <span className="text-purple-400 shrink-0 w-20">{log.agent}</span>
                <span className={statusColor(log.status)}>{log.msg}</span>
              </div>
            ))}
            {running && (
              <div className="text-slate-500 mt-1 animate-pulse text-xs">
                processing...<span className="ml-1">_</span>
              </div>
            )}
          </div>

          {/* Terminal Footer */}
          <div className="px-6 pb-6">
            <div className="flex justify-between items-center">
              <button
                onClick={startSimulation}
                disabled={running}
                className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold px-6 py-3 rounded-lg text-sm transition-all"
              >
                {running ? "RUNNING..." : "▶ SIMULATE PILLAR RUN"}
              </button>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle text-emerald-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                  EU AI Act
                </span>
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle text-emerald-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                  WCAG 2.2
                </span>
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle text-emerald-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                  GDPR
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
