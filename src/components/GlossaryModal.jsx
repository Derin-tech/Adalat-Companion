import React, { useState } from 'react';
import { BookOpen, X, Search, Tag, Sparkles } from 'lucide-react';

const COMPREHENSIVE_GLOSSARY = [
  { term: "Ad-Interim Stay / Injunction", definition: "A temporary court order that immediately pauses a government notice, demolition, or action until the next court hearing." },
  { term: "Ex-Parte Order", definition: "A legal decision made by the judge when one party fails to attend court despite receiving official notice." },
  { term: "Impugned Order / Notice", definition: "The specific government order, lower court judgment, or notice that is being challenged or disputed." },
  { term: "Counter-Affidavit", definition: "A formal written response filed under oath by the respondent (opposite side) replying to allegations." },
  { term: "Rejoinder", definition: "A formal counter-reply filed by the petitioner in response to the respondent's counter-affidavit." },
  { term: "Costs", definition: "A financial penalty imposed by the court on a party causing unnecessary delay, adjournment, or filing frivolous claims." },
  { term: "Personal Bond", definition: "A written promise signed by an accused person promising to pay a specified money amount if they fail to appear in court." },
  { term: "Solvent Surety", definition: "A creditworthy guarantor who owns verified property/assets and agrees to guarantee the bail of an accused person." },
  { term: "Condition Precedent", definition: "A mandatory requirement or fine payment that must be completed before any further court action is permitted." },
  { term: "Interim Maintenance", definition: "Temporary monthly financial allowance ordered by the court during ongoing divorce or custody proceedings." },
  { term: "Disposed Of", definition: "The case is officially closed and finalized in this particular court." },
  { term: "Liberty to Approach", definition: "Explicit court permission granting a party the right to re-file or approach a different specialized tribunal/forum." },
  { term: "Statutory Remedy", definition: "A legal right or appeal mechanism provided directly under an Act of Parliament (e.g., SARFAESI Act, DRT)." },
  { term: "Issue Notice", definition: "Official court direction to issue formal summons to the opposite party to appear in court." },
  { term: "Returnable On", definition: "The exact calendar date by which the summoned party must file their reply and appear in court." }
];

export default function GlossaryModal({ isOpen, onClose, highlightTerm }) {
  const [searchTerm, setSearchTerm] = useState(highlightTerm || '');

  if (!isOpen) return null;

  const filteredGlossary = COMPREHENSIVE_GLOSSARY.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-800/90 border-b border-slate-700/60 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Indian Legal Jargon Glossary</h3>
              <p className="text-xs text-slate-400">Plain-language definitions for court phrasing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search legal terms (e.g. Ex-Parte, Stay, Surety, Costs)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition"
              autoFocus
            />
          </div>
        </div>

        {/* Glossary List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredGlossary.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No matching legal terms found. Try searching for "Stay", "Bail", "Notice", or "Costs".
            </div>
          ) : (
            filteredGlossary.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950/60 border border-slate-800 hover:border-slate-700 p-3.5 rounded-xl transition"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <h4 className="text-sm font-bold text-amber-300">{item.term}</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans pl-5">
                  {item.definition}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-3 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition"
          >
            Close Glossary
          </button>
        </div>

      </div>
    </div>
  );
}
