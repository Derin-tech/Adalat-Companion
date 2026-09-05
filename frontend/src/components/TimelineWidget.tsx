import { Calendar, Clock, CheckCircle2, Scale, ArrowRight } from 'lucide-react';
import type { KeyFacts } from '../data/sampleOrders';

interface Props {
  keyFacts: KeyFacts;
  darkMode?: boolean;
}

export default function TimelineWidget({ keyFacts }: Props) {
  const nextDateStr = keyFacts.nextHearingDate;
  
  let daysRemaining: number | null = null;
  if (nextDateStr) {
    const nextDate = new Date(nextDateStr);
    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const milestones = [
    { title: "Case Institution", date: "Initial Filing", status: "completed" },
    { title: keyFacts.stage || "Interim Stage", date: keyFacts.orderDate, status: "current" },
    { title: "Compliance Review", date: keyFacts.nextHearingDate || "TBD", status: "upcoming" },
    { title: "Final Disposal", date: "Future Date", status: "future" }
  ];

  return (
    <div className="govt-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
            <Scale className="text-blue-900" size={18} />
            Official Judicial Case Progression & Schedule
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{keyFacts.courtName}</p>
        </div>

        {nextDateStr && (
          <div className="flex items-center gap-2 p-2 px-3 rounded bg-blue-50 border border-blue-200 text-blue-950">
            <Calendar className="text-blue-900 shrink-0" size={16} />
            <div className="text-xs">
              <span className="block text-[10px] uppercase font-bold text-slate-500">Next Scheduled Hearing</span>
              <span className="font-bold">{nextDateStr}</span>
            </div>
            {daysRemaining !== null && daysRemaining > 0 && (
              <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-blue-900 text-white rounded">
                {daysRemaining} Days Away
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative my-4">
        {milestones.map((item, idx) => (
          <div 
            key={idx}
            className={`p-3 rounded border relative ${
              item.status === 'current'
                ? 'bg-blue-50 border-blue-900 font-bold'
                : item.status === 'completed'
                ? 'bg-slate-50 border-slate-300 text-slate-700'
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                item.status === 'current' ? 'bg-blue-900 text-white' :
                item.status === 'completed' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {item.status === 'current' ? 'Active' : item.status === 'completed' ? 'Done' : 'Upcoming'}
              </span>
              {item.status === 'completed' && <CheckCircle2 size={14} className="text-emerald-700" />}
              {item.status === 'current' && <Clock size={14} className="text-blue-900" />}
            </div>

            <h4 className="font-bold text-xs mb-0.5 text-slate-900">{item.title}</h4>
            <p className="text-[11px] text-slate-500">{item.date}</p>

            {idx < milestones.length - 1 && (
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                <ArrowRight size={12} className="text-slate-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
