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

      {/* Video Embed Placeholder — replace VIDEO_ID with your YouTube ID */}
      <div className="relative rounded-2xl overflow-hidden border border-indigo-900/40 shadow-2xl shadow-purple-900/20 bg-black aspect-video">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/VIDEO_ID"
          title="AGENTICUM G5 — Gemini Live Agent Challenge Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {/* Fallback Overlay if no video is set */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0118] border border-dashed border-indigo-900/40">
          <div className="text-6xl mb-4 text-white/20">▶</div>
          <div className="text-white font-bold text-xl mb-2">Demo Video</div>
          <div className="text-slate-400 text-sm font-mono">
            Upload to YouTube → replace VIDEO_ID in DemoVideoSection.tsx
          </div>
          <div className="mt-4 text-xs text-slate-600 font-mono">
            Required: &lt;4min · Real software · GCP Cloud deployment proof
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
