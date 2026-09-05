import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, Search, FileText, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';

const API_BASE = 'http://localhost:3001/api';

type Clause = {
  id: string;
  originalText: string;
  plainText: string;
  pageNumber: number;
};

type KeyFacts = {
  parties: string[];
  nextHearingDate: string | null;
  stage: string | null;
};

type SummaryResponse = {
  plainSummary: string;
  clauses: Clause[];
  keyFacts: KeyFacts;
  changedFromPrevious?: {
    changed: boolean;
    changes: string[];
  } | null;
  language: string;
  fallback?: boolean;
};

const GLOSSARY: Record<string, string> = {
  "interim": "Temporary, while the case is still going on.",
  "ex parte": "Decided by a judge without requiring all of the parties to the controversy to be present.",
  "petitioner": "The person who filed the case or application.",
  "respondent": "The person being sued or responding to the application.",
  "remit": "To send or pay money.",
  "maintenance": "Financial support paid by one person to another for their living expenses."
};

function renderWithGlossary(text: string) {
  // Sort by length descending to match longer phrases first (e.g., "ex parte")
  const terms = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
  const regex = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi');
  
  const parts = text.split(regex);
  
  return parts.map((part, i) => {
    const termKey = part.toLowerCase();
    if (GLOSSARY[termKey]) {
      return (
        <abbr 
          key={i} 
          title={GLOSSARY[termKey]} 
          className="underline decoration-dashed decoration-blue-400 cursor-help text-blue-900 font-semibold"
        >
          {part}
        </abbr>
      );
    }
    return part;
  });
}

export default function App() {
  const [caseId, setCaseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If we have a caseId, show the results screen, else upload screen.
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-slate-900 text-white py-4 px-8 border-b-4 border-blue-600">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight">Adalat Companion</h1>
          <nav className="text-sm font-medium text-slate-300">
            Plain-Language Court Orders
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-12 px-8">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-600 flex items-start">
            <AlertCircle className="text-red-600 mr-3 mt-0.5" size={20} />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-slate-600 font-medium">Processing document...</p>
            <p className="text-sm text-slate-500 mt-2">This may take a few moments.</p>
          </div>
        ) : !caseId ? (
          <UploadScreen 
            onSuccess={(id) => setCaseId(id)} 
            setLoading={setLoading} 
            setError={setError} 
          />
        ) : (
          <ResultsScreen 
            caseId={caseId} 
            onReset={() => setCaseId(null)} 
          />
        )}
      </main>
    </div>
  );
}

