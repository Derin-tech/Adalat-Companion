import { Calendar, Clock, CheckCircle2, Scale, ArrowRight, AlertTriangle, ShieldAlert, FileWarning, BellRing } from 'lucide-react';
import type { KeyFacts } from '../data/sampleOrders';
import type { SupportedLanguage } from '../data/translations';
import { UI_TRANSLATIONS, translateLegalText } from '../data/translations';

interface Props {
  keyFacts: KeyFacts;
  keyDates?: any[];
  whatYouNeedToDo?: string[];
  lang?: SupportedLanguage;
  darkMode?: boolean;
}

export default function TimelineWidget({ keyFacts, keyDates = [], whatYouNeedToDo = [], lang = 'en' }: Props) {
  const nextDateStr = keyFacts.nextHearingDate;
  const t = (key: string) => UI_TRANSLATIONS[lang]?.[key] || UI_TRANSLATIONS.en[key] || key;
  
  let daysRemaining: number | null = null;
  let isUrgent = false;

  if (nextDateStr) {
    const nextDate = new Date(nextDateStr);
    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (daysRemaining !== null && daysRemaining <= 7 && daysRemaining >= 0) {
      isUrgent = true;
    }
  }

  // Parse emergency / urgent items from keyDates or whatYouNeedToDo
  const emergencyItems: string[] = [];
  const normalDates: { date: string; description: string; isEmergency: boolean }[] = [];

  const urgentKeywords = [
    '48 hours', '7 days', 'immediately', 'surrender passport', 'warrant',
    'bailable warrant', 'non-bailable', 'arrest', 'interim maintenance',
    'pay on or before', 'compliance', 'restrained', 'contempt'
  ];

  keyDates.forEach((kd) => {
    const dateStr = typeof kd === 'string' ? kd : `${kd.date || ''}: ${kd.event || ''}`;
    const lower = dateStr.toLowerCase();
    const isEmerg = urgentKeywords.some(k => lower.includes(k));
    if (isEmerg) {
      emergencyItems.push(dateStr);
    }
    normalDates.push({
      date: typeof kd === 'object' && kd.date ? kd.date : 'Date Specified',
      description: typeof kd === 'object' && kd.event ? kd.event : dateStr,
      isEmergency: isEmerg
    });
  });

  whatYouNeedToDo.forEach((step) => {
    const lower = step.toLowerCase();
    if (urgentKeywords.some(k => lower.includes(k)) && !emergencyItems.includes(step)) {
      emergencyItems.push(step);
    }
  });

  const milestoneTitles: Record<SupportedLanguage, { institution: string; review: string; disposal: string; active: string; done: string; upcoming: string }> = {
    en: { institution: "Case Institution", review: "Compliance Review", disposal: "Final Disposal", active: "Active Stage", done: "Completed", upcoming: "Scheduled" },
    hi: { institution: "मामला दाखिला", review: "अनुपालन समीक्षा", disposal: "अंतिम निस्तारण", active: "सक्रिय चरण", done: "पूर्ण", upcoming: "अनुसूचित" },
    ta: { institution: "வழக்கு தாக்கல்", review: "இணக்க மதிப்பாய்வு", disposal: "இறுதி தீர்வு", active: "செயலில்", done: "முடிந்தது", upcoming: "திட்டமிடப்பட்டது" },
    te: { institution: "కేసు దాఖలు", review: "వర్తింపు సమీక్ష", disposal: "తుది పరిష్కారం", active: "యాక్టివ్", done: "పూర్తయింది", upcoming: "షెడ్యూల్ చేయబడింది" },
    kn: { institution: "ಪ್ರಕರಣ ದಾಖಲಾತಿ", review: "ಅನುಸರಣೆ ಪರಿಶೀಲನೆ", disposal: "ಅಂತಿಮ ವಿಲೇವಾರಿ", active: "ಸಕ್ರಿಯ", done: "ಪೂರ್ಣಗೊಂಡಿದೆ", upcoming: "ನಿಗದಿಪಡಿಸಲಾಗಿದೆ" },
    bn: { institution: "মামলা দায়ের", review: "সম্মতি পর্যালোচনা", disposal: "চূড়ান্ত নিষ্পত্তি", active: "সক্রিয় পর্যায়", done: "সম্পন্ন", upcoming: "নির্ধারিত" },
    ml: { institution: "കേസ് ഫയലിംഗ്", review: "ഉത്തരവ് പാലിക്കൽ പരിശോധന", disposal: "അന്തിമ വിധി", active: "നിലവിലെ ഘട്ടം", done: "പൂർത്തിയായി", upcoming: "തീരുമാനിച്ചത്" }
  };

  const currentTitles = milestoneTitles[lang] || milestoneTitles.en;

  const milestones = [
    { title: currentTitles.institution, date: "Filing Stage", status: "completed" },
    { title: translateLegalText(keyFacts.stage || "Current Proceeding Stage", lang), date: keyFacts.orderDate || "Active Order", status: "current" },
    { title: currentTitles.review, date: keyFacts.nextHearingDate || "Next Hearing TBD", status: "upcoming" },
    { title: currentTitles.disposal, date: "Final Decree Stage", status: "future" }
  ];

  return (
    <div className="space-y-6">
      {/* 🚨 EMERGENCY / URGENT DEADLINES HIGHLIGHT BANNER */}
      {(emergencyItems.length > 0 || isUrgent) && (
        <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-r-lg border border-red-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-red-950 font-display flex items-center gap-1.5">
                <ShieldAlert size={18} className="text-red-700" />
                🚨 CRITICAL EMERGENCY DEADLINES & COMPLIANCE ALERTS
              </h4>
            </div>
            <span className="px-2.5 py-1 bg-red-700 text-white font-mono font-bold text-xs rounded uppercase">
              HIGH PRIORITY ATTENTION REQUIRED
            </span>
          </div>

          <ul className="space-y-2 pt-1">
            {emergencyItems.map((item, idx) => (
              <li key={idx} className="bg-white p-3 rounded border-l-4 border-red-600 border border-red-200 text-xs sm:text-sm font-serif font-bold text-red-950 shadow-sm flex items-start gap-2.5">
                <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-sans text-[11px] uppercase tracking-wide text-red-700 font-extrabold mb-0.5">Emergency Action Required:</span>
                  <span>{item}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="p-2.5 bg-red-100/70 rounded border border-red-200 text-[11px] font-sans text-red-900 flex items-center gap-2">
            <FileWarning size={14} className="shrink-0 text-red-700" />
            <span><strong>Consequence Notice:</strong> Failure to comply with court deadlines may result in adverse orders, loss of interim protection, or issuance of warrants.</span>
          </div>
        </div>
      )}

      {/* MAIN SCHEDULE & MILESTONE TIMELINE CARD */}
      <div className="govt-card p-6 bg-[#fdfdfa] border border-slate-300">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-300">
          <div>
            <h3 className="text-lg font-bold font-display uppercase tracking-wider text-slate-950 flex items-center gap-2">
              <Scale className="text-blue-900" size={20} />
              {t('timelineTitle')}
            </h3>
            <p className="text-xs font-serif italic text-slate-600 mt-0.5">{translateLegalText(keyFacts.courtName || "District Judicial Forum", lang)}</p>
          </div>

          {nextDateStr && (
            <div className={`flex items-center gap-3 p-3 rounded-lg border shadow-sm ${
              isUrgent ? 'bg-red-100 border-red-300 text-red-950' : 'bg-slate-100 border-slate-300 text-slate-950'
            }`}>
              <Calendar className={`${isUrgent ? 'text-red-700' : 'text-blue-900'} shrink-0`} size={20} />
              <div className="text-xs font-serif">
                <span className="block font-sans text-[10px] uppercase font-bold text-slate-600">{t('nextHearingAlert')}</span>
                <span className="font-bold text-sm">{nextDateStr}</span>
              </div>
              {daysRemaining !== null && daysRemaining >= 0 && (
                <span className={`ml-2 px-2.5 py-1 text-xs font-mono font-bold rounded ${
                  daysRemaining <= 7 ? 'bg-red-700 text-white animate-pulse' : 'bg-slate-800 text-white'
                }`}>
                  {daysRemaining} {t('daysAway')}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Visual Milestones */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative my-4">
          {milestones.map((item, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-md border relative ${
                item.status === 'current'
                  ? 'bg-amber-50/90 border-amber-500 shadow-sm'
                  : item.status === 'completed'
                  ? 'bg-slate-50 border-slate-300 text-slate-700'
                  : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-sans font-bold uppercase px-2 py-0.5 rounded ${
                  item.status === 'current' ? 'bg-amber-600 text-slate-950' :
                  item.status === 'completed' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {item.status === 'current' ? currentTitles.active : item.status === 'completed' ? currentTitles.done : currentTitles.upcoming}
                </span>
                {item.status === 'completed' && <CheckCircle2 size={16} className="text-emerald-700" />}
                {item.status === 'current' && <Clock size={16} className="text-amber-700" />}
              </div>

              <h4 className="font-serif font-bold text-xs sm:text-sm mb-1 text-slate-950">{item.title}</h4>
              <p className="text-xs font-mono text-slate-600">{item.date}</p>

              {idx < milestones.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight size={14} className="text-slate-400" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detailed Itemized Dates List */}
        {normalDates.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
            <h4 className="text-xs font-display uppercase tracking-wider text-slate-900 font-bold flex items-center gap-1.5">
              <BellRing size={14} className="text-amber-600" />
              Itemized Hearing & Order Compliance Schedule
            </h4>
            <div className="grid gap-2">
              {normalDates.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded border flex items-start justify-between gap-3 text-xs font-serif ${
                    item.isEmergency ? 'bg-red-50/70 border-red-300 text-red-950 font-bold' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-sans font-bold text-[10px] uppercase tracking-wide text-slate-500 block">
                      {item.date}
                    </span>
                    <span className="leading-relaxed text-sm block">{item.description}</span>
                  </div>
                  {item.isEmergency && (
                    <span className="shrink-0 px-2 py-0.5 bg-red-700 text-white font-sans text-[10px] font-bold rounded uppercase">
                      Urgent
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

