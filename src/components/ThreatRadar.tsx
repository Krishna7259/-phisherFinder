import React, { useEffect, useState } from "react";
import { Activity, ShieldAlert, Globe, Radio, TrendingUp, ArrowUpRight, Zap, Target } from "lucide-react";
import { ThreatFeedData } from "../types";

interface ThreatRadarProps {
  onTestUrl: (url: string) => void;
}

export const ThreatRadar: React.FC<ThreatRadarProps> = ({ onTestUrl }) => {
  const [feed, setFeed] = useState<ThreatFeedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/threat-feed")
      .then((res) => res.json())
      .then((data) => {
        setFeed(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Threat feed error:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div id="threat-radar-container" className="w-full max-w-5xl mx-auto space-y-6">
      {/* Telemetry Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Links Scanned Today</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-extrabold font-mono text-white">
            {feed?.statistics.linksScannedToday ? feed.statistics.linksScannedToday.toLocaleString() : "84,392"}
          </p>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +14.2% from yesterday
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Phishing Links Neutralized</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold font-mono text-rose-400">
            {feed?.statistics.threatsNeutralized ? feed.statistics.threatsNeutralized.toLocaleString() : "14,210"}
          </p>
          <span className="text-[10px] text-rose-400 flex items-center gap-1 mt-1">
            High Severity Threats
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Avg Analysis Time</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="mt-2 text-2xl font-extrabold font-mono text-cyan-300">
            {feed?.statistics.averageAnalysisTimeMs || 280} ms
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Sub-second Heuristics
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Global Protection</span>
            <Globe className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-extrabold font-mono text-emerald-300">
            {feed?.statistics.globalProtectionCoverage || "99.8%"}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Zero-Day Signature Shield
          </span>
        </div>
      </div>

      {/* Active Phishing Campaigns Section */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Live Phishing Threat Radar</h2>
              <p className="text-xs text-slate-400">
                Trending social-engineering lures, smishing domains, and zero-day campaigns active right now.
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Live Threat Stream
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feed?.activeCampaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-5 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      camp.severity === "CRITICAL"
                        ? "bg-rose-950 text-rose-300 border-rose-800"
                        : "bg-amber-950 text-amber-300 border-amber-800"
                    }`}
                  >
                    {camp.severity} RISK
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1.5 leading-tight">
                    {camp.title}
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500 shrink-0">
                  {camp.discoveredDaysAgo}d ago
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {camp.vector}
              </p>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 mr-1 flex items-center gap-1">
                  <Target className="w-3 h-3" /> Target:
                </span>
                {camp.targetedBrands.map((b, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-medium"
                  >
                    {b}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-slate-500 truncate">
                  e.g. {camp.typicalDomains[0]}
                </span>
                <button
                  onClick={() => onTestUrl(camp.typicalDomains[0])}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 shrink-0 cursor-pointer"
                >
                  <span>Test in Scanner</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