function UploadScreen({ onSuccess, setLoading, setError }: { 
  onSuccess: (id: string) => void, 
  setLoading: (l: boolean) => void,
  setError: (e: string | null) => void 
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cnr, setCnr] = useState('');

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post(`${API_BASE}/upload`, formData);
      onSuccess(res.data.caseId);
    } catch (err: any) {
      console.error(err);
      setError('Failed to upload document. Please try again.');
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleCnrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnr.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // In a real app we might fetch lookup data, then proceed.
      await axios.get(`${API_BASE}/lookup/${cnr}`);
      // Simulating a caseId generation based on lookup
      onSuccess(`case-cnr-${cnr}`);
    } catch (err: any) {
      console.error(err);
      setError('Failed to look up CNR. Please check the number and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-12">
      {/* Upload Section */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Upload a Court Order</h2>
        <p className="text-slate-600 mb-6">Upload a PDF or image of your court order to get a plain-language summary.</p>
        
        <div 
          className="border-2 border-dashed border-slate-300 bg-white p-12 text-center hover:bg-slate-50 hover:border-blue-500 transition-colors cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="mx-auto text-slate-400 mb-4" size={48} />
          <p className="text-lg font-medium text-slate-700">Drag & drop your file here</p>
          <p className="text-sm text-slate-500 mt-1">or click to browse</p>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
            accept=".pdf,image/*"
          />
        </div>
      </section>

      {/* CNR Lookup Section */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Look up by CNR Number</h2>
        <p className="text-slate-600 mb-6">Enter your 16-digit CNR number to fetch case details automatically.</p>
        
        <form onSubmit={handleCnrSubmit} className="bg-white p-6 border border-slate-200">
          <label htmlFor="cnr" className="block text-sm font-semibold text-slate-700 mb-2">CNR Number</label>
          <div className="flex gap-2">
            <input 
              id="cnr"
              type="text" 
              value={cnr}
              onChange={(e) => setCnr(e.target.value)}
              placeholder="e.g. MHBO010001232026" 
              className="flex-1 border border-slate-300 p-3 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
            <button 
              type="submit"
              className="bg-slate-900 text-white px-6 py-3 font-medium hover:bg-slate-800 transition-colors flex items-center"
            >
              <Search size={18} className="mr-2" />
              Search
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function ResultsScreen({ caseId, onReset }: { caseId: string, onReset: () => void }) {
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState('en');
  const [expandedClauseId, setExpandedClauseId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/summary/${caseId}?lang=${lang}`);
        if (isMounted) setData(res.data);
      } catch (err) {
        console.error(err);
        if (isMounted) setError('Failed to load case summary.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchSummary();
    return () => { isMounted = false; };
  }, [caseId, lang]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-red-50 border-l-4 border-red-600">
        <h3 className="text-red-800 font-bold mb-2">Error Loading Case</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button onClick={onReset} className="text-red-800 underline font-medium">Return to start</button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
        <div>
          <button onClick={onReset} className="text-slate-500 hover:text-slate-800 text-sm font-medium mb-4 inline-flex items-center">
            ← Start over
          </button>
          <h2 className="text-3xl font-bold">Case Summary</h2>
          {data.fallback && (
            <span className="inline-flex items-center mt-2 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-none">
              <AlertCircle size={14} className="mr-1.5" />
              Showing example data (System offline)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="language" className="text-sm font-medium text-slate-600">Language:</label>
          <select 
            id="language"
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="border border-slate-300 p-2 bg-white text-sm focus:outline-none focus:border-blue-600"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Executive Summary */}
          <section className="bg-white p-8 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FileText className="mr-2 text-blue-600" />
              What this order means
            </h3>
            <p className="text-lg leading-relaxed text-slate-800">
              {renderWithGlossary(data.plainSummary)}
            </p>
          </section>

          {/* Change Highlighting */}
          {data.changedFromPrevious?.changed && (
            <section className="bg-amber-50 p-6 border border-amber-200 shadow-sm">
              <h3 className="text-lg font-bold text-amber-900 mb-3">What changed in this order?</h3>
              <ul className="list-disc pl-5 space-y-2 text-amber-800 font-medium">
                {data.changedFromPrevious.changes.map((change, idx) => (
                  <li key={idx}>{change}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Clauses breakdown */}
          <section>
            <h3 className="text-lg font-bold mb-4">Detailed Breakdown</h3>
            <div className="space-y-4">
              {data.clauses.map((clause) => (
                <div key={clause.id} className="bg-white border border-slate-200 overflow-hidden">
                  <div 
                    className="p-5 cursor-pointer hover:bg-slate-50 flex justify-between items-start"
                    onClick={() => setExpandedClauseId(expandedClauseId === clause.id ? null : clause.id)}
                  >
                    <div className="flex items-start">
                      <CheckCircle2 className="text-green-600 mr-3 mt-0.5 shrink-0" size={20} />
                      <p className="font-medium text-slate-900">{renderWithGlossary(clause.plainText)}</p>
                    </div>
                    <ChevronRight 
                      size={20} 
                      className={`text-slate-400 transition-transform ${expandedClauseId === clause.id ? 'rotate-90' : ''}`} 
                    />
                  </div>
                  
                  {expandedClauseId === clause.id && (
                    <div className="bg-slate-50 p-5 border-t border-slate-200 font-serif text-slate-700 text-sm italic">
                      <p className="mb-2 text-xs font-sans font-semibold text-slate-500 uppercase tracking-wide">
                        Original Legal Text (Page {clause.pageNumber})
                      </p>
                      "{clause.originalText}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Key Facts Sidebar */}
        <div className="space-y-6">
          <section className="bg-slate-100 p-6 border border-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Key Facts</h3>
            
            <div className="space-y-4">
              <div>
                <span className="block text-xs font-semibold text-slate-500 mb-1">PARTIES INVOLVED</span>
                <ul className="text-sm font-medium space-y-1">
                  {data.keyFacts.parties.map((party, i) => (
                    <li key={i}>{party}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <span className="block text-xs font-semibold text-slate-500 mb-1">STAGE</span>
                <span className="text-sm font-medium">{data.keyFacts.stage || 'Not specified'}</span>
              </div>
              
              <div>
                <span className="block text-xs font-semibold text-slate-500 mb-1">NEXT HEARING</span>
                <span className="text-sm font-medium">{data.keyFacts.nextHearingDate || 'Not specified'}</span>
              </div>
            </div>
          </section>
          
          <div className="bg-blue-50 p-6 border border-blue-100">
            <h3 className="text-sm font-bold text-blue-900 mb-2">Disclaimer</h3>
            <p className="text-xs text-blue-800 leading-relaxed">
              This summary is generated by AI to help you understand your court order. It is for informational purposes only and does not constitute legal advice. Please consult your lawyer for formal legal guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
