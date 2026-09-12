import React from "react";

interface ScanGaugeProps {
  score: number; // 0 (safest) to 100 (most dangerous)
  verdict: "SAFE" | "LOW_RISK" | "SUSPICIOUS" | "MALICIOUS";
}

export const ScanGauge: React.FC<ScanGaugeProps> = ({ score, verdict }) => {
  // Radius and circumference for circular progress
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  // Threat percentage (fill represents danger level)
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = "stroke-emerald-400 text-emerald-400";
  let bgTrack = "stroke-emerald-950/40";
  let badgeText = "SAFE";
  let badgeBg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";

  if (verdict === "MALICIOUS") {
    color = "stroke-rose-500 text-rose-500";
    bgTrack = "stroke-rose-950/40";
    badgeText = "DANGEROUS";
    badgeBg = "bg-rose-500/10 text-rose-400 border-rose-500/30";
  } else if (verdict === "SUSPICIOUS") {
    color = "stroke-amber-500 text-amber-500";
    bgTrack = "stroke-amber-950/40";
    badgeText = "SUSPICIOUS";
    badgeBg = "bg-amber-500/10 text-amber-400 border-amber-500/30";
  } else if (verdict === "LOW_RISK") {
    color = "stroke-yellow-400 text-yellow-400";
    bgTrack = "stroke-yellow-950/40";
    badgeText = "LOW RISK";
    badgeBg = "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";
  }

  return (
    <div id="scan-gauge-container" className="flex flex-col items-center justify-center relative">
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Background glow circle */}
        <div
          className={`absolute inset-2 rounded-full opacity-20 blur-xl ${
            verdict === "MALICIOUS"
              ? "bg-rose-500"
              : verdict === "SUSPICIOUS"
              ? "bg-amber-500"
              : verdict === "LOW_RISK"
              ? "bg-yellow-400"
              : "bg-emerald-500"
          }`}
        />

        {/* SVG Circular Gauge */}
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 130 130">
          {/* Background circle track */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            strokeWidth="10"
            className={`${bgTrack} fill-none`}
          />
          {/* Dynamic Score stroke */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${color} fill-none transition-all duration-1000 ease-out`}
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
            {score}
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
            Risk Index
          </span>
        </div>
      </div>

      <div className="mt-2">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide border uppercase ${badgeBg}`}
        >
          {badgeText}
        </span>
      </div>
    </div>
  );
};
