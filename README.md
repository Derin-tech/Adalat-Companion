# Adalat Companion

> An AI-powered plain-language court order explainer for self-represented litigants in India — bridging the legal readability gap through source-verified explanations.

---

> [!IMPORTANT]
> **Adalat Companion is an educational explainer tool, NOT a legal advice provider.** It does not provide legal opinions, counsel, or actionable legal advice. Its sole purpose is to decode dense legal jargon into plain language to help citizens understand official court documents.

---

## 🎯 Problem Statement

Access to justice begins with access to understanding. In India, court orders and legal proceedings are routinely written in dense, archaic legalese, rendering them virtually unintelligible to the average citizen. 

This is not merely a user experience inconvenience—it represents a real, evidence-backed **access-to-justice gap**. 

According to empirical findings from the **DAKSH Access to Justice Survey** and the **Vidhi Centre for Legal Policy’s 2025 SARAL survey**, **84.5% of respondents reported finding legal texts difficult to understand**. For self-represented litigants (*parties-in-person*) and individuals relying on overburdened legal-aid services, this comprehension barrier severely impairs their ability to track their own cases, prepare for hearings, or understand their legal standing.

---

## 💡 What the Tool Does

**Adalat Companion** is an AI-powered tool built to assist self-represented litigants, legal-aid recipients, and citizens in understanding court orders and case histories in plain, accessible language.

### Core Positioning: Explainer, Not Legal Advice
* **What it IS:** A plain-language translator and contextual document explainer that breaks down complex legal phrasing into digestible summaries.
* **What it IS NOT:** A substitute for legal counsel or a provider of legal advice. The system strictly refrains from suggesting legal strategies, predicting case outcomes, or offering actionable legal guidance.

---

## ✨ Key Feature: Source-Linked Explanations

In legal technology, accuracy and trust are non-negotiable. To guard against AI hallucination and prevent misinterpretation, Adalat Companion links every plain-language explanation directly back to the exact source text in the original order.

* **Interactive Traceability:** Clicking or viewing an explanation highlights the corresponding passage in the original document.
* **Verification over Assumption:** Users can easily cross-reference the AI’s summary against the authentic court text, making verification effortless and building user trust.
* **Core Design Principle:** Transparent source mapping is treated as a fundamental design constraint rather than a secondary feature.

---

## 🎬 Demo Scope

The hackathon MVP includes **five before-and-after demonstration examples** translating dense court language into plain language across key order types:

1. **Interim Orders** — Translating temporary court directions, stay orders, and procedural mandates into operational steps.
2. **Adjournments** — Explaining postponement reasons, next hearing dates, and attached conditions (e.g., costs awarded).
3. **Ex Parte Orders** — Clarifying orders issued in the absence of one party and explaining rights of appearance and response timelines.
4. **Bail Orders** — Breaking down bond conditions, surety obligations, and reporting requirements into clear directives.
5. **Case Disposals** — Summarizing final judgments, dismissals, or settlements, explicitly stating the final disposition of the matter.

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + Lucide Icons
- **Backend:** Simulated Instant AI Explainer & Document Parsing Engine
- **LLM / AI:** Source-Linked Grounded Text Analysis Engine
- **Document Processing:** Interactive Highlight & Citation Alignment Engine

---

## ⚠️ Current Limitations & Honest Caveats

Adalat Companion is a hackathon MVP designed to demonstrate product philosophy and technical feasibility. We are transparent about its current stage:

* **User Validation Pending:** Direct testing and validation with actual self-represented litigants and legal-aid clients has not yet taken place. We view this as an open, essential next step rather than a hidden limitation.
* **Scope Constraints:** Summaries are currently optimized for standard Indian high court and district court order formats in English.
* **Formatting Variability:** Unusually formatted or heavily degraded scanned PDFs may affect source-linking precision.

---

## 🚀 Roadmap & Next Steps

- [x] **Core Explainer UI & Source Linking:** Dual-pane interactive side-by-side court order explainer.
- [ ] **Field Validation:** Conduct structured user feedback sessions with self-represented litigants and legal-aid organizations (DALSA/SALSA).
- [ ] **Multilingual Support:** Extend plain-language translations to major Indian vernacular languages (Hindi, Tamil, Marathi, Bengali, etc.).
- [ ] **Enhanced Citation Mapping:** Improve fine-grained text highlighting for low-quality scanned court documents.
- [ ] **Accessibility Formats:** Explore audio explanations and WhatsApp/SMS delivery for low-bandwidth environments.

---

## ⚙️ How to Run Locally

```bash
# Clone the repository
git clone https://github.com/your-username/adalat-companion.git

# Navigate to the project directory
cd Adalat-Companion

# Install dependencies
npm install

# Run the dev server
npm run dev
```

---

*Built for hackathon demonstration. Designed to empower citizens through accessible legal understanding.*
