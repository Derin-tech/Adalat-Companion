import React from 'react';
import { Scale, Upload, Volume2, Globe, FileText, Sparkles, BookOpen, ShieldAlert } from 'lucide-react';
import { VERNACULAR_LANGUAGES } from '../data/sampleOrders';

export default function Header({
  onOpenUpload,
  selectedLang,
  setSelectedLang,
  isPlayingAudio,
  toggleAudio,
  onOpenGlossary
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold">
              <Scale className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-100 tracking-tight">Adalat Companion</h1>
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Plain-Language AI
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Source-Verified Court Order Explainer for India</p>
            </div>
          </div>

          <button
            onClick={onOpenUpload}
            className="md:hidden flex items-center gap-1.5 text-xs bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold px-3 py-1.5 rounded-lg transition shadow"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload
          </button>
        </div>

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-2 lg:gap-3 flex-wrap justify-center md:justify-end w-full md:w-auto">
          
          {/* Vernacular Language Selector */}
          <div className="relative flex items-center bg-slate-800/80 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-slate-200">
            <Globe className="w-3.5 h-3.5 text-amber-400 mr-2 shrink-0" />
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer pr-1"
            >
              {VERNACULAR_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Audio Reader Button */}
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition font-medium ${
              isPlayingAudio
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-750 hover:text-white'
            }`}
            title="Read Plain Summary Aloud"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>{isPlayingAudio ? 'Pause Audio' : 'Listen Summary'}</span>
          </button>

          {/* Glossary Button */}
          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-1.5 text-xs bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 px-3 py-1.5 rounded-lg transition font-medium"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Legal Glossary</span>
          </button>

          {/* Upload Custom Order Button */}
          <button
            onClick={onOpenUpload}
            className="hidden md:flex items-center gap-2 text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold px-3.5 py-1.5 rounded-lg transition shadow-md shadow-amber-500/10 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Upload Court PDF / Text</span>
          </button>

        </div>

      </div>
    </header>
  );
}
