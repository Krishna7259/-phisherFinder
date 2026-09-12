import React from "react";
import { ShieldCheck, ShieldAlert, History, Activity, Sparkles, Layers, BookOpen } from "lucide-react";

interface NavbarProps {
  activeTab: "scanner" | "batch" | "radar" | "guide";
  onTabChange: (tab: "scanner" | "batch" | "radar" | "guide") => void;
  historyCount: number;
  onOpenHistory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  historyCount,
  onOpenHistory,
}) => {
  return (
    <header id="phisherfinder-navbar" className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange("scanner")}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
                Phisher<span className="text-emerald-400">Finder</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Real-time URL Threat & Phishing Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            id="nav-scanner"
            onClick={() => onTabChange("scanner")}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "scanner"
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Link Scanner
          </button>

          <button
            id="nav-batch"
            onClick={() => onTabChange("batch")}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "batch"
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Batch Scan
          </button>

          <button
            id="nav-radar"
            onClick={() => onTabChange("radar")}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "radar"
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Threat Radar
          </button>

          <button
            id="nav-guide"
            onClick={() => onTabChange("guide")}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "guide"
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Safety Guide
          </button>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2.5">
          {/* History button */}
          <button
            id="btn-scan-history"
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
            title="View scan history"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                {historyCount}
              </span>
            )}
          </button>

          {/* Live Engine status badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg border border-emerald-900/40 bg-emerald-950/30 text-[11px] font-medium text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Radar Active</span>
          </div>
        </div>
      </div>

      {/* Mobile sub-tabs */}
      <div className="flex md:hidden border-t border-slate-800/80 bg-slate-950 px-2 py-1.5 gap-1 overflow-x-auto">
        <button
          onClick={() => onTabChange("scanner")}
          className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap ${
            activeTab === "scanner" ? "bg-emerald-500/20 text-emerald-300" : "text-slate-400"
          }`}
        >
          Scanner
        </button>
        <button
          onClick={() => onTabChange("batch")}
          className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap ${
            activeTab === "batch" ? "bg-emerald-500/20 text-emerald-300" : "text-slate-400"
          }`}
        >
          Batch Scan
        </button>
        <button
          onClick={() => onTabChange("radar")}
          className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap ${
            activeTab === "radar" ? "bg-emerald-500/20 text-emerald-300" : "text-slate-400"
          }`}
        >
          Threat Radar
        </button>
        <button
          onClick={() => onTabChange("guide")}
          className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap ${
            activeTab === "guide" ? "bg-emerald-500/20 text-emerald-300" : "text-slate-400"
          }`}
        >
          Safety Guide
        </button>
      </div>
    </header>
  );
};
