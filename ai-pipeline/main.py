from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import uuid

app = FastAPI(title="Adalat Companion AI Pipeline")

@app.post("/process")
async def process_document(file: UploadFile = File(...)):
    """
    Takes a PDF/image, runs OCR if needed, and triggers Claude for analysis.
    Currently a stub that returns a mock response.
    """
    case_id = f"case-{uuid.uuid4().hex[:8]}"
    
    # TODO: Phase 1 - OCR logic (pytesseract/pdf2image)
    # text = extract_text_from_pdf(file.file)
    
    # TODO: Phase 1 - Claude API call
    """
    PROMPT INSTRUCTIONS:
    1. Summarize the order in plain language.
    2. Break the summary into clause-level pairs: {originalText, plainText}.
    3. Extract key facts: parties, next hearing date, stage.
    4. CRITICAL: Explain, do NOT advise. No recommendations, no "you should".
    """
    
    # TODO: Phase 2 - "What changed" comparison logic
    
    return JSONResponse(content={
        "caseId": case_id,
        "status": "ready"
    })

@app.get("/summary/{case_id}")
async def get_summary(case_id: str, lang: str = "en"):
    """
    Retrieves the plain-language summary. 
    In a real system, we'd look up the processed results by case_id.
    """
    # This will typically fail in this stub, causing the Node backend to use mock data.
    return JSONResponse(status_code=404, content={"error": "Not found. (Stubbed AI Pipeline)"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
