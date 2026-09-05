import React from 'react';
import { Sparkles, Calendar, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, HelpCircle, Layers, Lightbulb, Zap } from 'lucide-react';
import { VERNACULAR_LANGUAGES } from '../data/sampleOrders';

export default function PlainExplainerViewer({
  order,
  activeParagraphId,
  setActiveParagraphId,
  selectedLang,
  onOpenGlossary
}) {
  const langObj = VERNACULAR_LANGUAGES.find(l => l.code === selectedLang) || VERNACULAR_LANGUAGES[0];

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-full shadow-xl">
      {/* Top Bar */}
      <div className="bg-slate-800/80 border-b border-slate-700/60 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-100">Plain-Language Explainer</h3>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                {langObj.flag} {langObj.name}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">AI Source-Grounded Legal Simplification</p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
            Grade 8 Readability
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        
        {/* Executive Summary Card */}
        <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 rounded-xl p-4.5 shadow-lg relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-md bg-amber-500 text-slate-950">
              <Zap className="w-3.5 h-3.5 font-bold" />
            </span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Executive Summary (What Happened)
            </h4>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans font-medium">
            {order.executiveSummary}
          </p>

          {/* Key Takeaways Pills */}
          <div className="mt-4 pt-3 border-t border-amber-500/20 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {order.keyTakeaways.map((kt, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-800 p-2 rounded-lg text-xs">
                <span className="text-[10px] text-slate-400 block font-medium">{kt.label}</span>
                <span className={`font-semibold text-xs mt-0.5 block ${
                  kt.type === 'positive' ? 'text-emerald-400' :
                  kt.type === 'negative' ? 'text-rose-400' :
                  kt.type === 'warning' ? 'text-amber-400' : 'text-slate-200'
                }`}>
                  {kt.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Immediate Action Items Card */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Immediate Action Required
              </h4>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
              order.nextAction.type === 'warning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
              order.nextAction.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
              'bg-slate-800 text-slate-300'
            }`}>
              {order.nextAction.status}
            </span>
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100">{order.nextAction.title}</div>
              <div className="text-xs text-slate-300 mt-0.5">{order.nextAction.deadline}</div>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Source-Verified Paragraph Breakdown
            </h4>
          </div>
          <span className="text-[10px] text-slate-400">Click any card to sync with source</span>
        </div>

        {/* Source-Linked Cards */}
        <div className="space-y-4">
          {order.paragraphs.map((para) => {
            const isSelected = activeParagraphId === para.id;

            return (
              <div
                key={para.id}
                onClick={() => setActiveParagraphId(para.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-amber-950/20 border-amber-500/80 shadow-lg shadow-amber-950/50'
                    : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      Explanation for ¶ Paragraph {para.paragraphNo}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Source Linked
                  </span>
                </div>

                {/* Plain Text Translation */}
                <div className="mb-3">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                    Plain Language Meaning:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-100 font-sans leading-relaxed">
                    {para.plainText}
                  </p>
                </div>

                {/* Practical Impact Box */}
                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 block uppercase tracking-wide">
                      What this means for you:
                    </span>
                    <p className="text-xs text-slate-300 mt-0.5 leading-normal">
                      {para.practicalImpact}
                    </p>
                  </div>
                </div>

                {/* Footnote Source Sync Status */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Grounded in Original ¶ {para.paragraphNo}</span>
                  <span className={`flex items-center gap-1 ${isSelected ? 'text-amber-400 font-bold' : ''}`}>
                    {isSelected ? '✓ Linked to Left Pane' : 'Click to inspect source →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <div className="bg-slate-950 border-t border-slate-800 p-2.5 text-center text-[11px] text-slate-500">
        AI Plain Explainer Engine • Zero Hallucination Source Mapping
      </div>
    </div>
  );
}
