import React, { useState } from "react";
import { ScanResult } from "../types";
import { X, Trash2, History, ArrowRight, ShieldCheck, ShieldAlert, AlertTriangle, Download } from "lucide-react";

interface ScanHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScanResult[];
  onSelectResult: (result: ScanResult) => void;
  onClearHistory: () => void;
}

export const ScanHistoryDrawer: React.FC<ScanHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onClearHistory,
}) => {
  const [filter, setFilter] = useState<"ALL" | "MALICIOUS" | "SUSPICIOUS" | "SAFE">("ALL");

  if (!isOpen) return null;

  const filtered = history.filter((item) => {
    if (filter === "ALL") return true;
    return item.verdict === filter;
  });

  const exportHistoryJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `phisherfinder-history-${Date.now()}.json`);
    downloadAnchor.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-6 flex flex-col shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Scan History</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {history.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(["ALL", "MALICIOUS", "SUSPICIOUS", "SAFE"] as const).map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                filter === category
                  ? "bg-slate-800 text-emerald-400 border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* List of saved items */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filtered.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
              <History className="w-8 h-8 opacity-40" />
              <p className="text-xs">No scan records found in this category.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const isMalicious = item.verdict === "MALICIOUS";
              const isSuspicious = item.verdict === "SUSPICIOUS";

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectResult(item);
                    onClose();
                  }}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-950 transition-all cursor-pointer space-y-1.5 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {isMalicious ? (
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      ) : isSuspicious ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                      <span className="font-mono text-xs font-semibold text-slate-200 truncate">
                        {item.hostname}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border shrink-0 ${
                        isMalicious
                          ? "bg-rose-950 text-rose-300 border-rose-800"
                          : isSuspicious
                          ? "bg-amber-950 text-amber-300 border-amber-800"
                          : "bg-emerald-950 text-emerald-300 border-emerald-800"
                      }`}
                    >
                      {item.threatScore}/100
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-slate-500 truncate">
                    {item.normalizedUrl}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>{new Date(item.scannedAt).toLocaleDateString()}</span>
                    <span className="group-hover:text-emerald-400 flex items-center gap-1 font-medium transition-colors">
                      Review <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        {history.length > 0 && (
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={exportHistoryJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-900/50 text-xs font-medium transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
