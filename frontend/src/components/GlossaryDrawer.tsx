import { useState } from 'react';
import { X, Search, BookOpen, Filter } from 'lucide-react';

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

  if (!isOpen) return null;

  const categories = ['All', 'Procedural', 'Financial', 'Order Type', 'Parties'];

  const filteredTerms = GLOSSARY_LIST.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.term.toLowerCase().includes(search.toLowerCase()) ||
                          item.definition.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 flex justify-end">
      <div className="w-full max-w-md h-full bg-white text-slate-900 shadow-2xl flex flex-col border-l border-slate-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-300 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-amber-400" />
            <div>
              <h2 className="font-bold text-base leading-tight font-serif">Statutory Legal Glossary</h2>
              <p className="text-xs text-slate-300">Official definitions for common court terms</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search legal terms (e.g. ex parte, bail)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:border-blue-900"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            <Filter size={12} className="text-slate-500 shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 text-[11px] rounded font-semibold whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-blue-900 text-white' 
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Term List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <p>No legal terms found matching "{search}"</p>
            </div>
          ) : (
            filteredTerms.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-blue-950 text-sm font-serif capitalize">
                    {item.term}
                  </h3>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {item.definition}
                </p>
                <div className="p-2 rounded bg-white border border-slate-200 text-xs italic text-slate-600 font-serif">
                  <span className="font-sans font-bold not-italic text-slate-500 mr-1">Usage Example:</span>
                  "{item.example}"
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
