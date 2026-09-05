import React, { useState } from 'react';
import { FileText, Search, ExternalLink, ShieldCheck, Tag, Info, Sparkles } from 'lucide-react';

export default function CourtOrderViewer({
  order,
  activeParagraphId,
  setActiveParagraphId,
  onOpenGlossary
}) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-full shadow-xl">
      {/* Top Bar */}
      <div className="bg-slate-800/80 border-b border-slate-700/60 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-700 text-amber-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Source Document</span>
            <h3 className="text-sm font-semibold text-slate-200">Original Court Order Text</h3>
          </div>
        </div>
        
        {/* Search inside original order */}
        <div className="relative w-44 sm:w-56">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search legalese terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-700 rounded-lg pl-8 pr-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-500/60 transition"
          />
        </div>
      </div>

      {/* Document Meta Header */}
      <div className="bg-slate-950/60 border-b border-slate-800 p-4 space-y-2 text-xs">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-bold text-amber-400 uppercase tracking-wide text-[11px]">{order.courtName}</h4>
            <div className="text-slate-200 font-mono text-[12px] font-semibold mt-0.5">{order.caseNumber}</div>
          </div>
          <span className="bg-slate-800 border border-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded font-mono">
            {order.filingDate}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
          <div>
            <span className="text-slate-500 font-medium">Petitioner:</span>{' '}
            <span className="font-semibold text-slate-200">{order.parties.petitioner}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Respondent:</span>{' '}
            <span className="font-semibold text-slate-200">{order.parties.respondent}</span>
          </div>
          <div className="col-span-1 sm:col-span-2">
            <span className="text-slate-500 font-medium">Bench:</span>{' '}
            <span className="text-slate-300 font-medium">{order.bench}</span>
          </div>
        </div>
      </div>

      {/* Document Body (Paragraph by Paragraph) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {order.paragraphs.map((para) => {
          const isSelected = activeParagraphId === para.id;
          const isMatch = searchTerm && para.legaleseText.toLowerCase().includes(searchTerm.toLowerCase());

          return (
            <div
              key={para.id}
              onClick={() => setActiveParagraphId(para.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-amber-950/20 border-amber-500/80 active-source-highlight shadow-lg shadow-amber-950/50'
                  : isMatch
                  ? 'bg-slate-800/90 border-amber-400/50'
                  : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
              }`}
            >
              {/* Paragraph Ribbon Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  ¶ Paragraph {para.paragraphNo}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {para.verificationConfidence}% Verified
                  </span>
                </div>
              </div>

              {/* Legalese Content */}
              <p className="text-xs sm:text-sm font-mono leading-relaxed text-slate-200 uppercase tracking-wide">
                {para.legaleseText}
              </p>

              {/* Detected Jargon Glossary Badges */}
              {para.glossaryTerms && para.glossaryTerms.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-500 font-medium mr-1 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-amber-400" />
                    Jargon Detected:
                  </span>
                  {para.glossaryTerms.map((gt, gIdx) => (
                    <button
                      key={gIdx}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenGlossary(gt.term);
                      }}
                      className="text-[10px] bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded transition cursor-pointer font-sans"
                    >
                      {gt.term}
                    </button>
                  ))}
                </div>
              )}

              {/* Click prompt */}
              <div className="mt-2 text-right">
                <span className={`text-[10px] font-medium transition ${
                  isSelected ? 'text-amber-400 font-semibold' : 'text-slate-500 group-hover:text-slate-400'
                }`}>
                  {isSelected ? '✓ Source Linked & Highlighted' : 'Click to inspect plain breakdown →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-950 border-t border-slate-800 p-2.5 text-center text-[11px] text-slate-500">
        Original Court Order Copy • Verified against official registry record
      </div>
    </div>
  );
}
