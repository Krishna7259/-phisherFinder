import React, { useState } from "react";
import { Layers, ShieldCheck, ShieldAlert, AlertTriangle, ArrowRight, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { ScanResult } from "../types";

interface BatchScannerProps {
  onSelectResult: (result: ScanResult) => void;
}

export const BatchScanner: React.FC<BatchScannerProps> = ({ onSelectResult }) => {
  const [urlsInput, setUrlsInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [batchResults, setBatchResults] = useState<ScanResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sampleBatch = `https://google.com
http://paypa1-security-verification.xyz/login
https://wikipedia.org
http://dhl-package-redelivery-fee.top/track
http://chase-bank-verify-alert.cfd`;

  const handleScanBatch = async () => {
    setError(null);
    const rawLines = urlsInput
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (rawLines.length === 0) {
      setError("Please paste at least one URL (one per line).");
      return;
    }

    if (rawLines.length > 5) {
      setError("Maximum 5 URLs per batch scan allowed for instant inspection.");
      return;
    }

    setIsScanning(true);
    try {
      const response = await fetch("/api/check-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: rawLines }),
      });
      const data = await response.json();
      if (data.results) {
        setBatchResults(data.results);
      } else {
        setError(data.error || "Batch scan encountered an issue.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to complete batch scan.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div id="batch-scanner-container" className="w-full max-w-4xl mx-auto space-y-6">
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Batch Link Threat Scanner</h2>
            <p className="text-xs text-slate-400">
              Paste up to 5 URLs (one per line) from emails, SMS messages, or documents to scan them simultaneously.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <textarea
            id="batch-urls-input"
            rows={5}
            value={urlsInput}
            onChange={(e) => setUrlsInput(e.target.value)}
            placeholder={`https://example.com/login\nhttps://suspicious-billing-update.xyz\n...`}
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all resize-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              onClick={() => setUrlsInput(sampleBatch)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
            >
              + Load Sample URLs (Safe & Phishing mix)
            </button>

            <button
              id="btn-run-batch-scan"
              onClick={handleScanBatch}
              disabled={isScanning}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Scanning Links...</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Scan All Links</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Batch Results Table */}
      {batchResults.length > 0 && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Batch Inspection Outcomes ({batchResults.length} Links)
          </h3>

          <div className="space-y-3">
            {batchResults.map((item) => {
              const isMalicious = item.verdict === "MALICIOUS";
              const isSuspicious = item.verdict === "SUSPICIOUS";
              const isSafe = item.verdict === "SAFE";

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-800 bg-slate-950/80 hover:bg-slate-950 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isMalicious
                          ? "bg-rose-500/10 text-rose-400"
                          : isSuspicious
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {isMalicious ? (
                        <ShieldAlert className="w-4 h-4" />
                      ) : isSuspicious ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <ShieldCheck className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-100 truncate">
                          {item.hostname}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                            isMalicious
                              ? "bg-rose-950 text-rose-300 border-rose-800"
                              : isSuspicious
                              ? "bg-amber-950 text-amber-300 border-amber-800"
                              : "bg-emerald-950 text-emerald-300 border-emerald-800"
                          }`}
                        >
                          {item.verdict}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                        {item.normalizedUrl}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Risk Index</span>
                      <span
                        className={`font-mono text-sm font-extrabold ${
                          isMalicious
                            ? "text-rose-400"
                            : isSuspicious
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {item.threatScore}/100
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectResult(item)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                    >
                      <span>View Dossier</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
