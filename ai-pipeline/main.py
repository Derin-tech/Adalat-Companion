import sys
import os
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
    Takes a PDF/image, runs OCR if needed, and triggers Claude for analysis.
    Currently a stub that returns a mock response.
    """
    case_id = f"case-{uuid.uuid4().hex[:8]}"
    return JSONResponse(content={
        "caseId": case_id,
        "status": "ready"
    })

@app.get("/summary/{case_id}")
async def get_summary(case_id: str, lang: str = "en"):
    """
    Retrieves the plain-language summary. 
    """
    return JSONResponse(status_code=404, content={"error": "Not found. (Stubbed AI Pipeline)"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
