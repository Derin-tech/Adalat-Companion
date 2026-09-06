import sys
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

sys.path.append(os.path.join(os.path.dirname(__file__), 'ecourts'))

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uuid
import base64
import json
import traceback
import re
from typing import Optional
from pathlib import Path

from ecourts.ecourt import ECourt
from ecourts.entities import Court
from ecourts.ecourt import RetryException
from relay_captcha import RelayCaptcha
import fitz  # PyMuPDF
from typing import List

from google import genai
from google.genai import types

class Clause(BaseModel):
    id: str
    originalText: str
    plainText: str
    pageNumber: int

class KeyFacts(BaseModel):
    parties: List[str]
    nextHearingDate: Optional[str]
    stage: Optional[str]
    courtName: Optional[str]

class ChangedFromPrevious(BaseModel):
    changed: bool
    changes: List[str]

class GlossaryTerm(BaseModel):
    term: str
    definition: str

class GeminiResponse(BaseModel):
    plainSummary: str
    clauses: List[Clause]
    keyFacts: KeyFacts
    changedFromPrevious: ChangedFromPrevious
    legalGlossary: Optional[List[GlossaryTerm]] = None
    language: str

STORED_ANALYSIS = {}

app = FastAPI(title="Adalat Companion AI Pipeline")

ACTIVE_SESSIONS = {}

class LookupStartRequest(BaseModel):
    registrationNumber: str
    caseType: str
    courtCode: Optional[str] = "1"
    stateCode: Optional[str] = "1"

class LookupSubmitRequest(BaseModel):
    captchaText: str

def get_mock_data():
    mock_path = Path(__file__).parent.parent / "shared" / "mock-data" / "lookup1.json"
    if mock_path.exists():
        with open(mock_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"fallback": True, "error": "Mock data not found"}

def get_fresh_csrf(ecourt: ECourt):
    """Fetch a search page to extract a fresh CSRF token."""
    cc = ecourt.court.court_code or "1"
    url = ecourt.url(f"/cases/s_casetype.php?state_cd={ecourt.court.state_code}&dist_cd=1&court_code={cc}")
    r = ecourt.session.get(url)
    match = re.search(r'name=["\']__csrf_magic["\'] value=["\']([^"\']+)["\']', r.text)
    if match:
        print(f"Extracted fresh CSRF token: {match.group(1)}")
        ecourt.CSRF_MAGIC_PARAMS = {"__csrf_magic": match.group(1)}
    else:
        print("Warning: Could not extract CSRF token dynamically.")

@app.post("/lookup/start")
async def lookup_start(req: LookupStartRequest):
    try:
        court = Court(state_code=req.stateCode, court_code=req.courtCode)
        ecourt = ECourt(court)
        get_fresh_csrf(ecourt)
        ecourt.captcha = RelayCaptcha(ecourt.session)
        ecourt.set_max_attempts(1)
        
        image_bytes = ecourt.captcha.fetch_image_bytes()
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        
        lookup_id = f"lookup-{uuid.uuid4().hex[:8]}"
        ACTIVE_SESSIONS[lookup_id] = {
            "ecourt": ecourt,
            "params": req.dict()
        }
        
        return {
            "lookupId": lookup_id,
            "captchaImage": f"data:image/png;base64,{base64_image}"
        }
    except Exception as e:
        print(f"Error starting lookup: {e}")
        return JSONResponse(status_code=200, content=get_mock_data())

@app.post("/lookup/{lookup_id}/submit")
async def lookup_submit(lookup_id: str, req: LookupSubmitRequest):
    if lookup_id not in ACTIVE_SESSIONS:
        raise HTTPException(status_code=404, detail="Lookup session not found or expired. Please restart the lookup.")
        
    session_data = ACTIVE_SESSIONS[lookup_id]
    ecourt = session_data["ecourt"]
    params = session_data["params"]
    
    ecourt.captcha.set_answer(req.captchaText)
    
    try:
        # Our case-number lookup matches searchSingleCase
        result = ecourt.searchSingleCase(params["registrationNumber"], params["caseType"])
        del ACTIVE_SESSIONS[lookup_id]
        
        return {
            "success": True,
            "data": result
        }
    except RetryException:
        print("Incorrect CAPTCHA, retrying image fetch...")
        try:
            image_bytes = ecourt.captcha.fetch_image_bytes()
            base64_image = base64.b64encode(image_bytes).decode('utf-8')
            return {
                "success": False,
                "retryCaptchaImage": f"data:image/png;base64,{base64_image}"
            }
        except Exception as e:
            print(f"Error fetching retry image: {e}")
            del ACTIVE_SESSIONS[lookup_id]
            return JSONResponse(status_code=200, content=get_mock_data())
    except Exception as e:
        print(f"Unexpected error during search: {e}")
        print(traceback.format_exc())
        del ACTIVE_SESSIONS[lookup_id]
        return JSONResponse(status_code=200, content=get_mock_data())

