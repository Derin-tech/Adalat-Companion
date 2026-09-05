import { Calendar, Clock, CheckCircle2, Scale, ArrowRight } from 'lucide-react';
import type { KeyFacts } from '../data/sampleOrders';
import type { SupportedLanguage } from '../data/translations';
import { UI_TRANSLATIONS, translateLegalText } from '../data/translations';

interface Props {
  keyFacts: KeyFacts;
  lang?: SupportedLanguage;
  darkMode?: boolean;
}

export default function TimelineWidget({ keyFacts, lang = 'en' }: Props) {
  const nextDateStr = keyFacts.nextHearingDate;
  const t = (key: string) => UI_TRANSLATIONS[lang]?.[key] || UI_TRANSLATIONS.en[key] || key;
  
  let daysRemaining: number | null = null;
  if (nextDateStr) {
    const nextDate = new Date(nextDateStr);
    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const milestoneTitles: Record<SupportedLanguage, { institution: string; review: string; disposal: string; active: string; done: string; upcoming: string }> = {
    en: { institution: "Case Institution", review: "Compliance Review", disposal: "Final Disposal", active: "Active", done: "Done", upcoming: "Upcoming" },
    hi: { institution: "मामला दाखिला", review: "अनुपालन समीक्षा", disposal: "अंतिम निस्तारण", active: "सक्रिय", done: "पूर्ण", upcoming: "आगामी" },
    ta: { institution: "வழக்கு தாக்கல்", review: "இணக்க மதிப்பாய்வு", disposal: "இறுதி தீர்வு", active: "செயலில்", done: "முடிந்தது", upcoming: "வரவிருக்கும்" },
    te: { institution: "కేసు దాఖలు", review: "వర్తింపు సమీక్ష", disposal: "తుది పరిష్కారం", active: "యాక్టివ్", done: "పూర్తయింది", upcoming: "రాబోయేది" },
    kn: { institution: "ಪ್ರಕರಣ ದಾಖಲಾತಿ", review: "ಅನುಸರಣೆ ಪರಿಶೀಲನೆ", disposal: "ಅಂತಿಮ ವಿಲೇವಾರಿ", active: "ಸಕ್ರಿಯ", done: "ಪೂರ್ಣಗೊಂಡಿದೆ", upcoming: "ಮುಂಬರುವ" },
    bn: { institution: "মামলা দায়ের", review: "সম্মতি পর্যালোচনা", disposal: "চূড়ান্ত নিষ্পত্তি", active: "সক্রিয়", done: "সম্পন্ন", upcoming: "আসন্ন" },
    ml: { institution: "കേസ് ഫയലിംഗ്", review: "ഉത്തരവ് പാലിക്കൽ പരിശോധന", disposal: "അന്തിമ വിധി", active: "നിലവിൽ", done: "പൂർത്തിയായി", upcoming: "അടുത്തത്" }
  };

  const currentTitles = milestoneTitles[lang] || milestoneTitles.en;

  const milestones = [
    { title: currentTitles.institution, date: "Initial Filing", status: "completed" },
    { title: translateLegalText(keyFacts.stage || "Interim Stage", lang), date: keyFacts.orderDate, status: "current" },
    { title: currentTitles.review, date: keyFacts.nextHearingDate || "TBD", status: "upcoming" },
    { title: currentTitles.disposal, date: "Future Date", status: "future" }
  ];

  return (
    <div className="govt-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold font-serif text-slate-900 flex items-center gap-2">
            <Scale className="text-slate-800" size={18} />
            {t('timelineTitle')}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{translateLegalText(keyFacts.courtName, lang)}</p>
        </div>

        {nextDateStr && (
          <div className="flex items-center gap-2 p-2 px-3 rounded bg-slate-100 border border-blue-200 text-blue-950">
            <Calendar className="text-slate-800 shrink-0" size={16} />
            <div className="text-xs">
              <span className="block text-[10px] uppercase font-bold text-slate-500">{t('nextHearingAlert')}</span>
              <span className="font-bold">{nextDateStr}</span>
            </div>
            {daysRemaining !== null && daysRemaining > 0 && (
              <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-slate-700 text-white rounded">
                {daysRemaining} {t('daysAway')}
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
                ? 'bg-slate-100 border-slate-700 font-bold'
                : item.status === 'completed'
                ? 'bg-slate-50 border-slate-300 text-slate-700'
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                item.status === 'current' ? 'bg-slate-700 text-white' :
                item.status === 'completed' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {item.status === 'current' ? currentTitles.active : item.status === 'completed' ? currentTitles.done : currentTitles.upcoming}
              </span>
              {item.status === 'completed' && <CheckCircle2 size={14} className="text-emerald-700" />}
              {item.status === 'current' && <Clock size={14} className="text-slate-800" />}
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
