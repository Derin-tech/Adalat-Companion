const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const app = express();
const port = process.env.PORT || 3001;
const AI_PIPELINE_URL = 'http://127.0.0.1:8000';

app.use(cors());
app.use(express.json());

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Fallback logic
const getMockData = (filename) => {
  const filePath = path.join(__dirname, '..', 'shared', 'mock-data', filename);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return null;
};

// 1. POST /api/upload
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Attempt to call AI pipeline
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path));

    const response = await axios.post(`${AI_PIPELINE_URL}/process`, formData, {
      headers: formData.getHeaders(),
    });
    
    // Clean up upload
    fs.unlinkSync(req.file.path);
    
    res.json({
      caseId: response.data.caseId || 'case-' + Date.now(),
      status: 'ready'
    });
  } catch (error) {
    console.error('AI pipeline upload failed, falling back to mock data:', error.message);
    
    // Clean up upload
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.json({
      caseId: 'mock-case-123',
      status: 'ready',
      fallback: true
    });
  }
});

// 2. GET /api/summary/:caseId
app.get('/api/summary/:caseId', async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const response = await axios.get(`${AI_PIPELINE_URL}/summary/${req.params.caseId}?lang=${lang}`);
    res.json(response.data);
  } catch (error) {
    console.error('AI pipeline summary failed, falling back to mock data:', error.message);
    const mockData = getMockData('sample1.json');
    if (mockData) {
      mockData.language = req.query.lang || 'en';
      res.json(mockData);
    } else {
      res.status(500).json({ error: 'Mock data not found' });
    }
  }
});

// 4. POST /api/explain
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';

const EXPLAIN_SYSTEM_PROMPT = `
You are a neutral plain-language court order explainer for self-represented litigants and legal-aid users in India.
Your goal is to explain legal documents clearly without providing legal advice.

STRICT CONSTRAINTS:
1. Persona: You are a neutral explainer, NOT a legal advisor or advocate.
2. Output: Respond ONLY with a valid JSON object matching the requested schema.
3. Restrictions:
   - NEVER give legal advice or recommend what strategy a user should follow.
   - NEVER predict legal outcomes or case victory probabilities.
   - NEVER recommend a course of action.
   - If an order sentence is ambiguous or unclear, explicitly flag the ambiguity instead of guessing.

REQUIRED JSON OUTPUT SCHEMA:
{
  "whatHappened": "Plain language summary of what the court decided in this order.",
  "whatYouNeedToDo": ["Procedural step 1", "Procedural step 2"],
  "keyDates": ["YYYY-MM-DD: Description of event/deadline"],
  "whereThisStands": "Explanation of current case procedural stage.",
  "clauses": [
    {
      "id": "clause-1",
      "originalText": "Exact sentence or paragraph from original order text",
      "plainText": "Clear plain language translation",
      "pageNumber": 1
    }
  ],
  "keyFacts": {
    "parties": ["Petitioner Name", "Respondent Name"],
    "nextHearingDate": "YYYY-MM-DD or null",
    "stage": "Current stage name"
  }
}

FEW-SHOT EXAMPLES:

Example 1:
Order Text: "The Respondent is hereby directed to remit a sum of ₹10,000/- per mensum towards the interim maintenance of the Petitioner on or before the 5th day of every calendar month, commencing from 01.01.2026. Matter stands adjourned to 15.03.2026 for compliance."
Ideal Response:
{
  "whatHappened": "The court ordered the respondent (husband) to pay an interim monthly maintenance of ₹10,000 to the petitioner (wife) starting January 1, 2026. This money must be deposited into her bank account by the 5th of every month while the case continues.",
  "whatYouNeedToDo": [
    "Deposit ₹10,000 into the petitioner's bank account by the 5th of each calendar month.",
    "Retain bank payment receipts as proof of compliance for the court."
  ],
  "keyDates": [
    "2026-01-01: Commencement date for interim maintenance payments",
    "2026-03-15: Next court hearing date for compliance review"
  ],
  "whereThisStands": "The case is currently at the Interim Maintenance stage while trial proceedings continue.",
  "clauses": [
    {
      "id": "clause-1",
      "originalText": "The Respondent is hereby directed to remit a sum of ₹10,000/- per mensum towards the interim maintenance of the Petitioner.",
      "plainText": "The respondent must pay ₹10,000 every month for basic living expenses of the petitioner.",
      "pageNumber": 1
    },
    {
      "id": "clause-2",
      "originalText": "Matter stands adjourned to 15.03.2026 for compliance.",
      "plainText": "The next hearing is fixed for March 15, 2026 to check if payments were made.",
      "pageNumber": 1
    }
  ],
  "keyFacts": {
    "parties": ["Petitioner", "Respondent"],
    "nextHearingDate": "2026-03-15",
    "stage": "Interim Maintenance Stage"
  }
}

Example 2:
Order Text: "Applicant shall be released on bail upon executing a personal bond of ₹25,000/- with one solvent surety. Applicant shall surrender his passport before the Investigating Officer within 48 hours of release and mark attendance at police station every Monday."
Ideal Response:
{
  "whatHappened": "The court granted bail to the applicant subject to conditions: executing a ₹25,000 bond with one guarantor, surrendering passport within 48 hours of release, and signing attendance at the police station every Monday morning.",
  "whatYouNeedToDo": [
    "Execute personal bond of ₹25,000 with one solvent guarantor.",
    "Surrender passport to the Investigating Officer within 48 hours after release.",
    "Report to local police station every Monday morning."
  ],
  "keyDates": [
    "Within 48 hours of release: Surrender passport to police officer",
    "Every Monday: Attendance at local police station"
  ],
  "whereThisStands": "Bail has been granted conditionally pending trial proceedings.",
  "clauses": [
    {
      "id": "clause-1",
      "originalText": "Applicant shall be released on bail upon executing a personal bond of ₹25,000/- with one solvent surety.",
      "plainText": "The applicant can leave jail after signing a bond of ₹25,000 with one financial guarantor.",
      "pageNumber": 1
    }
  ],
  "keyFacts": {
    "parties": ["State", "Applicant"],
    "nextHearingDate": null,
    "stage": "Conditional Bail Stage"
  }
}
`;

