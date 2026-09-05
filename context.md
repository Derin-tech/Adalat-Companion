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

### 3. eCourts Integration
- Validates the 16-character CNR number.
- Generates a direct verification link to the official eCourts portal (`services.ecourts.gov.in`).

### 4. Admin Portal & Dynamic Examples (`/admin`)
- Created a separate `/admin` route (no authentication required for hackathon demos).
- Allows users to add new demo cases by pasting text or uploading PDFs, entering a CNR, and specifying case details.
- Saves new cases dynamically to `backend/data/examples.json` via `POST /api/admin/examples`.
- The main page's "Try an Example" dropdown instantly syncs with this JSON file via `GET /api/examples`.
- Added ability to delete demo cases from the admin dashboard.

### 5. Rights-Awareness Chatbot (`POST /api/chat`)
- Added a floating chat widget to the UI (`frontend/src/components/ChatWidget.tsx`) to answer basic legal rights questions without giving specific legal advice.
- Integrates with Gemini 3.6 Flash and passes the conversation `history` to maintain context.
- Uses a strict structured prompt format to answer legal queries:
  - **What this means**: Simple explanation.
  - **Relevant law**: Specific Acts & Sections (e.g., Section 154 CrPC).
  - **What you can do**: Actionable bullet points.
  - **Note**: Persistent disclaimer to call NALSA at 15100.

## 🚀 How to Run the Project

You need two terminal tabs:

**Terminal 1 (Backend):**
```bash
cd backend
npm install
GEMINI_API_KEY="YOUR_GEMINI_API_KEY" node server.js
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

*Note: The frontend runs on port 5173, and the backend runs on port 3001.*

## 📌 Next Steps / Where We Left Off
- The core functionality, UI, and admin demo management are complete and pushed to the `main` branch.
- You recently pulled the latest changes (`git pull origin main`), which included updates to the Python `ai-pipeline` (scrapers, parsers, eCourts integration).
- If you plan to use the advanced Python AI pipeline for scraping live eCourts data (captcha solving, etc.), you will need to set up the Python environment (`cd ai-pipeline && pip install -r requirements.txt` and run `uvicorn main:app --port 8000`). Currently, the Node.js backend handles the Gemini calls and gracefully falls back to mock data if the Python server is unreachable.
