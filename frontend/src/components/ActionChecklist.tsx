import { useState } from 'react';
import { CheckSquare, Square, Info, CheckCircle } from 'lucide-react';
import type { SupportedLanguage } from '../data/translations';
import { UI_TRANSLATIONS } from '../data/translations';

interface Props {
  lang?: SupportedLanguage;
}

export default function ActionChecklist({ lang = 'en' }: Props) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({
    0: true
  });

  const t = (key: string) => UI_TRANSLATIONS[lang]?.[key] || UI_TRANSLATIONS.en[key] || key;

  const checklistTranslations: Record<SupportedLanguage, Array<{ title: string; description: string; urgency: string }>> = {
    en: [
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
    ],
    hi: [
      {
        title: "कैलेंडर पर अगली सुनवाई तिथि अंकित करें",
        description: "आगामी सुनवाई की तारीख को अपने कैलेंडर में नोट करें और 3 दिन पहले का रिमाइंडर सेट करें।",
        urgency: "High"
      },
      {
        title: "अनुपालन रसीदें और बैंक पर्चियां व्यवस्थित रखें",
        description: "यदि गुजारा भत्ता जमा करने का आदेश दिया गया है, तो बैंक जमा पर्ची और रसीद सुरक्षित रखें।",
        urgency: "High"
      },
      {
        title: "विधिक सहायता वकील के साथ प्रति साझा करें",
        description: "इस सारांश और प्रमाणित दस्तावेज़ की प्रति अपने नियुक्त विधिक सहायता वकील को भेजें।",
        urgency: "Medium"
      },
      {
        title: "अदालत के नकल अनुभाग से प्रमाणित प्रति प्राप्त करें",
        description: "यदि पुलिस या बैंक में प्रस्तुत करने की आवश्यकता हो तो अदालत के नकल अनुभाग से प्रमाणित प्रति प्राप्त करें।",
        urgency: "Low"
      }
    ],
    ta: [
      {
        title: "அடுத்த விசாரணை தேதியை நாட்காட்டியில் குறிக்கவும்",
        description: "வரவிருக்கும் விசாரணை தேதியை உங்கள் காலண்டரில் குறித்து 3 நாட்களுக்கு முன் நினைவூட்டல் அமைக்கவும்.",
        urgency: "High"
      },
      {
        title: "இணக்க ஆதார ரசீதுகளை ஒழுங்கமைக்கவும்",
        description: "ஜீவனாம்சம் செலுத்த உத்தரவிடப்பட்டால், வங்கி டெபாசிட் சீட்டுகள் மற்றும் ரசீதுகளை பாதுகாக்கவும்.",
        urgency: "High"
      },
      {
        title: "சட்ட உதவி வழக்கறிஞரிடம் நகலைப் பகிரவும்",
        description: "இந்த ஆணை சுருக்கத்தின் நகலை உங்கள் சட்ட உதவி வழக்கறிஞரிடம் பகிரவும்.",
        urgency: "Medium"
      },
      {
        title: "சான்றளிக்கப்பட்ட நகலைப் பெறவும்",
        description: "காவல்துறை அல்லது வங்கி சமர்ப்பிப்பிற்கு தேவைப்பட்டால் சான்றளிக்கப்பட்ட நகலை விண்ணப்பித்துப் பெறவும்.",
        urgency: "Low"
      }
    ],
    te: [
      {
        title: "క్యాలెండర్‌లో తదుపరి విచారణ తేదీని గుర్తించండి",
        description: "రాబోయే విచారణ తేదీని క్యాలెండర్‌లో నమోదు చేసుకోండి మరియు 3 రోజుల ముందు రిమైండర్ సెట్ చేయండి.",
        urgency: "High"
      },
      {
        title: "వర్తింపు రసీదులు మరియు ఆధారాలను భద్రపరచండి",
        description: "భత్యం చెల్లించాలని ఆదేశించినట్లయితే, బ్యాంక్ డిపాజిట్ స్లిప్పులు మరియు రసీదులను ఉంచండి.",
        urgency: "High"
      },
      {
        title: "న్యాయ సహాయ న్యాయవాదితో కాపీని పంచుకోండి",
        description: "ఈ ఆర్డర్ సారాంశం కాపీని మీ లీగల్ ఎయిడ్ న్యాయవాదికి ఫార్వార్డ్ చేయండి.",
        urgency: "Medium"
      },
      {
        title: "కోర్టు కాపీయిస్ట్ విభాగం నుండి సర్టిఫైడ్ కాపీని పొందండి",
        description: "పోలీసు లేదా బ్యాంకు సమర్పణకు అవసరమైతే సర్టిఫైడ్ కాపీ కోసం దరఖాస్తు చేయండి.",
        urgency: "Low"
      }
    ],
    kn: [
      {
        title: "ಕ್ಯಾಲೆಂಡರ್‌ನಲ್ಲಿ ಮುಂದಿನ ವಿಚಾರಣೆ ದಿನಾಂಕವನ್ನು ಗುರುತಿಸಿ",
        description: "ಮುಂಬರುವ ವಿಚಾರಣೆ ದಿನಾಂಕವನ್ನು ನಿಮ್ಮ ಕ್ಯಾಲೆಂಡರ್‌ನಲ್ಲಿ ಬರೆದಿಡಿ ಮತ್ತು 3 ದಿನ ಮುಂಚಿತವಾಗಿ ಜ್ಞಾಪನೆಯನ್ನು ಹೊಂದಿಸಿ.",
        urgency: "High"
      },
      {
        title: "ಅನುಸರಣೆ ರಸೀದಿಗಳನ್ನು ಸಂಘಟಿಸಿ",
        description: "ಜೀವನಾಂಶ ಪಾವತಿಸಲು ನಿರ್ದೇಶಿಸಿದ್ದರೆ, ಬ್ಯಾಂಕ್ ಠೇವಣಿ ರಸೀದಿಗಳನ್ನು ಉಳಿಸಿಕೊಳ್ಳಿ.",
        urgency: "High"
      },
      {
        title: "ಕಾನೂನು ನೆರವು ವಕೀಲರೊಂದಿಗೆ ಪ್ರತಿಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ",
        description: "ಈ ಆದೇಶದ ಸಾರಾಂಶದ ಪ್ರತಿಯನ್ನು ನಿಮ್ಮ ನೇಮಕಗೊಂಡ ಕಾನೂನು ನೆರವು ವಕೀಲರಿಗೆ ಕಳುಹಿಸಿ.",
        urgency: "Medium"
      },
      {
        title: "ನ್ಯಾಯಾಲಯದಿಂದ ಪ್ರಮಾಣೀಕೃತ ಪ್ರತಿಯನ್ನು ಪಡೆಯಿರಿ",
        description: "ಪೊಲೀಸ್ ಅಥವಾ ಬ್ಯಾಂಕ್ ಸಲ್ಲಿಕೆಗೆ ಅಗತ್ಯವಿದ್ದರೆ ಪ್ರಮಾಣೀಕೃತ ಪ್ರತಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.",
        urgency: "Low"
      }
    ],
    bn: [
      {
        title: "ক্যালেন্ডারে পরবর্তী শুনানির তারিখ চিহ্নিত করুন",
        description: "আসন্ন শুনানির তারিখটি আপনার ব্যক্তিগত ক্যালেন্ডারে লিখে রাখুন এবং ৩ দিন আগে অনুস্মারক সেট করুন।",
        urgency: "High"
      },
      {
        title: "সম্মতি ও অর্থপ্রদানের রসিদ সংগঠিত রাখুন",
        description: "খোরপোশ প্রদানের নির্দেশ দেওয়া হলে ব্যাঙ্ক ডিপোজিট স্লিপ এবং স্বীকৃতি রসিদ সংরক্ষণ করুন।",
        urgency: "High"
      },
      {
        title: "আইনি সহায়তা আইনজীবীর সাথে অনুলিপি ভাগ করুন",
        description: "এই আদেশের সারাংশ এবং নথির একটি কপি আপনার আইনি সহায়তা আইনজীবীকে পাঠান।",
        urgency: "Medium"
      },
      {
        title: "আদালত থেকে প্রত্যয়িত অনুলিপি সংগ্রহ করুন",
        description: "পুলিশ বা ব্যাঙ্কে জমা দেওয়ার জন্য প্রয়োজন হলে প্রত্যয়িত অনুলিপির জন্য আবেদন করুন।",
        urgency: "Low"
      }
    ],
    ml: [
      {
        title: "അടുത്ത വിചാരണ തീയതി കലണ്ടറിൽ കുറിക്കുക",
        description: "അടുത്ത വിചാരണ തീയതി കലണ്ടറിൽ രേഖപ്പെടുത്തി 3 ദിവസം മുൻപായി ഓർമ്മപ്പെടുത്തൽ വെയ്ക്കുക.",
        urgency: "High"
      },
      {
        title: "പണം നൽകിയതിന്റെ രസീതുകൾ സൂക്ഷിക്കുക",
        description: "ജീവനാംശം നൽകാനോ രേഖകൾ ഹാജരാക്കാനോ ഉത്തരവുണ്ടെങ്കിൽ ബാങ്ക് രസീതുകളും തെളിവുകളും സുരക്ഷിതമായി സൂക്ഷിക്കുക.",
        urgency: "High"
      },
      {
        title: "നിയമ സഹായ അഭിഭാഷകന് പകർപ്പ് കൈമാറുക",
        description: "ഈ ഉത്തരവിന്റെ പകർപ്പും വിവരങ്ങളും നിങ്ങളുടെ ലീഗൽ എയ്ഡ് വക്കീലിനോ DLSA അഭിഭാഷകനോ നൽകുക.",
        urgency: "Medium"
      },
      {
        title: "കോടതിയിൽ നിന്ന് സാക്ഷ്യപ്പെടുത്തിയ പകർപ്പ് വാങ്ങുക",
        description: "പോലീസിനോ ബാങ്കിനോ സമർപ്പിക്കേണ്ടതുണ്ടെങ്കിൽ കോടതി കോപ്പിയിസ്റ്റ് സെക്ഷനിൽ നിന്ന് സാക്ഷ്യപ്പെടുത്തിയ പകർപ്പിന് അപേക്ഷിക്കുക.",
        urgency: "Low"
      }
    ]
  };

  const checklistItems = checklistTranslations[lang] || checklistTranslations.en;

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
            {t('checklistTitle')}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{t('checklistSub')}</p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded">
          {completedCount} of {checklistItems.length} {t('stepCompleted')}
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
                    {item.urgency === 'High' ? t('highPriority') : item.urgency === 'Medium' ? t('mediumPriority') : t('lowPriority')}
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
        <span>{t('dlsaNote')}</span>
      </div>
    </div>
  );
}
