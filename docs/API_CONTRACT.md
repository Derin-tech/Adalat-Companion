# Adalat Companion - API Contract

This document describes the fixed API contract for the Adalat Companion MVP.

## Endpoints

### 1. `POST /api/upload`
Uploads a court order file.
- **Input:** `multipart/form-data` with one field (e.g. `file`) containing a PDF or image file.
- **Output:**
```json
{
  "caseId": "string",
  "status": "processing" // or "ready", "error"
}
```

### 2. `GET /api/summary/:caseId`
Retrieves the plain-language summary and key facts for a processed case.
- **Output:**
```json
{
  "plainSummary": "string",
  "clauses": [
    {
      "id": "string",
      "originalText": "string",
      "plainText": "string",
      "pageNumber": 1
    }
  ],
  "keyFacts": {
    "parties": ["string"],
    "nextHearingDate": "string | null",
    "stage": "string | null"
  },
  "changedFromPrevious": {
    "changed": true,
    "changes": ["string"]
  },
  "language": "string"
}
```
*Note: If the case processing failed or the backend cannot reach the AI pipeline, this endpoint returns a fallback mock response with an additional property `fallback: true`.*

### 3. `GET /api/lookup/:cnrNumber`
Looks up basic case details using a CNR number.
- **Output:**
```json
{
  "partyNames": ["string"],
  "caseType": "string",
  "filingDate": "string",
  "stage": "string",
  "nextHearingDate": "string | null"
}
```
*Note: Includes `fallback: true` on error for UI gracefulness.*
