import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileCheck, Lock, Eye } from 'lucide-react';
import complianceSenate from '../assets/g5_compliance_senate_en_v2_1772174738278.png';

const pillars = [
  {
    badge: "EU AI Act · Art. 50",
    icon: <FileCheck className="text-emerald" />,
    title: "Machine-Readable Transparency",
    desc: "Every AI-generated asset is auto-labeled with C2PA-ready meta-tags and a human-readable disclaimer. Perfect Twin provides the full audit trail for any authority.",
    items: ["AI-generated Content Labels", "Model version verification", "Glass Box Mode protocol", "Audit export on demand"]
  },
  {
    badge: "GDPR · Privacy by Design",
    icon: <Lock className="text-accent" />,
    title: "Zero-Cookie Default",
    desc: "Generated pages load zero trackers before consent. Local font bundling. Auto-generated Imprint and Privacy Policy per page.",
    items: ["No external fonts", "Auto-Imprint generation", "Privacy-First Architecture", "TCF v2.2 Compliant"]
  },
  {
    badge: "Brand Safety",
    icon: <Eye className="text-magenta" />,
    title: "Adversarial Quality Gates",
    desc: "Our Senate reviews every output against brand guidelines and Dark Pattern detection before it hits production.",
    items: ["Lighthouse Score ≥ 95/100", "Dark Pattern Detection", "Automated Senate Veto", "Style-Guide Alignment"]
  }
];

export const ComplianceSection: React.FC = () => (
  <section id="compliance-demo" className="py-40 px-6 bg-midnight/30 border-t border-white/5 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald/5 blur-[120px] rounded-full pointer-events-none" />

    <div className="max-w-[1200px] mx-auto relative z-10">
      <div className="text-center mb-24">
        <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="badge badge-warning mb-6 mx-auto w-fit">
          <ShieldCheck size={10} /> Compliance by Design · RA-01 Senate
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-display font-bold uppercase tracking-tight leading-[0.9] text-white brightness-125 mb-6"
          style={{ fontSize: 'clamp(40px, 6vw, 96px)' }}>
          Der Algorithmus<br />
          <span className="text-emerald">Als Wächter.</span>
        </motion.h2>
        <p className="font-mono text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
          The Americans build fast. We build legally unassailable. 
          EU AI Act, GDPR, and EAA 2025 are not checkboxes — they are 
          algorithmic quality gates.
        </p>
      </div>

      {/* Compliance Senate Visual */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        className="relative rounded-3xl overflow-hidden border border-white/10 shadow-3xl bg-black/60 mb-24 aspect-video">
        <img src={complianceSenate} alt="RA-01 Senate Compliance Engine" className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pillars.map((p, i) => (
          <motion.div 
            key={p.badge} 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 group hover:border-emerald-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                {p.icon}
              </div>
              <span className="text-[9px] bg-emerald-900/10 text-emerald border border-emerald/20 px-3 py-1 rounded font-black tracking-widest uppercase">
                {p.badge}
              </span>
            </div>
            <h3 className="text-white font-black uppercase text-sm mb-4">{p.title}</h3>
            <p className="text-white/40 text-xs font-mono mb-6 leading-relaxed italic">"{p.desc}"</p>
            <ul className="space-y-2">
              {p.items.map(item => (
                <li key={item} className="text-[10px] font-mono text-white/60 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-emerald" /> {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
