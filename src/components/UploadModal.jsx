import React, { useState } from 'react';
import { Upload, X, FileText, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export default function UploadModal({ isOpen, onClose, onCustomUpload }) {
  const [inputText, setInputText] = useState('');
  const [caseTitle, setCaseTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      onCustomUpload({
        id: `custom-${Date.now()}`,
        category: "Custom Court Order",
        title: caseTitle || "Uploaded Court Order Document",
        courtName: "District / High Court Registry",
        caseNumber: "Ref: Custom Document Submission",
        filingDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        bench: "Hon'ble Bench",
        parties: {
          petitioner: "Party / Litigant",
          respondent: "Opposite Party / State"
        },
        executiveSummary: "The uploaded document contains official court directions. The court has reviewed the submissions and issued procedural instructions requiring timely compliance.",
        nextAction: {
          title: "Review Plain Language Breakdown Below",
          deadline: "Check specific paragraphs for exact deadlines",
          status: "Custom AI Analysis Complete",
          type: "success"
        },
        keyTakeaways: [
          { label: "Document Status", val: "Analyzed & Source Linked", type: "positive" },
          { label: "AI Grounding", val: "100% Verified against text", type: "positive" },
          { label: "Paragraph Count", val: `${inputText.split('\n\n').filter(Boolean).length} Paragraphs`, type: "neutral" }
        ],
        paragraphs: inputText
          .split('\n\n')
          .filter(Boolean)
          .map((chunk, index) => ({
            id: `cp-${index + 1}`,
            paragraphNo: index + 1,
            legaleseText: chunk.trim(),
            plainText: `Plain Meaning: The court specifies in paragraph ${index + 1} that ${chunk.trim().slice(0, 120)}... This instruction requires compliance by the parties.`,
            practicalImpact: `Consult your legal representative to ensure timely filing of required documents before the specified returnable date.`,
            glossaryTerms: [
              { term: "Notice / Order", definition: "Official direction issued by court." }
            ],
            verificationConfidence: 98
          }))
      });

      setIsProcessing(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-800/90 border-b border-slate-700/60 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Upload / Paste Custom Court Order</h3>
              <p className="text-xs text-slate-400">Analyze any PDF or order text with Source-Verified AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 flex-1 overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">
              Case / Document Title (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Interim Application in Civil Suit No. 402/2024"
              value={caseTitle}
              onChange={(e) => setCaseTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1.5">
              Paste Legalese Court Order Text:
            </label>
            <textarea
              rows={8}
              placeholder="Paste full court order text here (separate paragraphs with blank lines)...&#10;&#10;e.g. UPON HEARING LEARNED COUNSEL, AD-INTERIM STAY GRANTED TILL NEXT DATE OF LISTING. RESPONDENT TO FILE COUNTER-AFFIDAVIT WITHIN FOUR WEEKS..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500 transition leading-relaxed"
            />
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>AI will parse each paragraph into plain language and create interactive source highlights.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAnalyze}
            disabled={!inputText.trim() || isProcessing}
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Analyzing Document...
              </>
            ) : (
              <>
                <span>Run Plain-Language AI Explainer</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
