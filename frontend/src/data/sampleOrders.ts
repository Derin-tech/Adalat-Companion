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
  plainSummary: Record<string, string>; // lang key -> text
  clauses: Record<string, Clause[]>;     // lang key -> clauses
  keyFacts: KeyFacts;
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
      ta: "நீதிமன்றம் கணவரை (பதில் மனுதாரர்) ஜனவரி 1, 2026 முதல் மனைவிக்கும் (மனுதாரர்) மாதம் ₹10,000 இடைக்கால ஜீவனாம்சம் வழங்க உத்தரவிட்டுள்ளது. ஒவ்வொரு மாதமும் 5ஆம் தேதிக்குள் நேரடியாக வங்கிச் கணக்கில் செலுத்த வேண்டும்.",
      te: "కోర్టు భర్త (ప్రతివాది) కి జనవరి 1, 2026 నుండి భార్య (పిటిషనర్) కి నెలకు ₹10,000 తాత్కాలిక నిర్వహణ భత్యం చెల్లించాలని ఆదేశించింది.",
      kn: "ಜನವರಿ 1, 2026 ರಿಂದ ಪತ್ನಿಗೆ (ಅರ್ಜಿದಾರರು) ತಿಂಗಳಿಗೆ ₹10,000 ಮಧ್ಯಂತರ ಜೀವನಾಂಶವನ್ನು ನೀಡುವಂತೆ ಕೋರ್ಟ್ ಪತಿಗೆ (ಪ್ರತಿವಾದಿ) ಆದೇಶಿಸಿದೆ.",
      bn: "আদালত স্বামীকে (উত্তরদাতা) ১ জানুয়ারী ২০২৬ থেকে স্ত্রীকে (আবেদনকারী) প্রতি মাসে ₹১০,০০০০০ অন্তর্বর্তীকালীন খোরপোশ প্রদানের নির্দেশ দিয়েছেন।"
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
          originalText: "In default of payment, the Petitioner is at liberty to file execution proceedings for attachment of Respondent's salary.",
          plainText: "If payment is missed, the wife can ask the court to deduct the money directly from the husband's salary.",
          pageNumber: 2
        }
      ],
      hi: [
        {
          id: "c1",
          originalText: "The Respondent is hereby directed to remit a sum of ₹10,000/- per mensum towards the interim maintenance of the Petitioner.",
          plainText: "पति (प्रतिवादी) को दैनिक खर्चों के लिए हर महीने ₹10,000 देने होंगे।",
          pageNumber: 1
        },
        {
          id: "c2",
          originalText: "Said remittance shall be made directly into the bank account of the Petitioner on or before the 5th day of every calendar month, commencing from 01.01.2026.",
          plainText: "यह पैसा 1 जनवरी 2026 से हर महीने की 5 तारीख तक पत्नी के बैंक खाते में जमा होना चाहिए।",
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
      hi: "अदालत ने आवेदक (राजेश वर्मा) को विशेष शर्तों पर जमानत दे दी है। ₹25,000 की ज़मानत राशि (श्योरिटी) जमा करने पर उन्हें हिरासत से रिहा कर दिया जाएगा। उन्हें अपना पासपोर्ट सरेंडर करना होगा और हर सोमवार सुबह पुलिस स्टेशन में उपस्थिति दर्ज करानी होगी।",
      ta: "மனுதாரருக்கு (ராஜேஷ் வர்மா) குறிப்பிட்ட நிபந்தனைகளுடன் பிணை வழங்கப்பட்டுள்ளது. ₹25,000 பிணைத் தொகை செலுத்திய பின் விடுவிக்கப்படுவார்.",
      te: "దరఖాస్తుదారునికి (రాజేష్ వర్మ) కొన్ని షరతులతో బెయిల్ మంజూరు చేయబడింది. ₹25,000 షూరిటీ సమర్పించిన తర్వాత విడుదలవుతారు.",
      kn: "ಅರ್ಜಿದಾರರಿಗೆ (ರಾಜೇಶ್ ವರ್ಮಾ) ಷರತ್ತುಬದ್ಧ ಜಾಮೀನು ಮಂಜೂರಾಗಿದೆ. ₹25,000 ಶ್ಯೂರಿಟಿ ಸಲ್ಲಿಸಿದ ನಂತರ ಬಿಡುಗಡೆಯಾಗಲಿದ್ದಾರೆ.",
      bn: "আবেদনকারীকে (রাজেশ ভার্মা) নির্দিষ্ট শর্তে জামিন দেওয়া হয়েছে। ₹২৫,০০০ জামানত জমার পর তিনি মুক্তি পাবেন।"
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
      ]
    }
  },
  {
    id: "sample-property",
    title: "Property Stay Order (Temporary Injunction)",
    badge: "Civil Court",
    description: "Order restraining respondent from selling or altering property status pending trial.",
    keyFacts: {
      caseTitle: "Ramesh Patel vs. Suresh Patel",
      cnrNumber: "GJAH010098762025",
      courtName: "Civil Court Senior Division, Ahmedabad",
      judgeName: "Hon'ble Judge M. P. Mehta",
      parties: ["Ramesh Patel (Plaintiff)", "Suresh Patel (Defendant)"],
      nextHearingDate: "2026-04-05",
      stage: "Written Statement Reply",
      orderDate: "2026-01-22"
    },
    changedFromPrevious: {
      changed: false,
      changes: []
    },
    plainSummary: {
      en: "The court has issued a temporary stay order protecting the disputed land (Survey No. 104). The defendant (Suresh Patel) is forbidden from selling, gifting, constructing on, or transferring ownership of the property until the court gives a final decision. Both parties must maintain the current status of the land.",
      hi: "अदालत ने विवादित जमीन (सर्वे नंबर 104) पर अंतरिम रोक (स्टे ऑर्डर) जारी की है। जब तक मामला जारी है, प्रतिवादी (सुरेश पटेल) जमीन को बेचने, निर्माण करने या किसी और को हस्तांतरित करने से प्रतिबंधित है।",
      ta: "சர்ச்சைக்குரிய நிலத்தை (சர்வே எண் 104) விற்கவோ மாற்றவோ பிரதிவாதிக்கு தற்காலிக தடை விதிக்கப்பட்டுள்ளது.",
      te: "వివాదాస్పద స్థలాన్ని అమ్మడం లేదా నిర్మించడం చేయకూడదని ప్రతివాదిని కోర్టు తాత్కాలికంగా ఆదేశించింది.",
      kn: "ವಿವಾದಿತ ಜಾಗವನ್ನು ಮಾರಾಟ ಮಾಡದಂತೆ ಅಥವಾ ಬದಲಾಯಿಸದಂತೆ ಕೋರ್ಟ್ ತಡೆಯಾಜ್ಞೆ ನೀಡಿದೆ.",
      bn: "বিতর্কিত জমি বিক্রি বা হস্তান্তর না করার জন্য আদালত অন্তর্বর্তীকালীন স্থগিতাদেশ জারি করেছে।"
    },
    clauses: {
      en: [
        {
          id: "p1",
          originalText: "The Defendant is temporarily restrained from alienating, encumbering, or creating third-party rights in respect of the suit property.",
          plainText: "The defendant cannot sell, mortgage, or give the property to anyone else while the case is in court.",
          pageNumber: 1
        },
        {
          id: "p2",
          originalText: "Status quo as on date shall be strictly maintained by both parties until further orders.",
          plainText: "Both sides must keep the property exactly as it is right now without making any physical or legal changes.",
          pageNumber: 2
        }
      ]
    }
  }
];
