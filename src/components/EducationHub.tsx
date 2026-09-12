import React, { useState } from "react";
import { BookOpen, ShieldAlert, CheckCircle2, HelpCircle, ChevronDown, ChevronUp, Lock, Eye, AlertOctagon } from "lucide-react";

export const EducationHub: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is Typosquatting and how does PhisherFinder catch it?",
      a: "Typosquatting (URL hijacking) occurs when attackers register domains with deliberate misspellings of popular websites (e.g., paypa1.com, amzn-security.com, gooogle.com). PhisherFinder runs Levenshtein edit-distance algorithms and token decomposition against an extensive database of global financial, tech, and retail brands to pinpoint lookalikes before you enter credentials.",
    },
    {
      q: "What is an IDN Homograph attack?",
      a: "Homograph attacks replace Latin letters with visually indistinguishable characters from other scripts like Cyrillic or Greek (for instance, replacing Latin 'a' (U+0061) with Cyrillic 'а' (U+0430)). While the URL looks identical on your screen, the browser navigates to a completely distinct rogue server. PhisherFinder parses internationalized punycode and Unicode code points to flag disguised characters.",
    },
    {
      q: "Why isn't HTTPS alone a guarantee that a site is safe?",
      a: "HTTPS only means the connection between your browser and the remote server is encrypted against eavesdropping. It does NOT mean the entity operating the server is honest! Today, over 80% of phishing kits use free SSL certificates (such as Let's Encrypt). PhisherFinder looks beyond SSL to evaluate domain age, TLD risk, behavioral heuristics, and redirection chains.",
    },
    {
      q: "What is Smishing and Quishing?",
      a: "Smishing is phishing delivered via SMS or text messages (often claiming missed postal deliveries, unpaid tolls, or bank account freezes). Quishing uses deceptive QR codes in physical flyers or emails to bypass email gateway URL filters. Always scan SMS links and decoded QR URLs in PhisherFinder before interacting.",
    },
    {
      q: "Does PhisherFinder store or share my personal data?",
      a: "No. PhisherFinder executes URL telemetry and threat intelligence lookups on domain indicators and URL patterns without storing personal user accounts or identity cookies. Your scan history is stored locally in your browser's private storage.",
    },
  ];

  return (
    <div id="education-hub-container" className="w-full max-w-5xl mx-auto space-y-6">
      {/* Phishing Anatomy Guide */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Cybersecurity Defense Guide</h2>
            <p className="text-xs text-slate-400">
              Understand modern social engineering lures, deceptive link anatomy, and how PhisherFinder protects your identity.
            </p>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertOctagon className="w-4 h-4" />
              <h3 className="text-sm font-bold">1. False Urgency & Panic Triggers</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Phishing campaigns almost always fabricate an urgent deadline ("Your account will be terminated in 24 hours", "Immediate fraud detected", "Unpaid customs fee"). This pressure short-circuits critical thinking.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Eye className="w-4 h-4" />
              <h3 className="text-sm font-bold">2. Subdomain Stacking Deceptions</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Attackers construct URLs like <code className="text-emerald-400 font-mono">paypal.com.verify-user.xyz</code>. Unsuspecting users see "paypal.com" at the beginning, but the real destination domain is <code className="text-amber-300 font-mono">verify-user.xyz</code>.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <Lock className="w-4 h-4" />
              <h3 className="text-sm font-bold">3. The Green Padlock Illusion</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              A padlock icon only guarantees transport encryption, not server legitimacy. Scammers register free SSL certificates in seconds. Never rely solely on HTTPS as a certificate of safety.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
            <div className="flex items-center gap-2 text-purple-400">
              <ShieldAlert className="w-4 h-4" />
              <h3 className="text-sm font-bold">4. Redirect Cloaking & URL Shorteners</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cybercriminals mask malicious links through multi-stage URL shorteners and open redirects. PhisherFinder traces the redirect hops server-side so you never trigger harmful payloads.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive FAQ */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          Frequently Asked Questions About Link Security
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-slate-800 rounded-xl bg-slate-950/70 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs sm:text-sm text-slate-200 hover:text-white transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-900">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