@app.post("/process")
async def process_document(file: UploadFile = File(...)):
    """
    Takes a PDF/image, extracts text page by page using PyMuPDF, 
    and triggers Gemini for analysis.
    Validates clauses against source text and stores result.
    """
    case_id = f"case-{uuid.uuid4().hex[:8]}"
    
    try:
        file_bytes = await file.read()
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        
        pages_data = []
        full_text = ""
        pages_data = []
        full_text = ""
        for page_num, page in enumerate(doc, start=1):
            if page_num > 1:
                break  # Process Page 1 only for demo and credit optimization
            text = page.get_text()
            clean_text = text.strip() if text else ""
            pages_data.append({
                "page_number": page_num,
                "text": clean_text
            })
            if clean_text:
                full_text += f"PAGE {page_num}:\n{clean_text}\n\n"
            
        doc.close()
        
        if not full_text.strip():
            print("PDF has no extractable text.")
            raise HTTPException(status_code=400, detail="PDF contains no extractable text.")
            
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("GEMINI_API_KEY is not configured.")
            raise HTTPException(status_code=500, detail="Server configuration error: Gemini API key missing.")
            
        client = genai.Client(api_key=api_key)
        prompt = f"""You are a legal assistant analyzing a court document.

### STRICT SOURCE GROUNDING (CRITICAL)
- The uploaded text is the SINGLE SOURCE OF TRUTH. 
- Use ONLY information explicitly present in the text.
- NEVER invent, infer, or assume facts, parties, dates, amounts, case stages, hearing dates, previous orders, or legal proceedings.
- NEVER add legal conclusions not supported by the text.
- NEVER use outside knowledge to fill in missing case information or "correct" the text.
- If information is absent, use null, an empty list, or 'Not specified'.

### LEGAL MEANING PRESERVATION
- Preserve the exact legal meaning and relationships expressed in the text.
- You MUST preserve conditional language like "or alternatively", "in the alternative", "subject to", "if applicable", and exceptions. Do NOT summarize alternative reliefs (e.g. A or B) as simultaneous reliefs (A and B).
- If the text mentions reliefs sought (like declaration, injunction, and alternative recovery of possession), you MUST include them and preserve the "in the alternative" relationship.
- You MUST distinguish clearly between:
  * Who is making a claim vs. what the court actually ordered.
  * Allegations vs. established court findings.
  * Requests/prayers vs. actual court decisions.
- Do not turn an allegation into a fact. Do not turn a prayer/request into a court finding or order.

Provide the following JSON structure:
1. plainSummary: A short, simple, and concise plain-language explanation for a normal person. Focus ONLY on these main points (if present in the text): what the application is about, what the Plaintiff requested (including main reliefs and alternatives), what the Defendant said, what the Court decided, and the next date. Answer ONLY "What does this PDF actually say?" based on the text.
2. clauses: A detailed breakdown of important clauses. For each:
   - `originalText`: CRITICAL: THIS MUST BE AN EXACT, VERBATIM SUBSTRING COPIED DIRECTLY FROM THE EXTRACTED TEXT. If you change a single character, the system will fail. DO NOT summarize, paraphrase, or fix typos here. Just copy and paste a sentence or paragraph from the text.
   - `plainText`: Simplify the clause, but rigorously preserve its legal meaning, conditions, and alternatives.
   - `pageNumber`: The actual page number where the text appears.
3. keyFacts: Extract official case particulars (parties, next hearing date, stage, courtName) ONLY if explicitly present. Do not infer them.
4. changedFromPrevious: Important developments. List procedural history, issues framed, reliefs sought (preserving alternative relationships), or legal provisions invoked, ONLY if explicitly contained in the text. Do NOT describe these as "changes from a previous hearing order" unless a previous order is actually provided. Do NOT invent a previous order for comparison. Set `changed` to true if you find ANY of these developments, and list them in `changes`.
5. legalGlossary: A list of important legal terms appearing in the document and their plain-language definitions.
6. language: "en"

EXTRACTED TEXT:
{full_text}
"""
        
        response = client.models.generate_content(
            model='gemini-3.5-flash-lite',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=GeminiResponse,
            ),
        )
        
        structured_data = json.loads(response.text)
        
        # Source Validation for Clauses
        valid_clauses = []
        for clause in structured_data.get('clauses', []):
            orig_text = clause.get('originalText', '')
            page_num = clause.get('pageNumber', 1)
            
            # 1. Check if exact substring exists on the specified page
            if 1 <= page_num <= len(pages_data) and orig_text in pages_data[page_num - 1]['text']:
                valid_clauses.append(clause)
            else:
                # 2. Attempt fallback: search all pages
                found = False
                for p_idx, p_data in enumerate(pages_data):
                    if orig_text in p_data['text']:
                        clause['pageNumber'] = p_idx + 1
                        valid_clauses.append(clause)
                        found = True
                        break
                
                if not found:
                    print(f"Validation failed for hallucinated/modified clause: '{orig_text[:50]}...'. Dropping clause.")
                    
        structured_data['clauses'] = valid_clauses
        structured_data['language'] = "en"
        
        # Store the validated analysis
        STORED_ANALYSIS[case_id] = structured_data
        print(f"Successfully processed and stored analysis for {case_id}")
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error processing PDF with Gemini: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=400, detail="Invalid or corrupted PDF file, or AI pipeline failure.")

    return JSONResponse(content={
        "caseId": case_id,
        "status": "ready"
    })

@app.get("/summary/{case_id}")
async def get_summary(case_id: str, lang: str = "en"):
    """
    Retrieves the plain-language summary. 
    """
    if case_id in STORED_ANALYSIS:
        return JSONResponse(content=STORED_ANALYSIS[case_id])
    return JSONResponse(status_code=404, content={"error": "Not found. (Stubbed AI Pipeline)"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
