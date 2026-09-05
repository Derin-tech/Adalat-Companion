import { useState, useEffect, useRef } from 'react';
import { X, Search, Filter, Scale } from 'lucide-react';

export interface GlossaryTerm {
  term: string;
  category: 'Procedural' | 'Financial' | 'Order Type' | 'Parties';
  definition: string;
  example: string;
}

export const GLOSSARY_LIST: GlossaryTerm[] = [
  {
    term: "ex parte",
    category: "Procedural",
    definition: "An order or hearing passed by a judge when only one party is present, usually because the other side failed to show up after notice.",
    example: "The court issued an ex parte interim order as the respondent did not appear despite summons."
  },
  {
    term: "interim maintenance",
    category: "Financial",
    definition: "Temporary monthly financial support paid by one spouse to another while the legal case is pending.",
    example: "The husband was ordered to pay ₹10,000 per month as interim maintenance till final judgment."
  },
  {
    term: "petitioner",
    category: "Parties",
    definition: "The person or party who files an application or legal case in court requesting relief.",
    example: "Anita Sharma filed the petition as the petitioner."
  },
  {
    term: "respondent",
    category: "Parties",
    definition: "The person or party who is sued or required to answer the petitioner's claims in court.",
    example: "Rahul Sharma is named as the respondent in the case."
  },
  {
    term: "remit",
    category: "Financial",
    definition: "To send, deposit, or pay a sum of money (e.g. into a bank account or court deposit).",
    example: "The respondent was ordered to remit the amount into court registry."
  },
  {
    term: "status quo",
    category: "Order Type",
    definition: "An order requiring both sides to maintain things exactly as they currently are without changing anything.",
    example: "The judge ordered status quo on the property so neither side can build on it."
  },
  {
    term: "surety",
    category: "Procedural",
    definition: "A person who promises to accept financial responsibility if an accused person fails to show up in court.",
    example: "He was granted bail upon submitting one solvent surety of ₹25,000."
  },
  {
    term: "temporary injunction / stay order",
    category: "Order Type",
    definition: "A court order temporarily stopping a person from performing a specific action (like selling property or demolishing a wall).",
    example: "The court granted a stay order preventing sale of disputed land."
  },
  {
    term: "personal bond",
    category: "Procedural",
    definition: "A written promise signed by an accused person stating they will return to court when required, backed by a penalty amount if broken.",
    example: "Released on executing a personal bond of ₹10,000."
  },
  {
    term: "cognizance",
    category: "Procedural",
    definition: "Taking judicial notice of an offence; when a court officially opens and accepts a case for trial.",
    example: "The Magistrate took cognizance of the charge sheet filed by police."
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

export default function GlossaryDrawer({ isOpen, onClose }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Slight delay to allow animation before focusing
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const categories = ['All', 'Procedural', 'Financial', 'Order Type', 'Parties'];

  const filteredTerms = GLOSSARY_LIST.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.term.toLowerCase().includes(search.toLowerCase()) ||
                          item.definition.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/60 z-[100] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="glossary-title"
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-[101] flex flex-col transform transition-transform duration-300 ease-out sm:rounded-l-2xl border-l border-slate-200 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-slate-100 bg-white sm:rounded-tl-2xl">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="mt-1 p-2 bg-blue-50 text-blue-700 rounded-lg">
                <Scale size={24} />
              </div>
              <div>
                <h2 id="glossary-title" className="text-xl font-bold font-serif text-slate-900">
                  Statutory Legal Glossary
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Official definitions for common court terms
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              aria-label="Close glossary"
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex-shrink-0 px-6 py-4 bg-slate-50/50 border-b border-slate-100 space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              ref={searchInputRef}
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search legal terms (e.g. ex parte, bail)..."
              className="w-full h-12 pl-10 pr-10 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-slate-400 shadow-sm transition-all"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Filter size={14} className="text-slate-400 shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-sm rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-blue-900 text-white shadow-sm' 
                    : 'bg-white border border-slate-200 text-blue-950 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Glossary Terms List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar pb-24">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-4">
                <Search size={24} />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No terms found</h3>
              <p className="text-sm text-slate-500">Try searching for another legal term.</p>
            </div>
          ) : (
            filteredTerms.map((item, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-bold text-blue-900 text-lg font-serif capitalize leading-tight">
                    {item.term}
                  </h3>
                  <span className="shrink-0 text-[10px] tracking-wider uppercase font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                    {item.category}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {item.definition}
                </p>
                <div className="mt-4 p-3.5 rounded-lg bg-slate-50 border border-slate-100 text-sm text-slate-600">
                  <span className="block font-semibold text-xs text-slate-500 uppercase tracking-wide mb-1">Usage Example</span>
                  <span className="italic font-serif text-slate-700">"{item.example}"</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
