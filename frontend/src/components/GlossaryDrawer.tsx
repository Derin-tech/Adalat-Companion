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
  },
  {
    term: "anticipatory bail",
    category: "Procedural",
    definition: "A direction issued by a Sessions Court or High Court granting advance bail to a person expecting arrest in a non-bailable offence.",
    example: "The applicant sought anticipatory bail fearing arrest under Section 498A."
  },
  {
    term: "vakalatnama",
    category: "Procedural",
    definition: "A written authorization document signed by a litigant permitting an advocate to represent them in court proceedings.",
    example: "Advocate Roy filed his vakalatnama on behalf of the petitioner."
  },
  {
    term: "caveat",
    category: "Procedural",
    definition: "A formal notice filed in court asking that no order or decree be passed without giving prior hearing notice to the caveator.",
    example: "The respondent filed a caveat to ensure they are heard before any ex-parte stay is granted."
  },
  {
    term: "amicus curiae",
    category: "Parties",
    definition: "A 'friend of the court'—an independent lawyer appointed by the judge to assist the court on complex legal questions.",
    example: "The High Court appointed a senior advocate as amicus curiae to examine environmental compliance."
  },
  {
    term: "locus standi",
    category: "Procedural",
    definition: "The legal right of a party to bring a case or demonstrate sufficient connection to the matter before court.",
    example: "The court questioned whether the petitioner had locus standi to challenge the tender process."
  },
  {
    term: "adjournment sine die",
    category: "Order Type",
    definition: "Postponement of a court hearing indefinitely without fixing a specific future date.",
    example: "The hearing was adjourned sine die awaiting the Supreme Court verdict."
  },
  {
    term: "mesne profits",
    category: "Financial",
    definition: "Profits or rent earned by a person in wrongful possession of a property, which must be paid back to the rightful owner.",
    example: "The tenant holding over after lease expiry was directed to pay ₹15,000 monthly as mesne profits."
  },
  {
    term: "garnishee order",
    category: "Financial",
    definition: "A court order directing a third party (like a bank holding money for a debtor) to pay that money directly to a creditor.",
    example: "The creditor obtained a garnishee order attaching the debtor's savings account."
  },
  {
    term: "alimony / permanent alimony",
    category: "Financial",
    definition: "A lump-sum or ongoing financial allowance ordered by a court to be paid by one spouse to another after divorce.",
    example: "The court decreed permanent alimony of ₹15 Lakhs payable within 3 months."
  },
  {
    term: "res judicata",
    category: "Procedural",
    definition: "A legal principle preventing the same issue between the same parties from being re-litigated once decided by a competent court.",
    example: "The suit was dismissed as barred by res judicata since the dispute was already decided in 2022."
  },
  {
    term: "suo motu",
    category: "Procedural",
    definition: "An action taken by a court on its own authority without waiting for a formal application from any party.",
    example: "The High Court took suo motu cognizance of the hospital fire incident."
  },
  {
    term: "writ petition",
    category: "Order Type",
    definition: "A formal application filed before a High Court or the Supreme Court seeking enforcement of fundamental or statutory rights.",
    example: "Filed a writ of Habeas Corpus to produce the missing person."
  },
  {
    term: "quashing",
    category: "Order Type",
    definition: "An order by a High Court setting aside or cancelling an FIR, criminal proceeding, or lower court order.",
    example: "The High Court allowed the petition and quashed the criminal proceedings based on a compromise settlement."
  },
  {
    term: "interlocutory order",
    category: "Order Type",
    definition: "A temporary or provisional order passed during the pendency of a case before final disposal.",
    example: "The interlocutory order granted temporary custody of minor children during summer vacation."
  },
  {
    term: "power of attorney",
    category: "Parties",
    definition: "A legal authorization giving a trusted person power to act on another's behalf in legal and financial matters.",
    example: "The NRI owner appeared in court through his registered Power of Attorney holder."
  },
  {
    term: "appellant",
    category: "Parties",
    definition: "The party appealing a lower court decision to a higher appellate court seeking to overturn or modify the judgment.",
    example: "The appellant filed an appeal against the trial court conviction."
  },
  {
    term: "charge sheet / final report",
    category: "Procedural",
    definition: "The official report submitted by investigating police officers to the Magistrate stating sufficient evidence exists for trial.",
    example: "Police submitted a 200-page charge sheet under IPC sections 420 and 406."
  },
  {
    term: "compromise deed / settlement terms",
    category: "Order Type",
    definition: "A formal written agreement between opposing parties settling their court dispute amicably.",
    example: "The suit was disposed of in terms of the compromise deed signed by both parties."
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
                <h2 id="glossary-title" className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wider text-slate-950">
                  Statutory Legal Glossary
                </h2>
                <p className="text-sm font-serif italic text-slate-700 mt-1">
                  Official definitions & statutory terms for self-represented litigants
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
              className="w-full h-12 pl-10 pr-10 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-slate-400 shadow-sm transition-all font-serif"
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
                className={`px-3.5 py-1.5 text-sm rounded-lg font-serif font-semibold whitespace-nowrap transition-colors ${
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
              <h3 className="text-lg font-serif font-medium text-slate-900 mb-1">No terms found</h3>
              <p className="text-sm font-serif text-slate-600">Try searching for another legal term.</p>
            </div>
          ) : (
            filteredTerms.map((item, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-bold text-blue-950 text-xl font-serif capitalize leading-tight">
                    {item.term}
                  </h3>
                  <span className="shrink-0 text-[10px] tracking-wider uppercase font-serif font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    {item.category}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-serif text-slate-900 leading-relaxed">
                  {item.definition}
                </p>
                <div className="mt-4 p-3.5 rounded-lg bg-amber-50/50 border border-amber-200/60 text-sm text-slate-800">
                  <span className="block font-serif font-bold text-xs text-amber-950 uppercase tracking-wide mb-1">Usage Example</span>
                  <span className="italic font-serif text-slate-900 leading-relaxed block text-sm sm:text-base">"{item.example}"</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
