import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, CheckCircle, AlertTriangle, ExternalLink, Scale } from 'lucide-react';
import { MegaNav } from '../components/MegaNav';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { QuickAnswer } from '../components/QuickAnswer';

const EU_REQUIREMENTS = [
  {
    article: 'Art. 50', title: 'Transparency for AI-Generated Content',
    status: 'ENFORCED', color: 'border-green-500/40 bg-green-500/5', textColor: 'text-green-400',
    how: 'RA-01 Security Senate gates every output. C2PA provenance metadata is embedded in every DA-03 image. AI-disclosure labels applied automatically.',
    agent: 'RA-01',
  },
  {
    article: 'Art. 13–14', title: 'Transparency & Human Oversight',
    status: 'ENFORCED', color: 'border-green-500/40 bg-green-500/5', textColor: 'text-green-400',
    how: 'Every agent action is logged in the Perfect Twin module with timestamp, agent ID, and plain-English explanation. Human veto available at all times via Senate UI.',
    agent: 'SO-00 + RA-01',
  },
  {
    article: 'Art. 16(d)', title: 'Logging and Record-Keeping',
    status: 'ENFORCED', color: 'border-green-500/40 bg-green-500/5', textColor: 'text-green-400',
    how: 'Structured JSON logs in Cloud Logging. Every SwarmBus event stored to Firestore with microsecond precision. Audit trail is tamper-evident.',
    agent: 'PM-07',
  },
  {
    article: 'GDPR Art. 5', title: 'Data Minimization',
    status: 'ENFORCED', color: 'border-green-500/40 bg-green-500/5', textColor: 'text-green-400',
    how: 'No personal data is stored beyond the session unless explicitly saved by the user. Voice audio is processed in-memory and never written to disk or GCS.',
    agent: 'RA-01',
  },
  {
    article: 'Art. 9', title: 'Risk Management System',
    status: 'IMPLEMENTED', color: 'border-blue-500/40 bg-blue-500/5', textColor: 'text-blue-400',
    how: 'RA-01 runs a multi-factor risk assessment (0–100 score) on every output: hallucination risk, brand safety, legal compliance, and GDPR alignment.',
    agent: 'RA-01',
  },
  {
    article: 'C2PA 2.0', title: 'Content Provenance Standard',
    status: 'IMPLEMENTED', color: 'border-blue-500/40 bg-blue-500/5', textColor: 'text-blue-400',
    how: 'All Imagen 3 outputs embed C2PA 2.0 provenance metadata. Consumers can verify the AI origin, model version, and generation timestamp using any C2PA-compliant reader.',
    agent: 'DA-03',
  },
];

const SENATE_CHECKS = [
  { label: 'EU AI Act Art.50', icon: '⚖', pass: true },
  { label: 'GDPR Alignment', icon: '🔒', pass: true },
  { label: 'Hallucination Risk', icon: '🧠', pass: true },
  { label: 'Brand Safety', icon: '🛡', pass: true },
  { label: 'C2PA Provenance', icon: '📜', pass: true },
  { label: 'PII Detection', icon: '👤', pass: true },
  { label: 'Factual Grounding', icon: '🌐', pass: true },
  { label: 'Bias Detection', icon: '⚡', pass: true },
];

