import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { ScanReport } from "./components/ScanReport";
import { BatchScanner } from "./components/BatchScanner";
import { ThreatRadar } from "./components/ThreatRadar";
import { EducationHub } from "./components/EducationHub";
import { ScanHistoryDrawer } from "./components/ScanHistoryDrawer";
import { ScanResult } from "./types";
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Clipboard,
  X,
  Loader2,
  AlertTriangle,
  Zap,
  ArrowRight,
  Lock,
  Globe,
  CheckCircle2,
  FileSearch,
  ScanLine
} from "lucide-react";

const STORAGE_KEY = "phisherfinder_scan_history_v1";

const SAMPLE_LINKS = [
  { label: "Legitimate (Wikipedia)", url: "https://wikipedia.org", risk: "safe" },
  { label: "PayPal Typosquat", url: "http://paypa1-security-verification.xyz/login", risk: "phishing" },
  { label: "DHL Delivery Smishing", url: "http://dhl-package-redelivery-fee.top/track", risk: "phishing" },
  { label: "Homograph Lookalike", url: "https://mеtamask.io", risk: "phishing" },
  { label: "Insecure Login Lure", url: "http://secure-login.account-verify.click/auth", risk: "warning" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"scanner" | "batch" | "radar" | "guide">("scanner");
  const [urlInput, setUrlInput] = useState("");
  const [deepAiScan, setDeepAiScan] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStageIndex, setScanStageIndex] = useState(0);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [extractedNotice, setExtractedNotice] = useState<string | null>(null);

  // Inspection stage messages for loading state
  const scanStages = [
    "Analyzing URL structure, scheme & Unicode homoglyphs...",
    "Scanning against target brand database & typosquatting signatures...",
    "Evaluating Top-Level Domain (TLD) risk & Shannon entropy...",
    "Conducting real-time DNS lookup & server infrastructure probe...",
    "Synthesizing Gemini AI threat intelligence & social engineering vectors...",
  ];

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (result: ScanResult) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.normalizedUrl !== result.normalizedUrl);
      const updated = [result, ...filtered].slice(0, 30);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // storage quota exceeded
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  // Helper to extract URL if user pastes a whole SMS or email message
  const extractUrlFromText = (text: string): string => {
    const urlMatch = text.match(/(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:com|org|net|xyz|top|site|click|online|live|io|app|info|me|co|gov|edu)[^\s]*)/i);
    if (urlMatch && urlMatch[0] !== text.trim()) {
      setExtractedNotice(`Detected link in message: ${urlMatch[0]}`);
      setTimeout(() => setExtractedNotice(null), 4000);
      return urlMatch[0];
    }
    return text;
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        const extracted = extractUrlFromText(text);
        setUrlInput(extracted);
      }
    } catch {
      // Clipboard permissions denied
    }
  };

  const handleStartScan = async (targetUrl?: string) => {
    const raw = targetUrl || urlInput;
    if (!raw.trim()) {
      setErrorMessage("Please enter or paste a URL to scan.");
      return;
    }

    const clean = extractUrlFromText(raw.trim());
    setErrorMessage(null);
    setIsScanning(true);
    setScanStageIndex(0);
    setCurrentResult(null);

    // Cycle progress stages visually
    const interval = setInterval(() => {
      setScanStageIndex((prev) => (prev < scanStages.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: clean, deepAiScan }),
      });

      const data = await response.json();
      clearInterval(interval);

      if (!response.ok || data.error) {
        setErrorMessage(data.error || "Failed to complete security scan.");
      } else {
        setCurrentResult(data);
        saveToHistory(data);
      }
    } catch (err: any) {
      clearInterval(interval);
      setErrorMessage(err.message || "Network error. Please check connection.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setErrorMessage(null);
        }}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Tab 1: Link Scanner View */}
        {activeTab === "scanner" && (
          <div className="space-y-10">
            {/* Hero Title & Value Proposition */}
            {!currentResult && (
              <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Next-Generation Phishing Defense</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Verify any link <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">before</span> you click.
                </h1>

                <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
                  Instant protection against credential harvesting, typosquatting, zero-day smishing, and deceptive domains with server-side threat heuristics & Gemini AI intelligence.
                </p>
              </div>
            )}

            {/* URL Search Box */}
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="relative p-2 sm:p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <div className="flex items-center gap-2">
                  <div className="pl-2 text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>

                  <input
                    id="input-url-scanner"
                    type="text"
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isScanning) {
                        handleStartScan();
                      }
                    }}
                    placeholder="Enter or paste any link (e.g. paypa1-login.xyz, sms link, bit.ly)..."
                    className="flex-1 bg-transparent border-none text-white text-xs sm:text-sm font-mono placeholder:text-slate-500 focus:outline-none focus:ring-0 py-2"
                  />

                  {urlInput && (
                    <button
                      onClick={() => setUrlInput("")}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Clear"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={handlePasteClipboard}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                    title="Paste from clipboard"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>Paste</span>
                  </button>

                  <button
                    id="btn-submit-scan"
                    onClick={() => handleStartScan()}
                    disabled={isScanning || !urlInput.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:pointer-events-none text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 shrink-0 cursor-pointer"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <ScanLine className="w-4 h-4" />
                        <span>Scan Link</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Sub-bar options: Deep AI analysis toggle & notice */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-2 border-t border-slate-800/80 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 select-none">
                    <input
                      type="checkbox"
                      checked={deepAiScan}
                      onChange={(e) => setDeepAiScan(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      Deep AI Threat Intelligence (Social Engineering & Vector Profiling)
                    </span>
                  </label>

                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    Safe inspection sandbox
                  </span>
                </div>
              </div>

              {/* Extracted link notice */}
              {extractedNotice && (
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{extractedNotice}</span>
                </div>
              )}

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Quick Sample Links to Test */}
              {!isScanning && !currentResult && (
                <div className="pt-2">
                  <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider block mb-2">
                    Try Sample Links:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_LINKS.map((sample, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setUrlInput(sample.url);
                          handleStartScan(sample.url);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                          sample.risk === "safe"
                            ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40"
                            : sample.risk === "phishing"
                            ? "border-rose-500/30 bg-rose-950/20 text-rose-300 hover:bg-rose-950/40"
                            : "border-amber-500/30 bg-amber-950/20 text-amber-300 hover:bg-amber-950/40"
                        }`}
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Live Progress Stage Feedback while Scanning */}
            {isScanning && (
              <div className="max-w-xl mx-auto p-8 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md text-center space-y-5 animate-pulse">
                <div className="relative flex items-center justify-center w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white font-mono">
                    Executing Multi-Vector Diagnostics...
                  </h3>
                  <p className="text-xs text-emerald-400 font-mono transition-all">
                    {scanStages[scanStageIndex]}
                  </p>
                </div>

                {/* Step indicator pills */}
                <div className="flex items-center justify-center gap-1.5 pt-2">
                  {scanStages.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === scanStageIndex
                          ? "w-6 bg-emerald-400"
                          : i < scanStageIndex
                          ? "w-3 bg-emerald-700"
                          : "w-2 bg-slate-800"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Scan Report Display */}
            {currentResult && !isScanning && (
              <ScanReport
                result={currentResult}
                onScanAnother={() => {
                  setCurrentResult(null);
                  setUrlInput("");
                }}
              />
            )}

            {/* Feature Highlights (when not viewing a result) */}
            {!currentResult && !isScanning && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Homograph & IDN Attack Shield</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Identifies disguised Cyrillic, Greek, and punycode glyphs engineered to visually replicate banking and social platforms.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">AI Behavioral & Urgency Radar</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Evaluates psychological manipulation, artificial panic triggers, and urgency scores to detect zero-day phishing campaigns.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Redirection Hop & DNS Tracer</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Unmasks hidden cloaking behind shortened links, tracing every redirect step in a safe server-side sandbox.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Batch Scanner */}
        {activeTab === "batch" && (
          <BatchScanner
            onSelectResult={(res) => {
              setCurrentResult(res);
              setActiveTab("scanner");
            }}
          />
        )}

        {/* Tab 3: Live Threat Radar */}
        {activeTab === "radar" && (
          <ThreatRadar
            onTestUrl={(url) => {
              setUrlInput(url);
              setActiveTab("scanner");
              handleStartScan(url);
            }}
          />
        )}

        {/* Tab 4: Safety Guide */}
        {activeTab === "guide" && <EducationHub />}
      </main>

      {/* History Slide-over Drawer */}
      <ScanHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={(item) => {
          setCurrentResult(item);
          setActiveTab("scanner");
        }}
        onClearHistory={handleClearHistory}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-300">PhisherFinder</span>
          <span>— Real-Time Cybersecurity URL Threat Scanner and Developed by Krishna7259</span>
        </div>
        <p className="max-w-md mx-auto text-[11px] text-slate-500">
          Privacy First: URLs are inspected without storing personal user identifiers. Zero association with previous third-party brands.
        </p>
      </footer>
    </div>
  );
}
