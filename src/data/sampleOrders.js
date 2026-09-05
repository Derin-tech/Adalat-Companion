export const SAMPLE_ORDERS = [
  {
    id: "interim-stay-01",
    category: "Interim Order",
    title: "Stay Order on Demolition Notice",
    courtName: "High Court of Delhi at New Delhi",
    caseNumber: "W.P.(C) 4892/2024 & CM APPL. 19820/2024",
    filingDate: "24th August 2024",
    bench: "Hon'ble Mr. Justice Sanjeev Sachdeva",
    parties: {
      petitioner: "Ramesh Chand & Ors.",
      respondent: "Municipal Corporation of Delhi (MCD) & Anr."
    },
    executiveSummary: "The High Court has temporarily PAUSED the demolition notice issued by MCD. The government/MCD cannot demolish or disturb your property until the next court hearing. The court gave MCD 4 weeks to submit their reply.",
    nextAction: {
      title: "File Rejoinder Affidavit",
      deadline: "Within 2 weeks of receiving MCD's reply (Next Hearing: 18th Oct 2024)",
      status: "Stay Granted & Active",
      type: "success"
    },
    keyTakeaways: [
      { label: "Demolition Status", val: "PAUSED (Ad-Interim Stay)", type: "positive" },
      { label: "Next Hearing Date", val: "18th October 2024", type: "neutral" },
      { label: "MCD Deadline", val: "4 Weeks to file counter-affidavit", type: "info" }
    ],
    paragraphs: [
      {
        id: "p1",
        paragraphNo: 1,
        legaleseText: "UPON HEARING THE LEARNED COUNSEL FOR THE PETITIONER AND UPON PERUSAL OF THE RECORD, ISSUE NOTICE TO THE RESPONDENTS BY ALL ACCEPTABLE MODES, RETURNABLE ON 18.10.2024.",
        plainText: "The judge listened to your lawyer, reviewed the documents submitted, and officially served formal notice to MCD to appear in court on October 18, 2024.",
        practicalImpact: "MCD has been officially summoned by the court and is now bound to respond.",
        glossaryTerms: [
          { term: "Issue Notice", definition: "A formal order by the court informing the opposite party that a case has been filed against them and directing them to appear." },
          { term: "Returnable On", definition: "The exact date on which the opposite party must submit their reply and appear in court." }
        ],
        verificationConfidence: 100
      },
      {
        id: "p2",
        paragraphNo: 2,
        legaleseText: "IN THE MEANWHILE, OPERATIVE PORTION OF IMPUGNED NOTICE DATED 10.08.2024 ISSUED UNDER SECTION 343 OF THE MCD ACT SHALL REMAIN STAYED TILL THE NEXT DATE OF LISTING.",
        plainText: "Until the next hearing on Oct 18, the eviction/demolition notice dated Aug 10 is FROZEN. MCD is prohibited from taking any coercive action.",
        practicalImpact: "Your home/property cannot be demolished or sealed by officials for now.",
        glossaryTerms: [
          { term: "Impugned Notice", definition: "The specific notice or government order that you are challenging in court." },
          { term: "Stayed", definition: "Temporarily stopped or suspended by court order so no action can be taken under it." }
        ],
        verificationConfidence: 99
      },
      {
        id: "p3",
        paragraphNo: 3,
        legaleseText: "LET COUNTER-AFFIDAVIT BE FILED BY THE RESPONDENTS WITHIN FOUR WEEKS FROM TODAY. REJOINDER, IF ANY, BE FILED WITHIN TWO WEEKS THEREAFTER. LIST ON 18.10.2024.",
        plainText: "MCD has 4 weeks to file their written defense (counter-affidavit). After they file it, you have 2 weeks to reply (rejoinder) if you wish.",
        practicalImpact: "Keep in contact with your legal counsel to review MCD's response when filed in 4 weeks.",
        glossaryTerms: [
          { term: "Counter-Affidavit", definition: "A written reply on oath filed by the respondent answering the allegations made in the case." },
          { term: "Rejoinder", definition: "The petitioner's reply to the counter-affidavit filed by the opposite party." }
        ],
        verificationConfidence: 97
      }
    ]
  },
  {
    id: "adjournment-costs-02",
    category: "Adjournment",
    title: "Postponement with Costs Awarded",
    courtName: "District Court, Bengaluru Urban",
    caseNumber: "O.S. No. 1042/2023",
    filingDate: "12th June 2024",
    bench: "Hon'ble Vth Addl. City Civil & Sessions Judge",
    parties: {
      petitioner: "Smt. Latha Venkatesh",
      respondent: "K. Mohan & Anr."
    },
    executiveSummary: "The case hearing has been POSTPONED because the petitioner's lawyer was absent. However, the court imposed a penalty (cost) of ₹5,000 on the petitioner for causing delay, payable to the Legal Aid Committee before the next date.",
    nextAction: {
      title: "Pay ₹5,000 Court Fine & File Receipt",
      deadline: "Must be paid BEFORE next date (25th July 2024)",
      status: "Action Required",
      type: "warning"
    },
    keyTakeaways: [
      { label: "Hearing Status", val: "ADJOURNED to 25th July 2024", type: "neutral" },
      { label: "Cost Imposed", val: "₹5,000/- Fine on Petitioner", type: "negative" },
      { label: "Payment Location", val: "District Legal Services Authority (DLSA)", type: "info" }
    ],
    paragraphs: [
      {
        id: "p1",
        paragraphNo: 1,
        legaleseText: "MATTER CALLED OUT. LEARNED COUNSEL FOR PETITIONER ABSENT WHEN CALLED. NO REPRESENTATION MADE. ADVOCATE FOR RESPONDENT PRESENT AND READY FOR CROSS-EXAMINATION OF PW-1.",
        plainText: "When your case was called in court, your lawyer was not present and no junior lawyer appeared. The opponent's lawyer was present and ready to proceed.",
        practicalImpact: "Absence of representation leads to court delays and potential monetary penalties.",
        glossaryTerms: [
          { term: "PW-1", definition: "Prosecution/Petitioner Witness No. 1 (usually the person who filed the case giving evidence)." },
          { term: "Cross-Examination", definition: "Questioning of a witness by the opposing party's lawyer to test accuracy or truth." }
        ],
        verificationConfidence: 100
      },
      {
        id: "p2",
        paragraphNo: 2,
        legaleseText: "IN THE INTEREST OF JUSTICE, ONE LAST AND FINAL OPPORTUNITY IS GRANTED TO PETITIONER, SUBJECT TO PAYMENT OF COSTS OF RS. 5,000/- PAYABLE TO DLSA BENGALURU URBAN.",
        plainText: "The judge gave one final chance to present your witness, but penalized the delay by ordering you/your counsel to pay ₹5,000 to the Bengaluru District Legal Services Authority.",
        practicalImpact: "Obtain receipt after depositing ₹5,000 with DLSA and hand it over to the court clerk on or before July 25.",
        glossaryTerms: [
          { term: "Costs", definition: "A monetary penalty imposed by court on a party causing unnecessary delay or adjournment." },
          { term: "DLSA", definition: "District Legal Services Authority (Government body providing legal assistance)." }
        ],
        verificationConfidence: 98
      },
      {
        id: "p3",
        paragraphNo: 3,
        legaleseText: "PROOF OF DEPOSIT OF COSTS SHALL BE A CONDITION PRECEDENT FOR PROCEEDING WITH FURTHER EXAMINATION. RE-LIST FOR PW-1 CROSS ON 25.07.2024.",
        plainText: "The court will NOT allow your lawyer to continue giving evidence until you present proof that the ₹5,000 fine has been paid.",
        practicalImpact: "Do not miss the payment; otherwise your witness evidence may be closed by court.",
        glossaryTerms: [
          { term: "Condition Precedent", definition: "A mandatory requirement that must be fulfilled BEFORE a court step is permitted." }
        ],
        verificationConfidence: 96
      }
    ]
  },
  {
    id: "ex-parte-maintenance-03",
    category: "Ex Parte Orders",
    title: "Ex-Parte Maintenance Direction",
    courtName: "Family Court at Chennai",
    caseNumber: "M.C. No. 312/2023",
    filingDate: "05th March 2024",
    bench: "Hon'ble Principal Judge, Family Court",
    parties: {
      petitioner: "Priya S.",
      respondent: "K. Rajesh"
    },
    executiveSummary: "Because the respondent husband failed to attend court despite receiving official summons, the court proceeded EX-PARTE (in his absence). The judge ordered him to pay ₹15,000 per month as interim maintenance starting April 2024.",
    nextAction: {
      title: "Receive Monthly Maintenance",
      deadline: "₹15,000 due on or before 10th of every month",
      status: "Order Enforceable Immediately",
      type: "success"
    },
    keyTakeaways: [
      { label: "Court Decision Mode", val: "EX-PARTE (Decided without Opponent)", type: "positive" },
      { label: "Monthly Maintenance Amount", val: "₹15,000 / month", type: "positive" },
      { label: "Due Date", val: "10th of every calendar month", type: "neutral" }
    ],
    paragraphs: [
      {
        id: "p1",
        paragraphNo: 1,
        legaleseText: "SUMMONS DULY SERVED ON RESPONDENT AS PER TRACK REPORT DATED 14.01.2024. RESPONDENT CALLED ABSENT. SET EX-PARTE.",
        plainText: "Postal tracking confirmed the respondent received court notices on Jan 14, 2024. Since he chose not to attend court, the judge decided to hear the case without him.",
        practicalImpact: "The case proceeded in your favor without delay from the non-appearing party.",
        glossaryTerms: [
          { term: "Ex-Parte", definition: "Legal proceedings done or decided for the benefit of one party without the presence or reply of the other." },
          { term: "Summons Duly Served", definition: "Official court notice successfully delivered to the party." }
        ],
        verificationConfidence: 99
      },
      {
        id: "p2",
        paragraphNo: 2,
        legaleseText: "PETITIONER HAS ESTABLISHED PRIMA FACIE CASE FOR INTERIM RELIEF. RESPONDENT IS DIRECTED TO PAY RS. 15,000/- PER MONTH TOWARDS INTERIM MAINTENANCE TO PETITIONER FROM DATE OF PETITION.",
        plainText: "The judge agreed you presented valid initial evidence. The respondent is legally ordered to pay you ₹15,000 every month for living expenses.",
        practicalImpact: "If respondent fails to pay by 10th of the month, an execution petition can be filed for salary attachment or warrant.",
        glossaryTerms: [
          { term: "Prima Facie", definition: "Based on first impression; accepted as correct until proven otherwise." },
          { term: "Interim Maintenance", definition: "Temporary monthly financial support ordered by court during the pendency of a case." }
        ],
        verificationConfidence: 98
      }
    ]
  },
  {
    id: "bail-order-04",
    category: "Bail Orders",
    title: "Conditional Bail Order with Restrictions",
    courtName: "Sessions Court at Mumbai (Greater Mumbai)",
    caseNumber: "Bail Application No. 1845/2024",
    filingDate: "18th July 2024",
    bench: "Hon'ble Additional Sessions Judge",
    parties: {
      petitioner: "Vikram Sharma (Applicant)",
      respondent: "State of Maharashtra"
    },
    executiveSummary: "BAIL HAS BEEN GRANTED! To be released from custody, the applicant must deposit a ₹50,000 personal bond + 2 sureties of ₹50,000 each. The applicant must surrender their passport and report to the police station every Monday.",
    nextAction: {
      title: "Furnish 2 Sureties & Deposit Bond",
      deadline: "Submit to Registrar & Surrender Passport",
      status: "Conditional Release Granted",
      type: "warning"
    },
    keyTakeaways: [
      { label: "Bail Verdict", val: "ALLOWED with Conditions", type: "positive" },
      { label: "Personal Bond & Surety", val: "₹50,000 Bond + 2 Local Sureties", type: "neutral" },
      { label: "Police Reporting", val: "Every Monday (10 AM - 1 PM)", type: "warning" }
    ],
    paragraphs: [
      {
        id: "p1",
        paragraphNo: 1,
        legaleseText: "APPLICANT BE RELEASED ON BAIL IN C.R. NO. 112/2024 UPON EXECUTING PERSONAL BOND OF RS. 50,000/- WITH TWO SOLVENT SURETIES IN LIKE AMOUNT TO THE SATISFACTION OF THE TRIAL COURT.",
        plainText: "The court agreed to release you on bail, provided you sign a ₹50,000 guarantee bond and find two creditworthy guarantors (sureties) who will also guarantee ₹50,000 each.",
        practicalImpact: "Prepare identity docs, property tax receipts, or salary slips for the 2 guarantors for court verification.",
        glossaryTerms: [
          { term: "Personal Bond", definition: "A formal written promise signed by accused promising to pay money if they fail to appear." },
          { term: "Solvent Surety", definition: "A guarantor who owns sufficient verifiable property or assets to guarantee the bail." }
        ],
        verificationConfidence: 99
      },
      {
        id: "p2",
        paragraphNo: 2,
        legaleseText: "THE APPLICANT SHALL SURRENDER HIS PASSPORT TO THE INVESTIGATING OFFICER WITHIN 48 HOURS OF RELEASE AND SHALL NOT LEAVE THE JURISDICTION OF THIS COURT WITHOUT PRIOR PERMISSION.",
        plainText: "Within 2 days of leaving jail, you MUST hand over your passport to the police officer and you cannot leave the city/district without asking the judge first.",
        practicalImpact: "Do not travel outside city limits without filing an application in court for permission.",
        glossaryTerms: [
          { term: "Surrender Passport", definition: "Handing over travel documents to law enforcement to prevent international travel." },
          { term: "Jurisdiction", definition: "The geographic territorial area where the court's authority applies." }
        ],
        verificationConfidence: 98
      },
      {
        id: "p3",
        paragraphNo: 3,
        legaleseText: "THE APPLICANT SHALL REPORT TO THE CONCERNED POLICE STATION EVERY MONDAY BETWEEN 10:00 A.M. AND 1:00 P.M. TILL THE FILING OF THE CHARGESHEET.",
        plainText: "You must visit the local police station every single Monday morning between 10 AM and 1 PM to sign the attendance register until the final investigation report is submitted.",
        practicalImpact: "Failure to mark attendance even once can result in immediate cancellation of bail.",
        glossaryTerms: [
          { term: "Chargesheet", definition: "The final police investigation report submitted to court detailing charges against the accused." }
        ],
        verificationConfidence: 100
      }
    ]
  },
  {
    id: "case-disposal-05",
    category: "Case Disposals",
    title: "Writ Petition Disposed with Liberty",
    courtName: "High Court of Judicature at Allahabad",
    caseNumber: "Writ - A No. 12904 of 2024",
    filingDate: "02nd August 2024",
    bench: "Hon'ble Division Bench",
    parties: {
      petitioner: "Sunil Kumar Gupta",
      respondent: "State of U.P. & 3 Others"
    },
    executiveSummary: "This specific High Court petition is CLOSED (withdrawn). However, the court gave explicit permission ('liberty') for you to approach the Debt Recovery Tribunal (DRT) or Appellate Authority instead. No fines were charged.",
    nextAction: {
      title: "File Appeal before DRT / Appellate Forum",
      deadline: "Within statutory limitation period (30 days)",
      status: "High Court Case Disposed",
      type: "info"
    },
    keyTakeaways: [
      { label: "High Court Case Status", val: "DISPOSED (Withdrawn)", type: "neutral" },
      { label: "Alternative Forum Granted", val: "Liberty to approach DRT / Tribunal", type: "positive" },
      { label: "Costs / Fines", val: "NO Costs Awarded", type: "positive" }
    ],
    paragraphs: [
      {
        id: "p1",
        paragraphNo: 1,
        legaleseText: "LEARNED COUNSEL FOR PETITIONER SEEKS PERMISSION TO WITHDRAW THE PRESENT WRIT PETITION WITH LIBERTY TO AVAIL ALTERNATE STATUTORY REMEDY AVAILABLE UNDER LAW.",
        plainText: "Your lawyer asked to withdraw this petition from High Court so you can file it in the specialized tribunal (DRT/Appellate Authority) which is the correct legal forum.",
        practicalImpact: "Your legal rights are intact; the case is moving to the appropriate specialized forum.",
        glossaryTerms: [
          { term: "Liberty to Approach", definition: "Formal permission given by court to file the case afresh in another court or authority." },
          { term: "Statutory Remedy", definition: "A right or remedy specifically created by an Act of Parliament/Legislature." }
        ],
        verificationConfidence: 100
      },
      {
        id: "p2",
        paragraphNo: 2,
        legaleseText: "PETITION IS ACCORDINGLY DISPOSED OF AS WITHDRAWN. LIBERTY GRANTED AS PRAYED FOR. NO ORDER AS TO COSTS.",
        plainText: "The High Court officially closed this petition. You are free to file before the specialized tribunal. Neither side has to pay court fines to each other.",
        practicalImpact: "Instruct your legal counsel to draft the appeal for the Appellate Tribunal.",
        glossaryTerms: [
          { term: "Disposed Of", definition: "The case is officially finished and closed in this particular court." },
          { term: "No Order as to Costs", definition: "Each party bears their own legal fees; no court fine is awarded to either side." }
        ],
        verificationConfidence: 97
      }
    ]
  }
];

export const VERNACULAR_LANGUAGES = [
  { code: "en", name: "English (Plain)", flag: "🇬🇧" },
  { code: "hi", name: "हिन्दी (Hindi)", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ் (Tamil)", flag: "🇮🇳" },
  { code: "mr", name: "मराठी (Marathi)", flag: "🇮🇳" },
  { code: "bn", name: "বাংলা (Bengali)", flag: "🇮🇳" },
  { code: "te", name: "తెలుగు (Telugu)", flag: "🇮🇳" },
  { code: "kn", name: "கன்னட (Kannada)", flag: "🇮🇳" },
  { code: "ml", name: "മലയാളം (Malayalam)", flag: "🇮🇳" }
];
