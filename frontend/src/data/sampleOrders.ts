export interface Clause {
  id: string;
  originalText: string;
  plainText: string;
  pageNumber: number;
}

export interface KeyFacts {
  caseTitle: string;
  cnrNumber: string;
  courtName: string;
  judgeName: string;
  parties: string[];
  nextHearingDate: string | null;
  stage: string | null;
  orderDate: string;
}

export interface SampleOrder {
  id: string;
  title: string;
  badge: string;
  description: string;
  rawOrderText: string;
  keyFacts: KeyFacts;
  plainSummary: Record<string, string>; // lang key -> text
  clauses: Record<string, Clause[]>;     // lang key -> clauses
  changedFromPrevious?: {
    changed: boolean;
    changes: string[];
  };
}

export const SAMPLE_ORDERS: SampleOrder[] = [
  {
    id: "sample-maintenance",
    title: "Interim Maintenance Order",
    badge: "Family Court",
    description: "Order directing monthly maintenance payment during divorce proceedings.",
    rawOrderText: "The Respondent is hereby directed to remit a sum of ₹10,000/- per mensum towards the interim maintenance of the Petitioner on or before the 5th day of every calendar month, commencing from 01.01.2026. Matter stands adjourned to 15.03.2026 for compliance.",
    keyFacts: {
      caseTitle: "Anita Sharma vs. Rahul Sharma",
      cnrNumber: "MHBO010001232026",
      courtName: "Family Court No. 3, Mumbai",
      judgeName: "Hon'ble Justice S. K. Kulkarni",
      parties: ["Anita Sharma (Petitioner)", "Rahul Sharma (Respondent)"],
      nextHearingDate: "2026-03-15",
      stage: "Interim Maintenance Stage",
      orderDate: "2026-01-10"
    },
    changedFromPrevious: {
      changed: true,
      changes: [
        "Monthly interim maintenance increased from ₹8,000 to ₹10,000.",
        "Strict deadline set: Payment must reach petitioner by the 5th of every month.",
        "Next hearing fixed for March 15, 2026 for compliance verification."
      ]
    },
    plainSummary: {
      en: "The court has ordered the husband (respondent) to pay an interim monthly maintenance of ₹10,000 to the wife (petitioner) starting January 1, 2026. This money must be deposited directly into her bank account by the 5th of every month to cover living expenses while the case continues. The next court hearing is set for March 15, 2026.",
      hi: "अदालत ने पति (प्रतिवादी) को 1 जनवरी 2026 से पत्नी (याचिकाकर्ता) को ₹10,000 का अंतरिम मासिक गुजारा भत्ता देने का आदेश दिया है। यह राशि हर महीने की 5 तारीख तक सीधे उनके बैंक खाते में जमा की जानी चाहिए। अगली सुनवाई 15 मार्च 2026 तय की गई है।",
      ta: "நீதிமன்றம் கணவரை (பதில் மனுதாரர்) ஜனவரி 1, 2026 முதல் மனைவிக்கும் (மனுதாரர்) மாதம் ₹10,000 இடைக்கால ஜீவனாம்சம் வழங்க உத்தரவிட்டுள்ளது. ஒவ்வொரு மாதமும் 5ஆம் தேதிக்குள் நேரடியாக வங்கிச் கணக்கில் செலுத்த வேண்டும். அடுத்த விசாரணை மார்ச் 15, 2026 அன்று நடைபெறும்.",
      te: "కోర్టు భర్త (ప్రతివాది) కి జనవరి 1, 2026 నుండి భార్య (పిటిషనర్) కి నెలకు ₹10,000 తాత్కాలిక నిర్వహణ భత్యం చెల్లించాలని ఆదేశించింది. ప్రతి నెల 5వ తేదీలోగా ఆమె బ్యాంక్ ఖాతాలో జమ చేయాలి. తదుపరి విచారణ మార్చి 15, 2026న జరగనుంది.",
      kn: "ಜನವರಿ 1, 2026 ರಿಂದ ಪತ್ನಿಗೆ (ಅರ್ಜಿದಾರರು) ತಿಂಗಳಿಗೆ ₹10,000 ಮಧ್ಯಂತರ ಜೀವನಾಂಶವನ್ನು ನೀಡುವಂತೆ ಕೋರ್ಟ್ ಪತಿಗೆ (ಪ್ರತಿವಾದಿ) ಆದೇಶಿಸಿದೆ. ಈ ಹಣವನ್ನು ಪ್ರತಿ ತಿಂಗಳ 5 ನೇ ತಾರೀಖಿನೊಳಗೆ ಅವರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮಾ ಮಾಡಬೇಕು. ಮುಂದಿನ ವಿಚಾರಣೆ ಮಾರ್ಚ್ 15, 2026 ರಂದು ನಿಗದಿಯಾಗಿದೆ.",
      bn: "আদালত স্বামীকে (উত্তরদাতা) ১ জানুয়ারী ২০২৬ থেকে স্ত্রীকে (আবেদনকারী) প্রতি মাসে ₹১০,০০০ অন্তর্বর্তীকালীন খোরপোশ প্রদানের নির্দেশ দিয়েছেন। প্রতি মাসের ৫ তারিখের মধ্যে এই অর্থ সরাসরি তাঁর ব্যাঙ্ক অ্যাকাউন্টে জমা করতে হবে। পরবর্তী শুনানি ১৫ মার্চ ২০২৬ নির্ধারণ করা হয়েছে।"
    },
    clauses: {
      en: [
        {
          id: "c1",
          originalText: "The Respondent is hereby directed to remit a sum of ₹10,000/- per mensum towards the interim maintenance of the Petitioner.",
          plainText: "The husband (respondent) must pay ₹10,000 every month for basic living expenses.",
          pageNumber: 1
        },
        {
          id: "c2",
          originalText: "Said remittance shall be made directly into the bank account of the Petitioner on or before the 5th day of every calendar month, commencing from 01.01.2026.",
          plainText: "The money must be transferred to the wife's bank account by the 5th day of each month, starting Jan 1, 2026.",
          pageNumber: 1
        },
        {
          id: "c3",
          originalText: "Matter stands adjourned to 15.03.2026 for compliance.",
          plainText: "The next hearing is fixed for March 15, 2026 to check if payments were made.",
          pageNumber: 2
        }
      ],
      hi: [
        {
          id: "c1",
          originalText: "The Respondent is hereby directed to remit a sum of ₹10,000/- per mensum towards the interim maintenance of the Petitioner.",
          plainText: "पति (प्रतिवादी) को बुनियादी जीवन यापन के लिए हर महीने ₹10,000 का भुगतान करना होगा।",
          pageNumber: 1
        },
        {
          id: "c2",
          originalText: "Said remittance shall be made directly into the bank account of the Petitioner on or before the 5th day of every calendar month, commencing from 01.01.2026.",
          plainText: "धनराशि 1 जनवरी 2026 से प्रत्येक महीने की 5 तारीख तक पत्नी के बैंक खाते में स्थानांतरित की जानी चाहिए।",
          pageNumber: 1
        },
        {
          id: "c3",
          originalText: "Matter stands adjourned to 15.03.2026 for compliance.",
          plainText: "भुगतान किया गया है या नहीं, इसकी जांच के लिए अगली सुनवाई 15 मार्च 2026 को तय की गई है।",
          pageNumber: 2
        }
      ],
      ta: [
        {
          id: "c1",
          originalText: "The Respondent is hereby directed to remit a sum of ₹10,000/- per mensum towards the interim maintenance of the Petitioner.",
          plainText: "கணவர் (எதிர்மனுதாரர்) அடிப்படை வாழ்க்கைச் செலவுகளுக்காக ஒவ்வொரு மாதமும் ₹10,000 செலுத்த வேண்டும்.",
          pageNumber: 1
        },
        {
          id: "c2",
          originalText: "Said remittance shall be made directly into the bank account of the Petitioner on or before the 5th day of every calendar month, commencing from 01.01.2026.",
          plainText: "ஜனவரி 1, 2026 முதல் ஒவ்வொரு மாதமும் 5ஆம் தேதிக்குள் மனைவியின் வங்கிக் கணக்கிற்கு பணம் மாற்றப்பட வேண்டும்.",
          pageNumber: 1
        },
        {
          id: "c3",
          originalText: "Matter stands adjourned to 15.03.2026 for compliance.",
          plainText: "பணம் செலுத்தப்பட்டதா என்பதை சரிபார்க்க அடுத்த விசாரணை மார்ச் 15, 2026 அன்று நிர்ணயிக்கப்பட்டுள்ளது.",
          pageNumber: 2
        }
      ],
      te: [
        {
          id: "c1",
          originalText: "The Respondent is hereby directed to remit a sum of ₹10,000/- per mensum towards the interim maintenance of the Petitioner.",
          plainText: "భర్త (ప్రతివాది) ప్రాథమిక జీవన ఖర్చుల కోసం ప్రతి నెలా ₹10,000 చెల్లించాలి.",
          pageNumber: 1
        },
        {
          id: "c2",
          originalText: "Said remittance shall be made directly into the bank account of the Petitioner on or before the 5th day of every calendar month, commencing from 01.01.2026.",
          plainText: "జనవరి 1, 2026 నుండి ప్రతి నెలా 5వ తేదీలోగా భార్య బ్యాంక్ ఖాతాకు డబ్బు బదిలీ చేయాలి.",
          pageNumber: 1
        },
        {
          id: "c3",
          originalText: "Matter stands adjourned to 15.03.2026 for compliance.",
          plainText: "చెల్లింపులు జరిగాయో లేదో తనిఖీ చేయడానికి తదుపరి విచారణ మార్చి 15, 2026గా నిర్ణయించబడింది.",
          pageNumber: 2
        }
      ],
      kn: [
        {
          id: "c1",
          originalText: "The Respondent is hereby directed to remit a sum of ₹10,000/- per mensum towards the interim maintenance of the Petitioner.",
          plainText: "ಪತಿ (ಪ್ರತಿವಾದಿ) ಮೂಲ ಜೀವನ ವೆಚ್ಚಕ್ಕಾಗಿ ಪ್ರತಿ ತಿಂಗಳು ₹10,000 ಪಾವತಿಸಬೇಕು.",
          pageNumber: 1
        },
        {
          id: "c2",
          originalText: "Said remittance shall be made directly into the bank account of the Petitioner on or before the 5th day of every calendar month, commencing from 01.01.2026.",
          plainText: "ಜನವರಿ 1, 2026 ರಿಂದ ಪ್ರತಿ ತಿಂಗಳ 5 ನೇ ತಾರೀಖಿನೊಳಗೆ ಹಣವನ್ನು ಪತ್ನಿಯ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ವರ್ಗಾಯಿಸಬೇಕು.",
          pageNumber: 1
        },
        {
          id: "c3",
          originalText: "Matter stands adjourned to 15.03.2026 for compliance.",
          plainText: "ಪಾವತಿಗಳನ್ನು ಮಾಡಲಾಗಿದೆಯೇ ಎಂದು ಪರಿಶೀಲಿಸಲು ಮುಂದಿನ ವಿಚಾರಣೆಯನ್ನು ಮಾರ್ಚ್ 15, 2026 ಕ್ಕೆ ನಿಗದಿಪಡಿಸಲಾಗಿದೆ.",
          pageNumber: 2
        }
      ],
      bn: [
        {
          id: "c1",
          originalText: "The Respondent is hereby directed to remit a sum of ₹10,000/- per mensum towards the interim maintenance of the Petitioner.",
          plainText: "স্বামীকে (উত্তরদাতা) জীবনযাত্রার ব্যয়ের জন্য প্রতি মাসে ₹১০,০০০ দিতে হবে।",
          pageNumber: 1
        },
        {
          id: "c2",
          originalText: "Said remittance shall be made directly into the bank account of the Petitioner on or before the 5th day of every calendar month, commencing from 01.01.2026.",
          plainText: "১ জানুয়ারী ২০২৬ থেকে প্রতি মাসের ৫ তারিখের মধ্যে অর্থ স্ত্রীর ব্যাঙ্ক অ্যাকাউন্টে স্থানান্তর করতে হবে।",
          pageNumber: 1
        },
        {
          id: "c3",
          originalText: "Matter stands adjourned to 15.03.2026 for compliance.",
          plainText: "অর্থপ্রদান করা হয়েছে কিনা তা পরীক্ষা করার জন্য পরবর্তী শুনানি ১৫ মার্চ ২০২৬ নির্ধারিত হয়েছে।",
          pageNumber: 2
        }
      ]
    }
  },
  {
    id: "sample-adjournment",
    title: "Adjournment Order",
    badge: "District Court",
    description: "Order postponing hearing due to counsel absence and fixing next trial date.",
    rawOrderText: "At the request of learned counsel for the Respondent, who submits that senior counsel is unavailable today due to medical indisposition, the matter stands adjourned to 28.04.2026 for cross-examination of PW-1. Interim order, if any, to continue till the next date of hearing.",
    keyFacts: {
      caseTitle: "Sunil Kumar vs. Vikas Mehta",
      cnrNumber: "DLCT010043212026",
      courtName: "District Civil Court, Tis Hazari, Delhi",
      judgeName: "Hon'ble Judge A. K. Gupta",
      parties: ["Sunil Kumar (Plaintiff)", "Vikas Mehta (Defendant)"],
      nextHearingDate: "2026-04-28",
      stage: "Adjournment / Cross Examination",
      orderDate: "2026-01-20"
    },
    changedFromPrevious: {
      changed: true,
      changes: [
        "Hearing postponed to April 28, 2026 at respondent's request.",
        "Existing interim protection orders extended until the next hearing date."
      ]
    },
    plainSummary: {
      en: "The court has postponed today's hearing because the respondent's senior lawyer was unwell and could not attend. The case will next be heard on April 28, 2026 for questioning the main witness (PW-1). Any temporary stay or protection orders issued earlier remain active until that date.",
      hi: "अदालत ने आज की सुनवाई स्थगित कर दी है क्योंकि प्रतिवादी के वरिष्ठ वकील अस्वस्थता के कारण उपस्थित नहीं हो सके। मामले की अगली सुनवाई 28 अप्रैल 2026 को मुख्य गवाह (PW-1) से जिरह के लिए होगी। पहले दिए गए सभी अंतरिम संरक्षण आदेश अगली सुनवाई तक जारी रहेंगे।",
      ta: "எதிர்தரப்பு வழக்கறிஞர் உடல்நலக் குறைவால் வர முடியாததால் வழக்கு ஏப்ரல் 28, 2026 ஆம் தேதிக்கு ஒத்திவைக்கப்பட்டுள்ளது. சாட்சி PW-1 குறுக்கு விசாரணை செய்யப்படும்.",
      te: "ప్రతివాది తరఫు న్యాయవాది అనారోగ్యం కారణంగా నేటి విచారణను ఏప్రిల్ 28, 2026కి వాయిదా వేశారు. సాక్షి PW-1 విచారణ జరుగుతుంది.",
      kn: "ವಕೀಲರ ಅನಾರೋಗ್ಯದ ಕಾರಣ ಇಂದಿನ ವಿಚಾರಣೆಯನ್ನು ಏಪ್ರಿಲ್ 28, 2026ಕ್ಕೆ ಮುಂದೂಡಲಾಗಿದೆ. ಸಾಕ್ಷಿ PW-1 ಪಾಟಿಸವಾಲು ನಡೆಯಲಿದೆ.",
      bn: "আইনজীবীর অসুস্থতার কারণে আজকের শুনানি ২৮ এপ্রিল ২০২৬ পর্যন্ত মুলতবি করা হয়েছে। সাক্ষী PW-1 এর জেরা করা হবে।"
    },
    clauses: {
      en: [
        {
          id: "a1",
          originalText: "At the request of learned counsel for the Respondent, who submits that senior counsel is unavailable today due to medical indisposition, the matter stands adjourned to 28.04.2026.",
          plainText: "Today's court hearing was postponed to April 28, 2026 because the respondent's lawyer was sick.",
          pageNumber: 1
        },
        {
          id: "a2",
          originalText: "Interim order, if any, to continue till the next date of hearing.",
          plainText: "All temporary court protections or stay orders given previously will stay in force until the next hearing.",
          pageNumber: 1
        }
      ],
      hi: [
        {
          id: "a1",
          originalText: "At the request of learned counsel for the Respondent, who submits that senior counsel is unavailable today due to medical indisposition, the matter stands adjourned to 28.04.2026.",
          plainText: "प्रतिवादी के वकील के अस्वस्थ होने के कारण आज की अदालती सुनवाई 28 अप्रैल 2026 तक के लिए स्थगित कर दी गई है।",
          pageNumber: 1
        },
        {
          id: "a2",
          originalText: "Interim order, if any, to continue till the next date of hearing.",
          plainText: "पूर्व में दिए गए सभी अंतरिम अदालती संरक्षण या रोक आदेश अगली सुनवाई तक प्रभावी रहेंगे।",
          pageNumber: 1
        }
      ],
      ta: [
        {
          id: "a1",
          originalText: "At the request of learned counsel for the Respondent, who submits that senior counsel is unavailable today due to medical indisposition, the matter stands adjourned to 28.04.2026.",
          plainText: "எதிர்மனுதாரர் வழக்கறிஞர் உடல்நலம் சரியில்லாததால் இன்றைய விசாரணை ஏப்ரல் 28, 2026க்கு ஒத்திவைக்கப்பட்டது.",
          pageNumber: 1
        },
        {
          id: "a2",
          originalText: "Interim order, if any, to continue till the next date of hearing.",
          plainText: "முன்பு வழங்கப்பட்ட அனைத்து தற்காலிக நீதிமன்ற பாதுகாப்பு அல்லது தடை உத்தரவுகள் அடுத்த விசாரணை வரை அமலில் இருக்கும்.",
          pageNumber: 1
        }
      ],
      te: [
        {
          id: "a1",
          originalText: "At the request of learned counsel for the Respondent, who submits that senior counsel is unavailable today due to medical indisposition, the matter stands adjourned to 28.04.2026.",
          plainText: "ప్రతివాది న్యాయవాది అనారోగ్యం కారణంగా నేటి కోర్టు విచారణ ఏప్రిల్ 28, 2026కి వాయిదా పడింది.",
          pageNumber: 1
        },
        {
          id: "a2",
          originalText: "Interim order, if any, to continue till the next date of hearing.",
          plainText: "గతంలో ఇచ్చిన తాత్కాలిక కోర్టు రక్షణలు లేదా స్టే ఉత్తర్వులు తదుపరి విచారణ వరకు అమలులో ఉంటాయి.",
          pageNumber: 1
        }
      ],
      kn: [
        {
          id: "a1",
          originalText: "At the request of learned counsel for the Respondent, who submits that senior counsel is unavailable today due to medical indisposition, the matter stands adjourned to 28.04.2026.",
          plainText: "ಪ್ರತಿವಾದಿಯ ವಕೀಲರ ಅನಾರೋಗ್ಯದ ಕಾರಣ ಇಂದಿನ ವಿಚಾರಣೆಯನ್ನು ಏಪ್ರಿಲ್ 28, 2026ಕ್ಕೆ ಮುಂದೂಡಲಾಗಿದೆ.",
          pageNumber: 1
        },
        {
          id: "a2",
          originalText: "Interim order, if any, to continue till the next date of hearing.",
          plainText: "ಹಿಂದೆ ನೀಡಲಾದ ಎಲ್ಲಾ ಮಧ್ಯಂತರ ರಕ್ಷಣೆ ಅಥವಾ ತಡೆಯಾಜ್ಞೆಗಳು ಮುಂದಿನ ವಿಚಾರಣೆಯವರೆಗೆ ಮುಂದುವರಿಯುತ್ತವೆ.",
          pageNumber: 1
        }
      ],
      bn: [
        {
          id: "a1",
          originalText: "At the request of learned counsel for the Respondent, who submits that senior counsel is unavailable today due to medical indisposition, the matter stands adjourned to 28.04.2026.",
          plainText: "উত্তরদাতার আইনজীবীর অসুস্থতার কারণে আজকের শুনানি ২৮ এপ্রিল ২০২৬ পর্যন্ত স্থগিত করা হয়েছে।",
          pageNumber: 1
        },
        {
          id: "a2",
          originalText: "Interim order, if any, to continue till the next date of hearing.",
          plainText: "পূর্বে প্রদত্ত সমস্ত অন্তর্বর্তীকালীন স্থগিতাদেশ পরবর্তী শুনানি পর্যন্ত কার্যকর থাকবে।",
          pageNumber: 1
        }
      ]
    }
  },
  {
    id: "sample-bail",
    title: "Bail Order with Conditions",
    badge: "Sessions Court",
    description: "Order granting conditional bail to the accused upon furnishing personal bond.",
    rawOrderText: "Applicant shall be released on bail upon executing a personal bond of ₹25,000/- with one solvent surety of like amount. Applicant shall surrender his passport before the Investigating Officer within 48 hours of release and mark attendance at police station every Monday between 10:00 AM and 01:00 PM.",
    keyFacts: {
      caseTitle: "State of Maharashtra vs. Rajesh Verma",
      cnrNumber: "MHCC020045672025",
      courtName: "Sessions Court, City Civil Bench, Thane",
      judgeName: "Hon'ble Addl. Sessions Judge V. R. Deshmukh",
      parties: ["State of Maharashtra (Prosecution)", "Rajesh Verma (Accused/Applicant)"],
      nextHearingDate: "2026-02-28",
      stage: "Charge Sheet Verification",
      orderDate: "2026-01-18"
    },
    changedFromPrevious: {
      changed: true,
      changes: [
        "Bail granted subject to surety bond of ₹25,000.",
        "Passport surrender ordered within 48 hours.",
        "Mandatory weekly attendance at local police station every Monday."
      ]
    },
    plainSummary: {
      en: "The court has approved bail for the applicant (Rajesh Verma) under specific conditions. He will be released from custody once he submits a security deposit (surety) of ₹25,000. He must surrender his passport, report to the police station every Monday between 10 AM and 1 PM, and cannot contact any witnesses.",
      hi: "अदालत ने आवेदक (राजेश वर्मा) को विशेष शर्तों पर जमानत दे दी है। ₹25,000 का मुचलका और ज़मानतदार पेश करने पर उन्हें रिहा किया जाएगा। उन्हें 48 घंटे के भीतर अपना पासपोर्ट जमा करना होगा और हर सोमवार सुबह पुलिस स्टेशन में हाजिरी लगानी होगी।",
      ta: "மனுதாரருக்கு (ராஜேஷ் வர்மா) குறிப்பிட்ட நிபந்தனைகளுடன் பிணை வழங்கப்பட்டுள்ளது. ₹25,000 பிணைத் தொகை செலுத்திய பின் விடுவிக்கப்படுவார். 48 மணி நேரத்திற்குள் கடவுச்சீட்டை ஒப்படைக்க வேண்டும்.",
      te: "దరఖాస్తుదారునికి (రాజేష్ వర్మ) కొన్ని షరతులతో బెయిల్ మంజూరు చేయబడింది. ₹25,000 షూరిటీ సమర్పించిన తర్వాత విడుదలవుతారు. 48 గంటల్లో పాస్‌పోర్ట్ సరెండర్ చేయాలి.",
      kn: "ಅರ್ಜಿದಾರರಿಗೆ (ರಾಜೇಶ್ ವರ್ಮಾ) ಷರತ್ತುಬದ್ಧ ಜಾಮೀನು ಮಂಜೂರಾಗಿದೆ. ₹25,000 ಶ್ಯೂರಿಟಿ ಸಲ್ಲಿಸಿದ ನಂತರ ಬಿಡುಗಡೆಯಾಗಲಿದ್ದಾರೆ. 48 ಗಂಟೆಗಳಲ್ಲಿ ಪಾಸ್‌ಪೋರ್ಟ್ ಒಪ್ಪಿಸಬೇಕು.",
      bn: "আবেদনকারীকে (রাজেশ ভার্মা) নির্দিষ্ট শর্তে জামিন দেওয়া হয়েছে। ₹২৫,০০০ জামানত জমার পর তিনি মুক্তি পাবেন। ৪৮ ঘণ্টার মধ্যে পাসপোর্ট জমা দিতে হবে।"
    },
    clauses: {
      en: [
        {
          id: "b1",
          originalText: "Applicant shall be released on bail upon executing a personal bond of ₹25,000/- with one solvent surety of like amount.",
          plainText: "The accused can leave jail after signing a bond of ₹25,000 and providing one guarantor who guarantees that amount.",
          pageNumber: 1
        },
        {
          id: "b2",
          originalText: "Applicant shall surrender his passport before the Investigating Officer within 48 hours of release.",
          plainText: "He must hand over his passport to the investigating police officer within 2 days of getting out of jail.",
          pageNumber: 1
        },
        {
          id: "b3",
          originalText: "Applicant shall mark his attendance at police station every Monday between 10:00 AM and 01:00 PM.",
          plainText: "He must visit the local police station every Monday morning to sign the attendance register.",
          pageNumber: 2
        }
      ],
      hi: [
        {
          id: "b1",
          originalText: "Applicant shall be released on bail upon executing a personal bond of ₹25,000/- with one solvent surety of like amount.",
          plainText: "आरोपी ₹25,000 का मुचलका भरने और एक ज़मानतदार देने के बाद जेल से रिहा हो सकता है।",
          pageNumber: 1
        },
        {
          id: "b2",
          originalText: "Applicant shall surrender his passport before the Investigating Officer within 48 hours of release.",
          plainText: "जेल से रिहा होने के 2 दिनों (48 घंटे) के भीतर जांच अधिकारी को अपना पासपोर्ट सौंपना होगा।",
          pageNumber: 1
        },
        {
          id: "b3",
          originalText: "Applicant shall mark his attendance at police station every Monday between 10:00 AM and 01:00 PM.",
          plainText: "उन्हें हर सोमवार सुबह 10 से 1 बजे के बीच स्थानीय पुलिस स्टेशन में हाजिरी रजिस्टर पर हस्ताक्षर करने होंगे।",
          pageNumber: 2
        }
      ],
      ta: [
        {
          id: "b1",
          originalText: "Applicant shall be released on bail upon executing a personal bond of ₹25,000/- with one solvent surety of like amount.",
          plainText: "குற்றம் சாட்டப்பட்டவர் ₹25,000 பிணைப் பத்திரம் மற்றும் ஒரு உத்தரவாததாரரை வழங்கிய பிறகு சிறையிலிருந்து வெளியே வரலாம்.",
          pageNumber: 1
        },
        {
          id: "b2",
          originalText: "Applicant shall surrender his passport before the Investigating Officer within 48 hours of release.",
          plainText: "சிறையிலிருந்து வெளியே வந்த 48 மணி நேரத்திற்குள் பாஸ்போர்ட்டை விசாரணை அதிகாரியிடம் ஒப்படைக்க வேண்டும்.",
          pageNumber: 1
        },
        {
          id: "b3",
          originalText: "Applicant shall mark his attendance at police station every Monday between 10:00 AM and 01:00 PM.",
          plainText: "ஒவ்வொரு திங்கட்கிழமையும் காலை 10 மணி முதல் 1 மணி வரை காவல் நிலையத்திற்குச் சென்று கையெழுத்திட வேண்டும்.",
          pageNumber: 2
        }
      ],
      te: [
        {
          id: "b1",
          originalText: "Applicant shall be released on bail upon executing a personal bond of ₹25,000/- with one solvent surety of like amount.",
          plainText: "నిందితుడు ₹25,000 బాండ్ మరియు ఒక షూరిటీ సమర్పించిన తర్వాత విడుదల కావచ్చు.",
          pageNumber: 1
        },
        {
          id: "b2",
          originalText: "Applicant shall surrender his passport before the Investigating Officer within 48 hours of release.",
          plainText: "విడుదలైన 48 గంటల్లోగా పాస్‌పోర్ట్‌ను దర్యాప్తు అధికారికి అప్పగించాలి.",
          pageNumber: 1
        },
        {
          id: "b3",
          originalText: "Applicant shall mark his attendance at police station every Monday between 10:00 AM and 01:00 PM.",
          plainText: "ప్రతి సోమవారం ఉదయం 10 నుండి 1 గంటల మధ్య పోలీస్ స్టేషన్‌లో హాజరు నమోదు చేయాలి.",
          pageNumber: 2
        }
      ],
      kn: [
        {
          id: "b1",
          originalText: "Applicant shall be released on bail upon executing a personal bond of ₹25,000/- with one solvent surety of like amount.",
          plainText: "ಆರೋಪಿಯು ₹25,000 ವೈಯಕ್ತಿಕ ಬಾಂಡ್ ಮತ್ತು ಒಬ್ಬ ಶ್ಯೂರಿಟಿ ನೀಡಿದ ನಂತರ ಜೈಲಿನಿಂದ ಬಿಡುಗಡೆಯಾಗಬಹುದು.",
          pageNumber: 1
        },
        {
          id: "b2",
          originalText: "Applicant shall surrender his passport before the Investigating Officer within 48 hours of release.",
          plainText: "ಬಿಡುಗಡೆಯಾದ 48 ಗಂಟೆಗಳ ಒಳಗೆ ಪಾಸ್‌ಪೋರ್ಟ್ ಅನ್ನು ತನಿಖಾಧಿಕಾರಿಗೆ ಒಪ್ಪಿಸಬೇಕು.",
          pageNumber: 1
        },
        {
          id: "b3",
          originalText: "Applicant shall mark his attendance at police station every Monday between 10:00 AM and 01:00 PM.",
          plainText: "ಪ್ರತಿ ಸೋಮವಾರ ಬೆಳಿಗ್ಗೆ 10 ರಿಂದ 1 ಗಂಟೆಯ ನಡುವೆ ಪೊಲೀಸ್ ಠಾಣೆಗೆ ತೆರಳಿ ಸಹಿ ಮಾಡಬೇಕು.",
          pageNumber: 2
        }
      ],
      bn: [
        {
          id: "b1",
          originalText: "Applicant shall be released on bail upon executing a personal bond of ₹25,000/- with one solvent surety of like amount.",
          plainText: "অভিযুক্ত ₹২৫,০০০ ব্যক্তিগত বন্ড এবং একজন জামিনদার প্রদানের পর মুক্তি পেতে পারেন।",
          pageNumber: 1
        },
        {
          id: "b2",
          originalText: "Applicant shall surrender his passport before the Investigating Officer within 48 hours of release.",
          plainText: "মুক্তির ৪৮ ঘণ্টার মধ্যে তদন্তকারী কর্মকর্তার কাছে পাসপোর্ট জমা দিতে হবে।",
          pageNumber: 1
        },
        {
          id: "b3",
          originalText: "Applicant shall mark his attendance at police station every Monday between 10:00 AM and 01:00 PM.",
          plainText: "প্রতি সোমবার সকাল ১০টা থেকে ১টার মধ্যে থানায় গিয়ে হাজিরা খাতায় সই করতে হবে।",
          pageNumber: 2
        }
      ]
    }
  }
];
