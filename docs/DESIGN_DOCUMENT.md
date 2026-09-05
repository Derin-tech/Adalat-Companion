# Software Design Document — Adalat Companion

## 1. Overview
Adalat Companion is an AI-powered case-understanding tool that helps self-represented 
litigants and legal-aid users understand court orders and case history in plain language. 
It explains legal documents — it does not provide legal advice.

## 2. Problem Statement
- 84.5% of surveyed litigants find legal texts difficult to understand (Vidhi SARAL Survey, 2025)
- Litigants collectively spend ₹30,000+ crore annually attending court proceedings (DAKSH Survey)
- Legal-aid support is limited and not always available at every step of a case

## 3. Target Users
- Self-represented litigants
- Legal-aid clients and legal-aid support staff

## 4. Core Features (MVP)

### 4.1 Order Upload & Summarization
- User uploads a court order (PDF)
- System extracts text and generates a plain-language summary of what the order means

### 4.2 Source Linking
- Each plain-language sentence links back to the exact clause/paragraph in the original document
- Builds user trust and allows verification

### 4.3 Change Highlighting
- When multiple orders exist for a case, system highlights what changed 
  (e.g., new hearing date, updated conditions, case status)

### 4.4 Glossary Layer
- Common legal terms (e.g., "ex parte," "interim relief") are shown with plain-language 
  definitions on hover/click
- Static, curated glossary (not AI-generated) for reliability

### 4.5 Multi-Language Output
- User can select a preferred language (e.g., Hindi, Tamil)
- Plain-language summary is generated/translated into the selected language

## 5. Stretch / Roadmap Features (not built in MVP)
- Voice assistant (speech input/output for accessibility)
- Case-number based auto-fetch of orders from official court portals 
  (requires future integration with eCourts or legal-aid partners)
- Action checklist (typical next steps after an order type)

## 6. System Architecture (High Level)
- **Frontend:** Upload interface, plain-language display, source-highlight interaction
- **Backend:** API layer connecting frontend to AI pipeline, file handling
- **AI/NLP Pipeline:** Text extraction (OCR if needed) → summarization → source-mapping → 
  translation

## 7. Disclaimers & Constraints
- Tool explains document content only; does not offer legal advice or recommendations
- Users are directed to legal-aid professionals for decisions requiring judgment
- MVP has not yet been validated with real self-represented litigants — 
  planned as immediate next step post-hackathon

## 8. Known Limitations
- Performance may vary across unstructured/non-standard court order formats
- OCR accuracy affects quality of extraction from scanned documents
- Multi-language quality depends on underlying LLM's language support
