import { useState } from 'react';
import { CheckSquare, Square, Info, CheckCircle } from 'lucide-react';

export default function ActionChecklist() {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({
    0: true
  });

  const checklistItems = [
    {
      title: "Mark Next Hearing Date on Calendar",
      description: "Note down the upcoming hearing date on your personal calendar and set a reminder 3 days prior.",
      urgency: "High"
    },
    {
      title: "Organize Proof of Compliance Receipts",
      description: "If directed to pay maintenance or surrender documents, retain bank deposit slips and acknowledgment receipts.",
      urgency: "High"
    },
    {
      title: "Share Copy with Legal-Aid Counsel",
      description: "Forward a copy of this order summary and certified document to your appointed legal aid lawyer or DLSA advocate.",
      urgency: "Medium"
    },
    {
      title: "Obtain Certified Copy from Court Copyist Section",
      description: "Apply for a certified copy from the court copyist section if required for police or bank submission.",
      urgency: "Low"
    }
  ];

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="govt-card p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
            <CheckSquare className="text-emerald-700" size={18} />
            Litigant Next Steps & Compliance Checklist
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Procedural steps recommended for self-represented litigants</p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded">
          {completedCount} of {checklistItems.length} Step Completed
        </span>
      </div>

      <div className="space-y-2.5">
        {checklistItems.map((item, idx) => {
          const isChecked = !!checkedItems[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`p-3 rounded border cursor-pointer transition-colors flex items-start gap-3 ${
                isChecked
                  ? 'bg-emerald-50 border-emerald-300 text-slate-800'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <button className="mt-0.5 shrink-0 text-emerald-700">
                {isChecked ? <CheckCircle size={18} className="fill-emerald-700 text-white" /> : <Square size={18} className="text-slate-400" />}
              </button>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`font-bold text-xs ${isChecked ? 'line-through opacity-70' : 'text-slate-900'}`}>
                    {item.title}
                  </h4>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    item.urgency === 'High' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                    item.urgency === 'Medium' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                    'bg-stone-50 text-slate-700 border border-slate-200'
                  }`}>
                    {item.urgency} Priority
                  </span>
                </div>
                <p className={`text-xs mt-0.5 leading-relaxed ${isChecked ? 'opacity-60' : 'text-slate-600'}`}>
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 rounded bg-slate-100 border border-blue-200 text-xs text-blue-950 flex items-center gap-2">
        <Info size={16} className="shrink-0 text-slate-800" />
        <span>For free advocate assistance, contact your District Legal Services Authority (DLSA) or dial Toll-Free <strong>15100</strong>.</span>
      </div>
    </div>
  );
}