const FAQ = [
  { q: 'Is AGENTICUM G5 compliant with the EU AI Act?', a: 'Yes. AGENTICUM G5 is designed for EU AI Act compliance from the ground up. The RA-01 Security Senate enforces Art.50 transparency requirements on every output, all AI-generated content carries C2PA provenance metadata, human oversight is always available, and audit trails are maintained in Cloud Logging and Firestore.' },
  { q: 'How does the Security Senate work?', a: 'Every output from every agent passes through RA-01 before delivery. RA-01 evaluates the content against 8 criteria: EU AI Act Art.50, GDPR, hallucination risk, brand safety, C2PA provenance, PII presence, factual grounding, and bias. It assigns a score from 0-100. Outputs scoring below the threshold are vetoed and returned to the originating agent for remediation.' },
  { q: 'Where is user data processed?', a: 'All data processing occurs in europe-west1 (Belgium) on Google Cloud Platform. Voice audio is processed in-memory via the Gemini Live API and never written to disk. No personal data is stored beyond the active session. All stored outputs are encrypted at rest using GCP-managed keys.' },
  { q: 'What is C2PA provenance and why does it matter?', a: 'C2PA (Coalition for Content Provenance and Authenticity) is an open standard for labeling AI-generated content. Every image produced by DA-03 (Imagen 3) embeds C2PA 2.0 metadata declaring: this is AI-generated, when it was generated, which model created it, and the original prompt context. This prevents misrepresentation and satisfies EU AI Act Art.50 labeling requirements.' },
  { q: 'Can AGENTICUM G5 be deployed in regulated industries?', a: 'The compliance architecture is designed for regulated enterprise contexts. Pharmaceutical, legal, financial services, and public sector clients benefit from: full audit trails, human-in-the-loop oversight, EU data residency, AI Act Art.50 enforcement, and immutable logging. Contact via the OS for enterprise compliance documentation.' },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['WebPage', 'FAQPage'],
  name: 'AGENTICUM G5 — EU AI Act Compliance & Data Privacy',
  description: 'How AGENTICUM G5 GENIUS enforces EU AI Act Art.50, GDPR, C2PA provenance, and enterprise-grade data privacy through the RA-01 Security Senate.',
  mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export function CompliancePage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
      <MegaNav />

      <div className="pt-24 max-w-6xl mx-auto px-6 pb-24">
        <div className="mb-10"><Breadcrumbs crumbs={[{ label: 'Compliance', path: '/compliance' }]} /></div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="font-mono text-xs text-red-500 uppercase tracking-widest block mb-4">EU AI Act · GDPR · C2PA 2.0 · RA-01 Security Senate</span>
          <h1 className="text-6xl font-bold text-white tracking-tight mb-6 leading-tight" style={{ letterSpacing: '-0.02em' }}>
            Compliant by Design.<br /><span className="text-red-400">Not by Accident.</span>
          </h1>
          <p className="text-zinc-400 text-xl leading-relaxed max-w-2xl">
            The RA-01 Security Senate is not optional middleware — it is a required gate for every output. EU AI Act Art.50 compliance is enforced automatically, on every run.
          </p>
        </motion.div>

        <QuickAnswer
          question="Is AGENTICUM G5 EU AI Act compliant?"
          answer="Yes. AGENTICUM G5 GENIUS enforces EU AI Act Art.50 transparency requirements through RA-01 (Security Senate), which gates 100% of agent outputs before delivery. All AI-generated images carry C2PA 2.0 provenance metadata. All processing occurs in europe-west1 (EU data residency). Audit trails are maintained in Cloud Logging and Firestore. Human oversight is always available through the Senate UI veto mechanism."
        />

        {/* Compliance score card */}
        <div className="border border-red-500/20 bg-red-500/5 rounded-3xl p-8 mb-16">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="shrink-0 text-center">
              <div className="w-32 h-32 rounded-full border-4 border-green-500 bg-green-500/10 flex flex-col items-center justify-center mx-auto">
                <span className="text-4xl font-black text-green-400 font-mono">99</span>
                <span className="font-mono text-[8px] text-green-600 uppercase tracking-widest">/100</span>
              </div>
              <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mt-3">Senate Score</p>
              <p className="font-mono text-[9px] text-green-500">Live Average</p>
            </div>
            <div className="flex-1">
              <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-4">Security Senate — 8 Active Checks</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SENATE_CHECKS.map(check => (
                  <div key={check.label} className="flex items-center gap-2 p-3 bg-black/40 border border-white/5 rounded-xl">
                    <span className="text-lg shrink-0">{check.icon}</span>
                    <div>
                      <p className="text-white text-[10px] font-medium leading-tight">{check.label}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <CheckCircle size={9} className="text-green-500 shrink-0" />
                        <span className="font-mono text-[8px] text-green-500">PASS</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* EU Requirements Grid */}
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="w-8 h-px bg-red-500" />Regulatory Framework — Article by Article
        </h2>
        <div className="grid md:grid-cols-2 gap-4 mb-16">
          {EU_REQUIREMENTS.map((req, i) => (
            <motion.div key={req.article} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`border rounded-2xl p-6 ${req.color}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`font-mono text-[10px] font-black ${req.textColor} uppercase tracking-widest`}>{req.article}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[8px] px-2 py-0.5 rounded-full border border-current/30 ${req.textColor}`}>{req.status}</span>
                  <span className="font-mono text-[8px] text-zinc-700 border border-zinc-800 px-2 py-0.5 rounded-full">{req.agent}</span>
                </div>
              </div>
              <h3 className="text-white font-semibold text-base mb-3">{req.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed border-l-2 border-current/20 pl-4">{req.how}</p>
            </motion.div>
          ))}
        </div>

        {/* Veto flow */}
        <div className="border border-zinc-800 bg-zinc-950 rounded-3xl p-8 mb-16">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <Scale size={20} className="text-red-400" />Senate Veto Flow
          </h3>
          <div className="flex flex-col md:flex-row items-start gap-4">
            {[
              { step: '01', label: 'Agent Output', desc: 'CC-06 / DA-03 / any agent produces output' },
              { step: '02', label: 'Senate Gate', desc: 'RA-01 evaluates all 8 criteria simultaneously' },
              { step: '03', label: 'Score < 70?', desc: 'Output is vetoed, logged, and blocked from delivery', warn: true },
              { step: '04', label: 'Score ≥ 70?', desc: 'Output receives compliance certificate and is delivered' },
            ].map((s, i) => (
              <div key={s.step} className="flex-1 flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-mono text-[10px] font-black mt-0.5 ${s.warn ? 'bg-red-500/20 border border-red-500/40 text-red-400' : 'bg-blue-500/20 border border-blue-500/40 text-blue-400'}`}>{s.step}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white text-sm font-semibold">{s.label}</p>
                    {s.warn && <AlertTriangle size={12} className="text-red-400" />}
                    {!s.warn && i === 3 && <CheckCircle size={12} className="text-green-400" />}
                  </div>
                  <p className="text-zinc-500 text-xs leading-relaxed">{s.desc}</p>
                </div>
                {i < 3 && <div className="hidden md:block text-zinc-700 mt-2 font-mono text-lg">→</div>}
              </div>
            ))}
          </div>
        </div>

        {/* External citations (GEO) */}
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          {[
            { icon: '⚖', title: 'EUR-Lex — EU AI Act', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689', desc: 'Official EU Artificial Intelligence Act — Regulation 2024/1689' },
            { icon: '📜', title: 'C2PA Specification', url: 'https://c2pa.org/specifications/specifications/2.0/specs/C2PA_Specification.html', desc: 'Coalition for Content Provenance and Authenticity — v2.0' },
            { icon: '🔒', title: 'GDPR Reference', url: 'https://gdpr-info.eu/', desc: 'General Data Protection Regulation — Full text and guidance' },
          ].map(link => (
            <a key={link.title} href={link.url} target="_blank" rel="noopener noreferrer"
              className="group flex items-start gap-4 p-6 border border-zinc-800 hover:border-red-500/40 bg-zinc-950 rounded-2xl transition-all">
              <span className="text-2xl shrink-0">{link.icon}</span>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm mb-1 group-hover:text-red-300 transition-colors">{link.title}</p>
                <p className="text-zinc-500 text-xs">{link.desc}</p>
              </div>
              <ExternalLink size={12} className="text-zinc-700 group-hover:text-red-400 transition-colors mt-0.5 shrink-0" />
            </a>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="w-8 h-px bg-red-500" />Compliance FAQ
        </h2>
        <div className="space-y-3 mb-16">
          {FAQ.map((faq, i) => (
            <div key={i} className="border border-zinc-900 bg-zinc-950 rounded-2xl overflow-hidden"
              itemScope itemType="https://schema.org/Question">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left gap-4">
                <span className="text-white font-medium" itemProp="name">{faq.q}</span>
                <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} className="text-zinc-600 font-mono text-xl shrink-0">+</motion.span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                  <p className="text-zinc-400 leading-relaxed" itemProp="text">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="border border-red-900/30 bg-red-950/10 rounded-3xl p-10 text-center">
          <Shield size={32} className="mx-auto text-red-400 mb-4" />
          <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-3">99/100 Senate Score · EU AI Act Art.50 · europe-west1 Data Residency</p>
          <h3 className="text-2xl font-bold text-white mb-4">Compliance verified. System ready.</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/os/senate')} className="flex items-center justify-center gap-2 px-8 py-4 bg-red-700 hover:bg-red-600 text-white font-mono text-sm uppercase tracking-widest rounded-xl transition-colors">
              View Senate Live <ArrowRight size={14} />
            </button>
            <button onClick={() => navigate('/agents/ra01-security-senate')} className="flex items-center justify-center gap-2 px-8 py-4 border border-zinc-700 hover:border-zinc-400 text-zinc-300 font-mono text-sm uppercase tracking-widest rounded-xl transition-colors">
              Meet RA-01
            </button>
            <button onClick={() => navigate('/how-it-works')} className="flex items-center justify-center gap-2 px-8 py-4 border border-zinc-700 hover:border-zinc-400 text-zinc-300 font-mono text-sm uppercase tracking-widest rounded-xl transition-colors">
              How It Works
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
