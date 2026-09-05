import React from 'react';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="bg-amber-950/40 border-b border-amber-500/20 px-4 py-2.5 text-xs text-amber-200/90">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-full bg-amber-500/10 text-amber-400 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </span>
          <p className="leading-tight">
            <strong className="font-semibold text-amber-300">Explainer Tool, Not Legal Advice:</strong> Adalat Companion decodes court orders into plain language. It does not provide legal opinions, strategic legal counsel, or binding representation.
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-amber-400/80 font-medium shrink-0">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            100% Source Verified
          </span>
          <span className="hidden md:inline text-slate-600">•</span>
          <span className="hidden md:inline">DAKSH & SARAL Informed</span>
        </div>
      </div>
    </div>
  );
}
