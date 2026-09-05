# Adalat Companion (अदालत साथी) - Project Context

This document summarizes the current state of the Adalat Companion project, the features implemented, and the architecture, to help you resume work easily in the future.

## 🎯 Project Overview
**Adalat Companion** is an AI-powered Legal Literacy & Source Verification Portal. It is designed to help Self-Represented Litigants and Legal-Aid Volunteers understand complex Indian court orders by translating them into structured, plain-language summaries without providing legal advice.

## 🏗 Architecture & Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Vite (Runs on `http://localhost:5173`)
- **Backend**: Node.js, Express.js (Runs on `http://localhost:3001`)
- **AI Pipeline (Optional)**: Python, FastAPI (Runs on `http://localhost:8000`, backend falls back gracefully if not running)
- **AI Model**: Google Gemini 3.6 Flash (via REST API in `backend/server.js`)
- **Database / Storage**: Local JSON file (`backend/data/examples.json`) for demo cases.

## ✨ Features Implemented So Far

### 1. UI Redesign (Official Government Theme)
- Redesigned the frontend to resemble an official Indian government portal (similar to eCourts / NALSA).
- Deep Navy (`#0b1b3d`) header with Gold accent border (`#c69214`), Merriweather serif fonts.
- Added accessibility font resizers (A/A+) and the NALSA Free Legal Aid Helpline (15100).
- Replaced sci-fi/AI "glassmorphic" elements with high-contrast, trustworthy `govt-card` containers.

### 2. Core Explainer Engine (`POST /api/explain`)
- Takes certified court order text and an optional 16-character CNR number.
- Calls the Gemini API with a strict system prompt to act as a neutral explainer, not a legal advisor.
- **Output Structure**:
  - What Happened
  - What You Need To Do (Procedural Steps)
  - Key Dates
  - Where This Stands
  - Clause Breakdown (mapping plain text back to original legal text).
- Includes a mandatory, non-dismissible statutory disclaimer banner.

### 3. Live eCourts Case Lookup & CAPTCHA Relay
- Implemented a live proxy pipeline to the official eCourts portal via the Python `ai-pipeline`.
- **CAPTCHA Relay Flow**: Since eCourts uses CAPTCHAs for scraping, we bridge the gap by fetching the CAPTCHA image via the Python backend, relaying it to the React UI for the user to solve, and submitting their answer back to complete the request.
- **CSRF Fix**: Built a dynamic token extractor that fetches a fresh `__csrf_magic` token directly from the eCourts search pages to prevent silent authentication failures.
- Falls back to local mock data gracefully if the case number fails, the API goes down, or the Python server is offline.

### 4. Statutory Legal Glossary Drawer
- A modern, slide-over right-side drawer UI (`GlossaryDrawer.tsx`) for searching common legal terms.
- Includes a semi-transparent backdrop, scroll lock, and ESC-to-close accessibility.
- Features a dynamic search bar with empty states and segmented horizontal category filter chips (Procedural, Financial, Parties, etc.).
- Premium, compact glossary cards displaying definitions and usage examples.

### 5. Rights-Awareness Chatbot (`POST /api/chat`)
- Added a floating chat widget to the UI (`ChatWidget.tsx`) to answer basic legal rights questions without giving specific legal advice.
- Integrates with Gemini 3.6 Flash and passes the conversation `history` to maintain context.
- Uses a strict structured prompt format to answer legal queries:
  - **What this means**: Simple explanation.
  - **Relevant law**: Specific Acts & Sections (e.g., Section 154 CrPC).
  - **What you can do**: Actionable bullet points.
  - **Note**: Persistent disclaimer to call NALSA at 15100.

### 6. Admin Portal & Dynamic Examples (`/admin`)
- Created a separate `/admin` route (no authentication required for hackathon demos).
- Allows users to add new demo cases by pasting text or uploading PDFs, entering a CNR, and specifying case details.
- Saves new cases dynamically to `backend/data/examples.json` via `POST /api/admin/examples`.
- The main page's "Try an Example" dropdown instantly syncs with this JSON file via `GET /api/examples`.
- Added ability to delete demo cases from the admin dashboard.

### 7. Supplementary Widgets
- **Action Checklist**: A compact component listing next steps extracted from the order.
- **Timeline Widget**: Visualizes key case dates (e.g., Next Hearing, Filing Date) in chronological order.

## 🚀 How to Run the Project

You need three terminal tabs if using live eCourts features:

**Terminal 1 (Backend - Node.js):**
```bash
cd backend
npm install
GEMINI_API_KEY="YOUR_GEMINI_API_KEY" node server.js
```

**Terminal 2 (Frontend - React):**
```bash
cd frontend
npm install
npm run dev
```
*(Runs on port 5173, Backend on port 3001)*

**Terminal 3 (AI Pipeline - Python):**
```bash
cd ai-pipeline
python -m venv venv
.\venv\Scripts\Activate.ps1   # (or source venv/bin/activate on Mac/Linux)
pip install -r requirements.txt
python main.py
```
*(Runs on port 8000)*

## 📌 Next Steps / Where We Left Off
- All core hackathon MVP functionality is complete and merged to `main`.
- The latest pushes include the overhauled Glossary Drawer, the Chatbot, and the finalized live eCourts CAPTCHA proxy logic.
- If testing the live eCourts CAPTCHA feature, ensure the Python AI pipeline is running, otherwise the React frontend will immediately fallback to the mock local JSON payload.
