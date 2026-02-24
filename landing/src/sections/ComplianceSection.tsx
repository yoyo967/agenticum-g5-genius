import React from 'react';

const pillars = [
  {
    badge: "EU AI Act · Art. 50",
    icon: "🇪🇺",
    title: "Machine-Readable Transparency",
    desc: "Every AI-generated asset is auto-labeled with C2PA-ready meta-tags and a human-readable disclaimer. Perfect Twin provides the full audit trail for any authority.",
    items: ["<meta name='ai-generated' content='true'>", "Model version logged per sentence", "Perfect Twin Glass Box Mode", "Audit export on demand"]
  },
  {
    badge: "GDPR · Privacy by Design",
    icon: "🔒",
    title: "Zero-Cookie Default",
    desc: "Generated pages load zero trackers before consent. Local font bundling. Auto-generated Imprint and Privacy Policy per page. TCF v2.2 Consent Banner.",
    items: ["No external fonts (zero leakage)", "Auto-Imprint generation", "Auto-Privacy Policy", "TCF v2.2 Cookie Banner"]
  },
  {
    badge: "EAA 2025 · WCAG 2.1 AA",
    icon: "♿",
    title: "Accessibility Enforced by Senate",
    desc: "Lighthouse CI runs on every draft. Score below 95/100 triggers an automatic Senate Veto. Gemini Vision generates alt-text for every image. Semantic HTML enforced.",
    items: ["Lighthouse Score ≥ 95/100", "Gemini Vision auto-alt-text", "Semantic <nav><main><article>", "ARIA labels enforced by Code Agent"]
  }
];

export const ComplianceSection: React.FC = () => (
  <section id="compliance-demo" className="py-32 px-6 bg-[#050010]">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono">EU-First · Maximum Excellence</span>
        <h2 className="text-5xl font-black text-white mt-4">COMPLIANCE ENGINE.</h2>
        <p className="text-slate-400 mt-4 font-mono text-sm max-w-2xl mx-auto">
          The Americans build fast. We build legally unassailable.
          EU AI Act, GDPR and EAA 2025 are not checkboxes — they are
          algorithmic quality gates enforced by our Senate before every publish.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map(p => (
          <div key={p.badge} className="bg-[#0a0118] border border-indigo-900/40 rounded-2xl p-6 hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{p.icon}</span>
              <span className="text-[10px] bg-emerald-900/30 text-emerald-400 border border-emerald-900/40 px-2 py-1 rounded font-mono uppercase">
                {p.badge}
              </span>
            </div>
            <h3 className="text-white font-bold text-lg mb-3">{p.title}</h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">{p.desc}</p>
            <ul className="space-y-1">
              {p.items.map(item => (
                <li key={item} className="text-xs font-mono text-cyan-400/70 flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);