app.post('/api/explain', async (req, res) => {
  const { orderText, caseNumber } = req.body;

  if (!orderText || typeof orderText !== 'string' || !orderText.trim()) {
    return res.status(400).json({ error: 'Field "orderText" is required.' });
  }

  // Validate caseNumber (CNR format: 16-character alphanumeric)
  let validCaseNumber = null;
  let ecourtsLink = null;
  if (caseNumber && typeof caseNumber === 'string') {
    const trimmedCnr = caseNumber.trim();
    if (/^[A-Za-z0-9]{16}$/.test(trimmedCnr)) {
      validCaseNumber = trimmedCnr.toUpperCase();
      ecourtsLink = `https://services.ecourts.gov.in/ecourtindia_v6/?cnrNumber=${validCaseNumber}`;
    } else {
      ecourtsLink = `https://services.ecourts.gov.in/ecourtindia_v6/`;
    }
  } else {
    ecourtsLink = `https://services.ecourts.gov.in/ecourtindia_v6/`;
  }

  try {
    console.log(`Calling Gemini API for case ${validCaseNumber || caseNumber || 'N/A'}...`);

    const userPrompt = `Please analyze the following court order text and provide the structured explanation JSON according to the schema:\n\nCase Number: ${validCaseNumber || caseNumber || 'Not specified'}\n\nCourt Order Text:\n"${orderText.trim()}"`;

    // Call Gemini 3.6 Flash
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(
      geminiUrl,
      {
        systemInstruction: {
          parts: [{ text: EXPLAIN_SYSTEM_PROMPT }]
        },
        contents: [
          {
            parts: [{ text: userPrompt }]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const candidate = response.data?.candidates?.[0];
    const responseText = candidate?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error('No response text returned from Gemini API');
    }

    let parsedJson = JSON.parse(responseText);
    parsedJson.caseNumber = validCaseNumber || (typeof caseNumber === 'string' ? caseNumber.trim() : null);
    parsedJson.ecourtsLink = ecourtsLink;

    res.json(parsedJson);
  } catch (error) {
    console.error('Gemini API call failed:', error.response?.data || error.message);
    
    // Attempt fallback model (gemini-1.5-flash) if 2.5 flash was not found
    try {
      if (error.response?.status === 404 && GEMINI_API_KEY) {
        console.log('Retrying with gemini-1.5-flash...');
        const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        const fallbackRes = await axios.post(
          fallbackUrl,
          {
            systemInstruction: { parts: [{ text: EXPLAIN_SYSTEM_PROMPT }] },
            contents: [{ parts: [{ text: `Case Number: ${caseNumber || 'N/A'}\nOrder: ${orderText}` }] }],
            generationConfig: { responseMimeType: "application/json" }
          }
        );
        const fbText = fallbackRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (fbText) {
          const parsedFb = JSON.parse(fbText);
          parsedFb.caseNumber = validCaseNumber || (typeof caseNumber === 'string' ? caseNumber.trim() : null);
          parsedFb.ecourtsLink = ecourtsLink;
          return res.json(parsedFb);
        }
      }
    } catch (fbError) {
      console.error('Fallback Gemini call also failed:', fbError.message);
    }
    
    // Fallback response if Anthropic API call fails or model unavailable
    const mockData = getMockData('sample1.json');
    res.json({
      whatHappened: mockData?.plainSummary || "The court has issued an order requiring compliance with specified terms.",
      whatYouNeedToDo: [
        "Review hearing dates and deposit requirements.",
        "Keep copies of payment receipts for verification."
      ],
      keyDates: [
        mockData?.keyFacts?.nextHearingDate ? `${mockData.keyFacts.nextHearingDate}: Next court hearing date` : "Date specified in order"
      ],
      whereThisStands: mockData?.keyFacts?.stage || "Interim Stage",
      clauses: mockData?.clauses || [],
      keyFacts: mockData?.keyFacts || { parties: [], nextHearingDate: null, stage: null },
      caseNumber: validCaseNumber || (typeof caseNumber === 'string' ? caseNumber.trim() : null),
      ecourtsLink: ecourtsLink,
      fallback: true,
      errorDetails: error.message
    });
  }
});

// Helper to read/write examples JSON
const EXAMPLES_FILE_PATH = path.join(__dirname, 'data', 'examples.json');

const getExamplesFromDisk = () => {
  if (fs.existsSync(EXAMPLES_FILE_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(EXAMPLES_FILE_PATH, 'utf8'));
    } catch (e) {
      console.error('Failed to parse examples.json', e);
    }
  }
  return [];
};

const saveExamplesToDisk = (examples) => {
  const dir = path.dirname(EXAMPLES_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(EXAMPLES_FILE_PATH, JSON.stringify(examples, null, 2), 'utf8');
};

// 5. GET /api/examples
app.get('/api/examples', (req, res) => {
  const examples = getExamplesFromDisk();
  res.json(examples);
});

// 6. POST /api/admin/examples
app.post('/api/admin/examples', upload.single('file'), (req, res) => {
  try {
    const { 
      title, 
      badge, 
      description, 
      rawOrderText, 
      cnrNumber, 
      courtName, 
      judgeName, 
      parties,
      stage,
      plainSummary,
      originalTextClause
    } = req.body;

    if (!title || (!rawOrderText && !req.file)) {
      return res.status(400).json({ error: 'Title and order text or PDF file are required.' });
    }

    let extractedText = rawOrderText || '';
    if (req.file) {
      // Clean up uploaded temp file
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

    const cnr = (cnrNumber && typeof cnrNumber === 'string') ? cnrNumber.trim().toUpperCase() : 'DLCT0100' + Date.now().toString().slice(-8);

    const newExample = {
      id: 'sample-' + Date.now(),
      title: title.trim(),
      badge: badge ? badge.trim() : 'District Court',
      description: description ? description.trim() : `Sample order for ${title}`,
      rawOrderText: extractedText.trim() || 'Court Order Text registered.',
      keyFacts: {
        caseTitle: `${parties || title}`,
        cnrNumber: cnr,
        courtName: courtName ? courtName.trim() : 'District Court',
        judgeName: judgeName ? judgeName.trim() : 'Hon\'ble Presiding Judge',
        parties: parties ? parties.split(',').map(p => p.trim()) : ['Petitioner', 'Respondent'],
        nextHearingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        stage: stage ? stage.trim() : 'Active Stage',
        orderDate: new Date().toISOString().split('T')[0]
      },
      changedFromPrevious: {
        changed: true,
        changes: ['Order entered into demonstration system.']
      },
      plainSummary: {
        en: plainSummary ? plainSummary.trim() : `The court has issued an order regarding ${title}. Please refer to the certified copy for details.`
      },
      clauses: {
        en: [
          {
            id: 'c1',
            originalText: originalTextClause || extractedText || 'Original clause text.',
            plainText: plainSummary || extractedText || 'Plain language explanation.',
            pageNumber: 1
          }
        ]
      }
    };

    const examples = getExamplesFromDisk();
    examples.push(newExample);
    saveExamplesToDisk(examples);

    console.log(`Saved new example "${newExample.title}" to backend/data/examples.json`);
    res.json({ success: true, example: newExample, totalExamples: examples.length });
  } catch (err) {
    console.error('Failed to save admin example:', err);
    res.status(500).json({ error: 'Failed to save example.' });
  }
});

// 7. DELETE /api/admin/examples/:id
app.delete('/api/admin/examples/:id', (req, res) => {
  const { id } = req.params;
  let examples = getExamplesFromDisk();
  examples = examples.filter(ex => ex.id !== id);
  saveExamplesToDisk(examples);
  res.json({ success: true, totalExamples: examples.length });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

