const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const nodemailer = require('nodemailer');
let pdfParse = require('pdf-parse');
if (pdfParse && typeof pdfParse !== 'function' && typeof pdfParse.default === 'function') {
  pdfParse = pdfParse.default;
}
require('dotenv').config();
const lawyerConnectRouter = require('./routes/lawyerConnect');

const app = express();
const port = process.env.PORT || 3001;
const AI_PIPELINE_URL = 'http://127.0.0.1:8000';

app.use(cors());
app.use(express.json());
app.use('/api/lawyer-connect', lawyerConnectRouter);

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

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
`;

// Fallback logic
const getMockData = (filename) => {
  const filePath = path.join(__dirname, '..', 'shared', 'mock-data', filename);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return null;
};

async function analyzePdfPage1(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    let parseFn = typeof pdfParse === 'function' ? pdfParse : (pdfParse && typeof pdfParse.default === 'function' ? pdfParse.default : null);

    if (typeof parseFn !== 'function') {
      console.error('pdfParse is not callable. Check pdf-parse package.');
      return null;
    }

    const pdfData = await parseFn(dataBuffer, { max: 1 });
    const page1Text = pdfData && pdfData.text ? pdfData.text.trim() : '';

    if (!page1Text || page1Text.length < 10) {
      console.log('PDF Page 1 text layer is empty or scanned image.');
      return null;
    }

    console.log(`Successfully extracted Page 1 text (${page1Text.length} characters). Calling Gemini API...`);

    const userPrompt = `Please analyze ONLY Page 1 of the following court order document and provide the structured explanation JSON according to the schema:\n\nPage 1 Extracted Text:\n"${page1Text.slice(0, 3500)}"`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(
      geminiUrl,
      {
        systemInstruction: { parts: [{ text: EXPLAIN_SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.2 }
      },
      { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }
    );

    const jsonStr = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (jsonStr) {
      const parsed = JSON.parse(jsonStr);
      return parsed;
    }
  } catch (err) {
    console.error('Error analyzing PDF Page 1 with Gemini:', err.message);
  }
  return null;
}

// 1. POST /api/upload
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;

  try {
    // 1. Try python pipeline first if running
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));
      const response = await axios.post(`${AI_PIPELINE_URL}/process`, formData, {
        headers: formData.getHeaders(),
        timeout: 3000
      });
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.json({
        caseId: response.data.caseId || 'case-' + Date.now(),
        status: 'ready',
        data: response.data.summary
      });
    } catch (e) {
      // Pipeline offline, fallback to Node.js Page 1 extraction
    }

    // 2. Perform live Page-1 extraction and Gemini AI analysis directly
    const realPage1Analysis = await analyzePdfPage1(filePath);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    if (realPage1Analysis) {
      return res.json({
        caseId: 'uploaded-pdf-' + Date.now(),
        status: 'ready',
        data: realPage1Analysis
      });
    }

    // 3. Fallback if PDF has no text layer (scanned image)
    const fallbackData = getMockData('sample1.json');
    return res.json({
      caseId: 'uploaded-pdf-' + Date.now(),
      status: 'ready',
      data: fallbackData
    });
  } catch (error) {
    console.error('Upload processing error:', error.message);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return res.status(500).json({ error: 'Failed to process uploaded file.' });
  }
});

// 2. GET /api/summary/:caseId
app.get('/api/summary/:caseId', async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const response = await axios.get(`${AI_PIPELINE_URL}/summary/${req.params.caseId}?lang=${lang}`);
    res.json(response.data);
  } catch (error) {
    console.error('AI pipeline summary note:', error.message);
    
    const mockData = getMockData('sample1.json');
    if (mockData) {
      mockData.language = req.query.lang || 'en';
      return res.json(mockData);
    }
    
    res.status(500).json({ error: 'Failed to fetch summary: ' + (error.response?.data?.detail || error.message) });
  }
});

// eCourts portal live lookup integration
const cheerio = require('cheerio');

const ECOURTS_BASE = 'https://services.ecourts.gov.in/ecourtindia_v6';

// In-memory session store for pending lookups (keyed by lookupId)
const lookupSessions = new Map();

// Cleanup stale sessions after 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of lookupSessions) {
    if (now - session.createdAt > 5 * 60 * 1000) {
      lookupSessions.delete(id);
    }
  }
}, 60 * 1000);

// Helper: extract cookies from set-cookie headers
function extractCookies(setCookieHeaders) {
  if (!setCookieHeaders) return '';
  const headers = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
  return headers.map(c => c.split(';')[0]).join('; ');
}

// Helper: merge cookies
function mergeCookies(existing, newCookies) {
  const cookieMap = new Map();
  const parse = (str) => {
    if (!str) return;
    str.split(';').forEach(pair => {
      const [key, ...val] = pair.trim().split('=');
      if (key) cookieMap.set(key.trim(), val.join('='));
    });
  };
  parse(existing);
  if (typeof newCookies === 'string') {
    parse(newCookies);
  } else if (Array.isArray(newCookies)) {
    newCookies.forEach(c => parse(c.split(';')[0]));
  }
  return [...cookieMap.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
}

// 3. POST /api/lookup/start — Initialize eCourts session + fetch CAPTCHA
app.post('/api/lookup/start', async (req, res) => {
  const { cnrNumber } = req.body;
  
  if (!cnrNumber || typeof cnrNumber !== 'string' || cnrNumber.trim().length !== 16) {
    return res.status(400).json({ error: 'A valid 16-digit CNR number is required.' });
  }

  try {
    console.log(`[eCourts Lookup] Starting session for CNR: ${cnrNumber.trim().toUpperCase()}`);
    
    // Step 1: Load homepage to get session cookie + app_token
    const homeRes = await axios.get(`${ECOURTS_BASE}/?p=home/index`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 15000,
      maxRedirects: 5,
    });

    let cookies = extractCookies(homeRes.headers['set-cookie']);
    
    // Extract app_token from HTML
    const $ = cheerio.load(homeRes.data);
    let appToken = $('#app_token').val() || '';
    
    console.log(`[eCourts Lookup] Got session. app_token: ${appToken ? appToken.substring(0, 10) + '...' : 'empty'}`);

    // Step 2: Fetch CAPTCHA image using same session
    const captchaUrl = `${ECOURTS_BASE}/vendor/securimage/securimage_show.php?${Math.random()}`;
    const captchaRes = await axios.get(captchaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Cookie': cookies,
        'Referer': `${ECOURTS_BASE}/?p=home/index`,
      },
      responseType: 'arraybuffer',
      timeout: 10000,
    });

    // Merge any new cookies from captcha response
    cookies = mergeCookies(cookies, captchaRes.headers['set-cookie']);

    // Convert CAPTCHA image to base64 data URI
    const captchaBase64 = Buffer.from(captchaRes.data).toString('base64');
    const captchaMime = captchaRes.headers['content-type'] || 'image/png';
    const captchaDataUri = `data:${captchaMime};base64,${captchaBase64}`;

    // Store session
    const lookupId = 'lookup-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);
    lookupSessions.set(lookupId, {
      cnrNumber: cnrNumber.trim().toUpperCase(),
      cookies,
      appToken,
      createdAt: Date.now(),
    });

    console.log(`[eCourts Lookup] Session stored: ${lookupId}. CAPTCHA fetched (${captchaRes.data.length} bytes).`);

    res.json({
      lookupId,
      captchaImage: captchaDataUri,
      fallback: false,
    });

  } catch (error) {
    console.error('[eCourts Lookup] Failed to start session:', error.message);
    res.status(502).json({ 
      error: 'Could not connect to the eCourts portal. The portal may be temporarily unavailable. Please try again later.',
      details: error.message 
    });
  }
});

// 3.1 POST /api/lookup/:lookupId/submit — Submit CAPTCHA + fetch case data
app.post('/api/lookup/:lookupId/submit', async (req, res) => {
  const { lookupId } = req.params;
  const { captchaText } = req.body;

  const session = lookupSessions.get(lookupId);
  if (!session) {
    return res.status(404).json({ error: 'Session expired or not found. Please restart the lookup.' });
  }

  if (!captchaText || typeof captchaText !== 'string' || !captchaText.trim()) {
    return res.status(400).json({ error: 'CAPTCHA answer is required.' });
  }

  try {
    console.log(`[eCourts Lookup] Submitting CNR ${session.cnrNumber} with CAPTCHA answer...`);

    const postData = `cino=${encodeURIComponent(session.cnrNumber)}&fcaptcha_code=${encodeURIComponent(captchaText.trim())}&ajax_req=true&app_token=${encodeURIComponent(session.appToken)}`;

    const searchRes = await axios.post(
      `${ECOURTS_BASE}/?p=cnr_status/searchByCNR/`,
      postData,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': session.cookies,
          'Referer': `${ECOURTS_BASE}/?p=home/index`,
          'X-Requested-With': 'XMLHttpRequest',
          'delimeter': 'du7rdsf2484rf',
          'D768623tye8gfew': 'du7rdsf2484rf',
        },
        timeout: 20000,
        validateStatus: () => true,
      }
    );

    // Update session cookies and app_token from response
    session.cookies = mergeCookies(session.cookies, searchRes.headers['set-cookie']);
    
    let result;
    if (typeof searchRes.data === 'string') {
      try { result = JSON.parse(searchRes.data); } catch { result = { casetype_list: searchRes.data, status: 2 }; }
    } else {
      result = searchRes.data;
    }

    // Update app_token if returned
    if (result.app_token) {
      session.appToken = result.app_token;
    }

    console.log(`[eCourts Lookup] Response status: ${result.status}, has casetype_list: ${!!result.casetype_list}`);

    // status=0 means CAPTCHA was wrong or error
    if (result.status === 0 || result.status === '0') {
      // Fetch new CAPTCHA for retry
      try {
        const newCaptchaUrl = `${ECOURTS_BASE}/vendor/securimage/securimage_show.php?${Math.random()}`;
        const newCaptchaRes = await axios.get(newCaptchaUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Cookie': session.cookies,
            'Referer': `${ECOURTS_BASE}/?p=home/index`,
          },
          responseType: 'arraybuffer',
          timeout: 10000,
        });
        session.cookies = mergeCookies(session.cookies, newCaptchaRes.headers['set-cookie']);
        const newBase64 = Buffer.from(newCaptchaRes.data).toString('base64');
        const newMime = newCaptchaRes.headers['content-type'] || 'image/png';
        
        return res.json({
          success: false,
          retryCaptchaImage: `data:${newMime};base64,${newBase64}`,
          message: result.errormsg || 'Invalid CAPTCHA. Please try again.',
        });
      } catch (captchaErr) {
        console.error('[eCourts Lookup] Failed to fetch retry CAPTCHA:', captchaErr.message);
        return res.json({
          success: false,
          retryCaptchaImage: null,
          message: 'Invalid CAPTCHA and failed to load a new one. Please restart the lookup.',
        });
      }
    }

    // status=1 or 2 means we have case data (HTML)
    if (result.casetype_list) {
      const parsedData = parseEcourtsHtml(result.casetype_list, session.cnrNumber);
      
      // Clean up session
      lookupSessions.delete(lookupId);

      return res.json({
        success: true,
        data: parsedData,
        fallback: false,
      });
    }

    // Unexpected response
    lookupSessions.delete(lookupId);
    return res.json({
      success: false,
      message: result.errormsg || 'No case data found for this CNR number. Please verify and try again.',
    });

  } catch (error) {
    console.error('[eCourts Lookup] Submit failed:', error.message);
    lookupSessions.delete(lookupId);
    res.status(502).json({ 
      error: 'Could not retrieve case data from eCourts portal. The portal may be temporarily unavailable.',
      details: error.message 
    });
  }
});

// Helper: Parse eCourts HTML response into structured data
function parseEcourtsHtml(html, cnrNumber) {
  const $ = cheerio.load(html);
  
  const data = {
    caseNumber: cnrNumber,
    ecourtsLink: `https://services.ecourts.gov.in/ecourtindia_v6/?p=home/index&cino=${cnrNumber}`,
    rawHtml: html,
  };

  // Try to extract case details from tables
  const tables = $('table');
  const keyFacts = {
    parties: [],
    nextHearingDate: null,
    stage: null,
    courtName: null,
    judgeName: null,
    caseTitle: null,
    cnrNumber: cnrNumber,
  };

  // Parse all table rows looking for key-value patterns
  const allText = [];
  tables.each((_, table) => {
    $(table).find('tr').each((_, tr) => {
      const cells = $(tr).find('td, th');
      if (cells.length >= 2) {
        const label = $(cells[0]).text().trim().toLowerCase();
        const value = $(cells[1]).text().trim();
        
        if (label.includes('case type') || label.includes('case no')) {
          keyFacts.caseTitle = value;
        }
        if (label.includes('petitioner') || label.includes('complainant') || label.includes('applicant')) {
          keyFacts.parties.push(value + ' (Petitioner)');
        }
        if (label.includes('respondent') || label.includes('accused') || label.includes('opposite party')) {
          keyFacts.parties.push(value + ' (Respondent)');
        }
        if (label.includes('next') && label.includes('date')) {
          keyFacts.nextHearingDate = value;
        }
        if (label.includes('stage') || label.includes('status')) {
          keyFacts.stage = value;
        }
        if (label.includes('court') && !label.includes('order')) {
          keyFacts.courtName = value;
        }
        if (label.includes('judge') || label.includes('bench')) {
          keyFacts.judgeName = value;
        }
      }
      // Collect all text for summary
      const rowText = $(tr).text().trim();
      if (rowText) allText.push(rowText);
    });
  });

  // Also check for labeled spans/divs
  $('label, strong, b, span.case_details_label').each((_, el) => {
    const labelText = $(el).text().trim().toLowerCase();
    const nextText = $(el).next().text().trim() || $(el).parent().text().trim();
    
    if (labelText.includes('next date') && nextText) {
      // Try to extract just the date portion
      const dateMatch = nextText.match(/\d{2}[-\/]\d{2}[-\/]\d{4}/);
      if (dateMatch) keyFacts.nextHearingDate = dateMatch[0];
    }
  });

  // Extract case title from heading if not found in tables
  if (!keyFacts.caseTitle) {
    const heading = $('h2, h3, h4, .case_number, .case_details').first().text().trim();
    if (heading) keyFacts.caseTitle = heading;
  }

  // Build a plain summary from the HTML
  const plainText = $.root().text().replace(/\s+/g, ' ').trim();
  
  data.keyFacts = keyFacts;
  data.plainSummary = plainText.substring(0, 1000) || 'Case data retrieved from eCourts portal.';
  data.whatHappened = `Case data for CNR ${cnrNumber} retrieved from eCourts portal. ${keyFacts.caseTitle ? 'Case: ' + keyFacts.caseTitle + '.' : ''} ${keyFacts.stage ? 'Current stage: ' + keyFacts.stage + '.' : ''}`;
  data.whatYouNeedToDo = [];
  if (keyFacts.nextHearingDate) {
    data.whatYouNeedToDo.push(`Attend the next hearing on ${keyFacts.nextHearingDate}.`);
  }
  data.keyDates = [];
  if (keyFacts.nextHearingDate) {
    data.keyDates.push(`${keyFacts.nextHearingDate}: Next hearing date`);
  }
  data.whereThisStands = keyFacts.stage || 'See case details below.';
  data.clauses = [];

  return data;
}

// 4. POST /api/explain
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

    // Call Gemini 3.5 Flash Lite
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

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

// POST /api/translate
app.post('/api/translate', async (req, res) => {
  const { text, targetLang } = req.body;
  if (!text || !targetLang || targetLang === 'en') {
    return res.json({ translatedText: text });
  }

  const langNames = {
    hi: 'Hindi',
    ta: 'Tamil',
    te: 'Telugu',
    kn: 'Kannada',
    bn: 'Bengali',
    ml: 'Malayalam'
  };

  const targetLangName = langNames[targetLang] || targetLang;

  try {
    if (GEMINI_API_KEY) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
      const prompt = `Translate the following plain-language legal explanation into clear, accessible ${targetLangName} for a self-represented litigant. Return ONLY the translation without quotes or markdown:\n\n${text}`;

      const response = await axios.post(
        geminiUrl,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1 }
        },
        { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
      );

      const translated = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (translated) {
        return res.json({ translatedText: translated });
      }
    }
  } catch (err) {
    console.error(`Translation error for ${targetLang}:`, err.message);
  }

  // Fallback translation dictionary for offline/no-API-key mode
  const FALLBACK_TRANSLATIONS = {
    hi: {
      "The court has directed the respondent to pay an interim monthly maintenance amount of ₹10,000 to the petitioner starting from January 1, 2026. This amount must be deposited in the petitioner's bank account by the 5th of every month. The next hearing is scheduled to review the compliance of this ex parte order.": "अदालत ने प्रतिवादी को 1 जनवरी 2026 से याचिकाकर्ता को ₹10,000 की अंतरिम मासिक गुजारा भत्ता राशि का भुगतान करने का निर्देश दिया है। यह राशि हर महीने की 5 तारीख तक याचिकाकर्ता के बैंक खाते में जमा की जानी चाहिए। इस एकपक्षीय आदेश के अनुपालन की समीक्षा के लिए अगली सुनवाई निर्धारित है।",
      "The court has ordered the husband (respondent) to pay an interim monthly maintenance of ₹10,000 to the wife (petitioner) starting January 1, 2026. This money must be deposited directly into her bank account by the 5th of every month to cover living expenses while the case continues. The next court hearing is set for March 15, 2026.": "अदालत ने पति (प्रतिवादी) को 1 जनवरी 2026 से पत्नी (याचिकाकर्ता) को ₹10,000 का अंतरिम मासिक गुजारा भत्ता देने का आदेश दिया है। यह राशि हर महीने की 5 तारीख तक सीधे उनके बैंक खाते में जमा की जानी चाहिए। अगली सुनवाई 15 मार्च 2026 तय की गई है।",
      "The court has postponed today's hearing because the respondent's senior lawyer was unwell and could not attend. The case will next be heard on April 28, 2026 for questioning the main witness (PW-1). Any temporary stay or protection orders issued earlier remain active until that date.": "अदालत ने आज की सुनवाई स्थगित कर दी है क्योंकि प्रतिवादी के वरिष्ठ वकील अस्वस्थता के कारण उपस्थित नहीं हो सके। मामले की अगली सुनवाई 28 अप्रैल 2026 को मुख्य गवाह (PW-1) से जिरह के लिए होगी। पहले दिए गए सभी अंतरिम संरक्षण आदेश अगली सुनवाई तक जारी रहेंगे।",
      "The court has approved bail for the applicant (Rajesh Verma) under specific conditions. He will be released from custody once he submits a security deposit (surety) of ₹25,000. He must surrender his passport, report to the police station every Monday between 10 AM and 1 PM, and cannot contact any witnesses.": "अदालत ने आवेदक (राजेश वर्मा) को विशेष शर्तों पर जमानत दे दी है। ₹25,000 का मुचलका और ज़मानतदार पेश करने पर उन्हें रिहा किया जाएगा। उन्हें 48 घंटे के भीतर अपना पासपोर्ट जमा करना होगा और हर सोमवार सुबह पुलिस स्टेशन में हाजिरी लगानी होगी।"
    },
    ta: {
      "The court has directed the respondent to pay an interim monthly maintenance amount of ₹10,000 to the petitioner starting from January 1, 2026. This amount must be deposited in the petitioner's bank account by the 5th of every month. The next hearing is scheduled to review the compliance of this ex parte order.": "நீதிமன்றம் எதிர்மனுதாரருக்கு 1 ஜனவரி 2026 முதல் மனுதாரருக்கு ₹10,000 இடைக்கால மாத பராமரிப்புத் தொகையை வழங்க உத்தரவிட்டுள்ளது. இந்தத் தொகை ஒவ்வொரு மாதமும் 5ஆம் தேதிக்குள் மனுதாரரின் வங்கிக் கணக்கில் செலுத்தப்பட வேண்டும். இந்த ஒருதலைப்பட்ச உத்தரவின் இணக்கத்தை மறுபரிசீலனை செய்ய அடுத்த விசாரணை திட்டமிடப்பட்டுள்ளது.",
      "The court has ordered the husband (respondent) to pay an interim monthly maintenance of ₹10,000 to the wife (petitioner) starting January 1, 2026. This money must be deposited directly into her bank account by the 5th of every month to cover living expenses while the case continues. The next court hearing is set for March 15, 2026.": "நீதிமன்றம் கணவரை (பதில் மனுதாரர்) ஜனவரி 1, 2026 முதல் மனைவிக்கும் (மனுதாரர்) மாதம் ₹10,000 இடைக்கால ஜீவனாம்சம் வழங்க உத்தரவிட்டுள்ளது. ஒவ்வொரு மாதமும் 5ஆம் தேதிக்குள் நேரடியாக வங்கிச் கணக்கில் செலுத்த வேண்டும். அடுத்த விசாரணை மார்ச் 15, 2026 அன்று நடைபெறும்.",
      "The court has postponed today's hearing because the respondent's senior lawyer was unwell and could not attend. The case will next be heard on April 28, 2026 for questioning the main witness (PW-1). Any temporary stay or protection orders issued earlier remain active until that date.": "எதிர்தரப்பு வழக்கறிஞர் உடல்நலக் குறைவால் வர முடியாததால் வழக்கு ஏப்ரல் 28, 2026 ஆம் தேதிக்கு ஒத்திவைக்கப்பட்டுள்ளது. சாட்சி PW-1 குறுக்கு விசாரணை செய்யப்படும்.",
      "The court has approved bail for the applicant (Rajesh Verma) under specific conditions. He will be released from custody once he submits a security deposit (surety) of ₹25,000. He must surrender his passport, report to the police station every Monday between 10 AM and 1 PM, and cannot contact any witnesses.": "மனுதாரருக்கு (ராஜேஷ் வர்மா) குறிப்பிட்ட நிபந்தனைகளுடன் பிணை வழங்கப்பட்டுள்ளது. ₹25,000 பிணைத் தொகை செலுத்திய பின் விடுவிக்கப்படுவார். 48 மணி நேரத்திற்குள் கடவுச்சீட்டை ஒப்படைக்க வேண்டும்."
    },
    te: {
      "The court has directed the respondent to pay an interim monthly maintenance amount of ₹10,000 to the petitioner starting from January 1, 2026. This amount must be deposited in the petitioner's bank account by the 5th of every month. The next hearing is scheduled to review the compliance of this ex parte order.": "కోర్టు ప్రతివాదికి జనవరి 1, 2026 నుండి పిటిషనర్‌కు నెలకు ₹10,000 తాత్కాలిక నిర్వహణ మొత్తాన్ని చెల్లించాలని ఆదేశించింది. ఈ మొత్తం ప్రతి నెలా 5వ తేదీలోగా పిటిషనర్ బ్యాంక్ ఖాతాలో జమ చేయాలి. ఈ ఏకపక్ష ఉత్తర్వుల అమలును సమీక్షించేందుకు తదుపరి విచారణ నిర్ణయించబడింది.",
      "The court has ordered the husband (respondent) to pay an interim monthly maintenance of ₹10,000 to the wife (petitioner) starting January 1, 2026. This money must be deposited directly into her bank account by the 5th of every month to cover living expenses while the case continues. The next court hearing is set for March 15, 2026.": "కోర్టు భర్త (ప్రతివాది) కి జనవరి 1, 2026 నుండి భార్య (పిటిషనర్) కి నెలకు ₹10,000 తాత్కాలిక నిర్వహణ భత్యం చెల్లించాలని ఆదేశించింది. ప్రతి నెల 5వ తేదీలోగా ఆమె బ్యాంక్ ఖాతాలో జమ చేయాలి. తదుపరి విచారణ మార్చి 15, 2026న జరగనుంది.",
      "The court has postponed today's hearing because the respondent's senior lawyer was unwell and could not attend. The case will next be heard on April 28, 2026 for questioning the main witness (PW-1). Any temporary stay or protection orders issued earlier remain active until that date.": "ప్రతివాది తరఫు న్యాయవాది అనారోగ్యం కారణంగా నేటి విచారణను ఏప్రిల్ 28, 2026కి వాయిదా వేశారు. సాక్షి PW-1 విచారణ జరుగుతుంది.",
      "The court has approved bail for the applicant (Rajesh Verma) under specific conditions. He will be released from custody once he submits a security deposit (surety) of ₹25,000. He must surrender his passport, report to the police station every Monday between 10 AM and 1 PM, and cannot contact any witnesses.": "దరఖాస్తుదారునికి (రాజేష్ వర్మ) కొన్ని షరతులతో బెయిల్ మంజూరు చేయబడింది. ₹25,000 షూరిటీ సమర్పించిన తర్వాత విడుదలవుతారు. 48 గంటల్లో పాస్‌పోర్ట్ సరెండర్ చేయాలి."
    },
    kn: {
      "The court has directed the respondent to pay an interim monthly maintenance amount of ₹10,000 to the petitioner starting from January 1, 2026. This amount must be deposited in the petitioner's bank account by the 5th of every month. The next hearing is scheduled to review the compliance of this ex parte order.": "ಜನವರಿ 1, 2026 ರಿಂದ ಅರ್ಜಿದಾರರಿಗೆ ₹10,000 ಮಧ್ಯಂತರ ಮಾಸಿಕ ಜೀವನಾಂಶ ಮೊತ್ತವನ್ನು ಪಾವತಿಸುವಂತೆ ನ್ಯಾಯಾಲಯವು ಪ್ರತಿವಾದಿಗೆ ನಿರ್ದೇಶಿಸಿದೆ. ಈ ಮೊತ್ತವನ್ನು ಪ್ರತಿ ತಿಂಗಳ 5 ನೇ ತಾರೀಖಿನೊಳಗೆ ಅರ್ಜಿದಾರರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮಾ ಮಾಡಬೇಕು. ಈ ಏಕಪಕ್ಷೀಯ ಆದೇಶದ ಅನುಸರಣೆಯನ್ನು ಪರಿಶೀಲಿಸಲು ಮುಂದಿನ ವಿಚಾರಣೆಯನ್ನು ನಿಗದಿಪಡಿಸಲಾಗಿದೆ.",
      "The court has ordered the husband (respondent) to pay an interim monthly maintenance of ₹10,000 to the wife (petitioner) starting January 1, 2026. This money must be deposited directly into her bank account by the 5th of every month to cover living expenses while the case continues. The next court hearing is set for March 15, 2026.": "ಜನವರಿ 1, 2026 ರಿಂದ ಪತ್ನಿಗೆ (ಅರ್ಜಿದಾರರು) ತಿಂಗಳಿಗೆ ₹10,000 ಮಧ್ಯಂತರ ಜೀವನಾಂಶವನ್ನು ನೀಡುವಂತೆ ಕೋರ್ಟ್ ಪತಿಗೆ (ಪ್ರತಿವಾದಿ) ಆದೇಶಿಸಿದೆ. ಈ ಹಣವನ್ನು ಪ್ರತಿ ತಿಂಗಳ 5 ನೇ ತಾರೀಖಿನೊಳಗೆ ಅವರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮಾ ಮಾಡಬೇಕು. ಮುಂದಿನ ವಿಚಾರಣೆ ಮಾರ್ಚ್ 15, 2026 ರಂದು ನಿಗದಿಯಾಗಿದೆ.",
      "The court has postponed today's hearing because the respondent's senior lawyer was unwell and could not attend. The case will next be heard on April 28, 2026 for questioning the main witness (PW-1). Any temporary stay or protection orders issued earlier remain active until that date.": "ವಕೀಲರ ಅನಾರೋಗ್ಯದ ಕಾರಣ ಇಂದಿನ ವಿಚಾರಣೆಯನ್ನು ಏಪ್ರಿಲ್ 28, 2026ಕ್ಕೆ ಮುಂದೂಡಲಾಗಿದೆ. ಸಾಕ್ಷಿ PW-1 ಪಾಟಿಸವಾಲು ನಡೆಯಲಿದೆ.",
      "The court has approved bail for the applicant (Rajesh Verma) under specific conditions. He will be released from custody once he submits a security deposit (surety) of ₹25,000. He must surrender his passport, report to the police station every Monday between 10 AM and 1 PM, and cannot contact any witnesses.": "ಅರ್ಜಿದಾರರಿಗೆ (ರಾಜೇಶ್ ವರ್ಮಾ) ಷರತ್ತುಬದ್ಧ ಜಾಮೀನು ಮಂಜೂರಾಗಿದೆ. ₹25,000 ಶ್ಯೂರಿಟಿ ಸಲ್ಲಿಸಿದ ನಂತರ ಬಿಡುಗಡೆಯಾಗಲಿದ್ದಾರೆ. 48 ಗಂಟೆಗಳಲ್ಲಿ ಪಾಸ್‌ಪೋರ್ಟ್ ಒಪ್ಪಿಸಬೇಕು."
    },
    bn: {
      "The court has directed the respondent to pay an interim monthly maintenance amount of ₹10,000 to the petitioner starting from January 1, 2026. This amount must be deposited in the petitioner's bank account by the 5th of every month. The next hearing is scheduled to review the compliance of this ex parte order.": "আদালত উত্তরদাতাকে ১ জানুয়ারী ২০২৬ থেকে আবেদনকারীকে ₹১০,০০০ অন্তর্বর্তীকালীন মাসিক খোরপোশ প্রদানের নির্দেশ দিয়েছে। প্রতি মাসের ৫ তারিখের মধ্যে আবেদনকারীর ব্যাঙ্ক অ্যাকাউন্টে এই অর্থ জমা করতে হবে। এই একতরফা আদেশের সম্মতি পর্যালোচনার জন্য পরবর্তী শুনানি নির্ধারিত হয়েছে।",
      "The court has ordered the husband (respondent) to pay an interim monthly maintenance of ₹10,000 to the wife (petitioner) starting January 1, 2026. This money must be deposited directly into her bank account by the 5th of every month to cover living expenses while the case continues. The next court hearing is set for March 15, 2026.": "আদালত স্বামীকে (উত্তরদাতা) ১ জানুয়ারী ২০২৬ থেকে স্ত্রীকে (আবেদনকারী) প্রতি মাসে ₹১০,০০০ অন্তর্বর্তীকালীন খোরপোশ প্রদানের নির্দেশ দিয়েছেন। প্রতি মাসের ৫ তারিখের মধ্যে এই অর্থ সরাসরি তাঁর ব্যাঙ্ক অ্যাকাউন্টে জমা করতে হবে। পরবর্তী শুনানি ১৫ মার্চ ২০২৬ নির্ধারণ করা হয়েছে।",
      "The court has postponed today's hearing because the respondent's senior lawyer was unwell and could not attend. The case will next be heard on April 28, 2026 for questioning the main witness (PW-1). Any temporary stay or protection orders issued earlier remain active until that date.": "আইনজীবীর অসুস্থতার কারণে আজকের শুনানি ২৮ এপ্রিল ২০২৬ পর্যন্ত মুলতবি করা হয়েছে। সাক্ষী PW-1 এর জেরা করা হবে।",
      "The court has approved bail for the applicant (Rajesh Verma) under specific conditions. He will be released from custody once he submits a security deposit (surety) of ₹25,000. He must surrender his passport, report to the police station every Monday between 10 AM and 1 PM, and cannot contact any witnesses.": "আবেদনকারীকে (রাজেশ ভার্মা) নির্দিষ্ট শর্তে জামিন দেওয়া হয়েছে। ₹২৫,০০০ জামানত জমার পর তিনি মুক্তি পাবেন। ৪৮ ঘণ্টার মধ্যে পাসপোর্ট জমা দিতে হবে।"
    },
    ml: {
      "The court has directed the respondent to pay an interim monthly maintenance amount of ₹10,000 to the petitioner starting from January 1, 2026. This amount must be deposited in the petitioner's bank account by the 5th of every month. The next hearing is scheduled to review the compliance of this ex parte order.": "2026 ജനുവരി 1 മുതൽ ഹർജിക്കാരിക്ക് പ്രതിമാസം ₹10,000 ഇടക്കാല ജീവനാംശമായി നൽകാൻ എതിർകക്ഷിയോട് കോടതി ഉത്തരവിട്ടു. എല്ലാ മാസവും 5-ാം തീയതിക്കകം ഈ തുക ഹർജിക്കാരിയുടെ ബാങ്ക് അക്കൗണ്ടിൽ നിക്ഷേപിക്കേണ്ടതാണ്. ഈ ഉത്തരവ് പാലിക്കുന്നുണ്ടോ എന്ന് പരിശോധിക്കാൻ അടുത്ത വിചാരണ നിശ്ചയിച്ചിട്ടുണ്ട്.",
      "The court has ordered the husband (respondent) to pay an interim monthly maintenance of ₹10,000 to the wife (petitioner) starting January 1, 2026. This money must be deposited directly into her bank account by the 5th of every month to cover living expenses while the case continues. The next court hearing is set for March 15, 2026.": "2026 ജനുവരി 1 മുതൽ ഭാര്യക്ക് (ഹർജിക്കാരി) പ്രതിമാസം ₹10,000 ഇടക്കാല ജീവനാംശമായി നൽകാൻ ഭർത്താവിനോട് (എതിർകക്ഷി) കോടതി ഉത്തരവിട്ടു. കേസ് നടക്കുന്ന സമയത്ത് ജീവിതച്ചെലവിനായി ഈ തുക എല്ലാ മാസവും 5-ാം തീയതിക്കകം അവരുടെ ബാങ്ക് അക്കൗണ്ടിൽ നൽകണം. അടുത്ത വിചാരണ 2026 മാർച്ച് 15-ന് നടക്കും.",
      "The court has postponed today's hearing because the respondent's senior lawyer was unwell and could not attend. The case will next be heard on April 28, 2026 for questioning the main witness (PW-1). Any temporary stay or protection orders issued earlier remain active until that date.": "എതിർകക്ഷിയുടെ സീനിയർ അഭിഭാഷകന് സുഖമില്ലാത്തതിനാൽ ഇന്നത്തെ വിചാരണ കോടതി മാറ്റിവെച്ചു. പ്രധാന സാക്ഷിയെ (PW-1) വിസ്തരിക്കുന്നതിനായി കേസ് അടുത്തതായി 2026 ഏപ്രിൽ 28-ന് പരിഗണിക്കും. നേരത്തെ നൽകിയിട്ടുള്ള ഇടക്കാല ഉത്തരവുകൾ അന്നുവരെ നിലനിൽക്കും.",
      "The court has approved bail for the applicant (Rajesh Verma) under specific conditions. He will be released from custody once he submits a security deposit (surety) of ₹25,000. He must surrender his passport, report to the police station every Monday between 10 AM and 1 PM, and cannot contact any witnesses.": "വ്യവസ്ഥകളോടെ അപേക്ഷകന് (രാജേഷ് വർമ്മ) കോടതി ജാമ്യം അനുവദിച്ചു. ₹25,000 ജാമ്യതുക സമർപ്പിച്ചാൽ കസ്റ്റഡിയിൽ നിന്ന് വിട്ടയക്കും. പാസ്‌പോർട്ട് ഹാജരാക്കണം, എല്ലാ തിങ്കളാഴ്ചയും രാവിലെ 10 നും 1 നും ഇടയിൽ പോലീസ് സ്റ്റേഷനിൽ ഹാജരാകണം, സാക്ഷികളെ സ്വാധീനിക്കാൻ പാടില്ല."
    }
  };

  const dict = FALLBACK_TRANSLATIONS[targetLang];
  if (dict) {
    const cleanText = text.trim();
    if (dict[cleanText]) {
      return res.json({ translatedText: dict[cleanText] });
    }
    const cleanAlpha = cleanText.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]/g, '');
    for (const [k, v] of Object.entries(dict)) {
      if (k.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]/g, '') === cleanAlpha) {
        return res.json({ translatedText: v });
      }
    }
  }

  res.json({ translatedText: text });
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

// 7.1 PUT /api/admin/examples/:id/update — Re-run Gemini on new order text, update case
app.put('/api/admin/examples/:id/update', async (req, res) => {
  const { id } = req.params;
  const { newOrderText } = req.body;

  if (!newOrderText || typeof newOrderText !== 'string' || !newOrderText.trim()) {
    return res.status(400).json({ error: 'New order text is required.' });
  }

  let examples = getExamplesFromDisk();
  const exIndex = examples.findIndex(ex => ex.id === id);
  if (exIndex === -1) {
    return res.status(404).json({ error: 'Example not found.' });
  }

  const example = examples[exIndex];
  const oldHearingDate = example.keyFacts?.nextHearingDate || null;
  const oldStage = example.keyFacts?.stage || null;
  const oldTodos = example.whatYouNeedToDo || [];

  // Try to call Gemini to re-explain the new order text
  let geminiResult = null;
  if (GEMINI_API_KEY) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
      const userPrompt = `Please analyze the following court order text and provide the structured explanation JSON according to the schema:\n\nCase Number: ${example.keyFacts?.cnrNumber || 'N/A'}\n\nCourt Order Text:\n"${newOrderText.trim()}"`;
      
      const response = await axios.post(
        geminiUrl,
        {
          systemInstruction: { parts: [{ text: EXPLAIN_SYSTEM_PROMPT }] },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.2 }
        },
        { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
      );

      const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (responseText) {
        geminiResult = JSON.parse(responseText);
      }
    } catch (err) {
      console.error('Gemini re-explain failed:', err.message);
    }
  }

  // Update the example with new data
  example.rawOrderText = newOrderText.trim();

  if (geminiResult) {
    // Update keyFacts
    if (geminiResult.keyFacts) {
      example.keyFacts = {
        ...example.keyFacts,
        nextHearingDate: geminiResult.keyFacts.nextHearingDate || example.keyFacts?.nextHearingDate,
        stage: geminiResult.keyFacts.stage || example.keyFacts?.stage,
        parties: geminiResult.keyFacts.parties || example.keyFacts?.parties,
      };
    }

    // Update plainSummary
    if (geminiResult.whatHappened) {
      if (typeof example.plainSummary === 'object') {
        example.plainSummary.en = geminiResult.whatHappened;
      } else {
        example.plainSummary = { en: geminiResult.whatHappened };
      }
    }

    // Update whatYouNeedToDo
    if (geminiResult.whatYouNeedToDo) {
      example.whatYouNeedToDo = geminiResult.whatYouNeedToDo;
    }

    // Update whereThisStands
    if (geminiResult.whereThisStands) {
      example.whereThisStands = geminiResult.whereThisStands;
    }

    // Update clauses
    if (geminiResult.clauses && geminiResult.clauses.length > 0) {
      example.clauses = { en: geminiResult.clauses };
    }

    // Update keyDates
    if (geminiResult.keyDates) {
      example.keyDates = geminiResult.keyDates;
    }

    // changedFromPrevious
    const changes = [];
    const newHearingDate = example.keyFacts?.nextHearingDate;
    const newStage = example.keyFacts?.stage;

    if (oldHearingDate !== newHearingDate) {
      changes.push(`Next hearing date changed from ${oldHearingDate || 'none'} to ${newHearingDate || 'none'}.`);
    }
    if (oldStage !== newStage) {
      changes.push(`Case stage changed from "${oldStage || 'none'}" to "${newStage || 'none'}".`);
    }
    changes.push('Order text updated and re-analyzed.');

    example.changedFromPrevious = { changed: true, changes };
  } else {
    // Gemini failed — just update the raw text
    example.changedFromPrevious = {
      changed: true,
      changes: ['Order text updated (Gemini re-analysis unavailable).']
    };
  }

  examples[exIndex] = example;
  saveExamplesToDisk(examples);

  // Cross-update reminders.json if hearing date changed
  const newHearingDate = example.keyFacts?.nextHearingDate;
  let reminderUpdated = false;
  if (oldHearingDate !== newHearingDate && newHearingDate) {
    const reminders = getRemindersFromDisk();
    const cnr = example.keyFacts?.cnrNumber;
    for (const reminder of reminders) {
      if (reminder.cnrNumber === cnr) {
        reminder.hearingDate = newHearingDate;
        reminderUpdated = true;
      }
    }
    if (reminderUpdated) {
      saveRemindersToDisk(reminders);
    }
  }

  console.log(`Updated example "${example.title}" (id: ${id})`);

  res.json({
    success: true,
    example,
    diff: {
      oldHearingDate,
      newHearingDate: example.keyFacts?.nextHearingDate || null,
      oldStage,
      newStage: example.keyFacts?.stage || null,
      hearingDateChanged: oldHearingDate !== (example.keyFacts?.nextHearingDate || null),
      stageChanged: oldStage !== (example.keyFacts?.stage || null),
      reminderUpdated,
      geminiUsed: !!geminiResult,
    }
  });
});

// 8. POST /api/chat
const CHAT_SYSTEM_PROMPT = `You are a rights-awareness assistant for common citizens in India who may know nothing about the legal system. Your job is to help people understand their basic legal rights, what different legal terms mean, and what general actions or procedures typically happen in situations they describe (like an FIR being filed against them, being called for a police inquiry, receiving a legal notice, etc).

Rules you must always follow:
- Never give specific legal advice about what someone should do in their exact case
- Never predict the outcome of any legal situation
- Never tell someone to take or not take a specific legal action
- Always speak in plain, simple, non-intimidating language, avoid legal jargon unless you immediately explain it
- If someone describes a specific personal legal situation, give general rights information only, then clearly recommend they consult a lawyer or a legal aid service for their specific case
- If asked about a case number or case status, explain that you cannot look up live case data, and direct them to the eCourts portal or the order explainer feature instead
- Always mention free legal aid resources when relevant, like NALSA's helpline number 15100
- Always explicitly mention the source of your information in the text (e.g. "According to the Indian Penal Code...").
- CRITICAL: DO NOT use markdown formatting like ** or *. Write entirely in plain text. If you want to highlight a major part, use ALL CAPS instead of bolding.

RESPONSE STRUCTURE FORMAT:
Whenever the question involves a legal concept, right, or procedure, you MUST respond using this exact structure (NO asterisks):

WHAT THIS MEANS:
[Simple one or two line explanation in plain language, stating the source of information.]

RELEVANT LAW:
[If applicable, mention the specific Act and Section number, for example "Section 41, Code of Criminal Procedure" or "Section 125, Hindu Marriage Act". If unsure of the exact section, say so honestly rather than guessing one. Never invent a section number or act name if not confident it's correct, say "I'm not certain of the exact section, please confirm with a lawyer" instead of guessing.]

WHAT YOU CAN DO:
[2 to 3 short bullet points of general possible actions, not specific advice for their exact case. Use standard dashes (-) for bullets, no asterisks.]

NOTE:
[One line reminder to consult a lawyer or call NALSA helpline 15100 for their specific situation.]

If the question is casual or doesn't need a legal citation, skip the "RELEVANT LAW" section entirely and just answer simply in 1 to 2 lines. Do not force structure where it's not needed.
`;

const getOfflineRightsResponse = (message) => {
  const lower = message.toLowerCase();
  
  if (lower.includes('fir') || lower.includes('police') || lower.includes('arrest') || lower.includes('inquiry')) {
    return `WHAT THIS MEANS:
When police register a First Information Report (FIR) or call someone for inquiry, citizens have specific statutory safeguards under Indian law. According to the Code of Criminal Procedure (CrPC), police cannot arrest someone without following proper procedures.

RELEVANT LAW:
Section 41A, Code of Criminal Procedure, 1973 (and Section 35, Bharatiya Nagarik Suraksha Sanhita).

WHAT YOU CAN DO:
- Request a formal written notice under Section 41A if called for inquiry.
- Ask to speak with a lawyer before answering questions during questioning.
- Contact family or legal aid immediately if taken into custody.

NOTE:
Consult a qualified advocate or call NALSA Helpline 15100 for your specific situation.`;
  }

  if (lower.includes('bail') || lower.includes('jail') || lower.includes('custody')) {
    return `WHAT THIS MEANS:
Bail is a statutory right in bailable offences and a judicial discretion in non-bailable offences. It ensures a person can defend themselves while remaining free before trial conviction. According to Indian criminal jurisprudence, bail is the rule and jail is the exception.

RELEVANT LAW:
Section 436 and Section 437, Code of Criminal Procedure, 1973.

WHAT YOU CAN DO:
- Apply for bailable bail at the police station if the offence is bailable.
- Apply for interim bail or anticipatory bail before the Magistrate or Sessions Court.
- Provide a solvent surety or personal bond as directed by the judge.

NOTE:
Consult a qualified advocate or call NALSA Helpline 15100 for your specific situation.`;
  }

  if (lower.includes('notice') || lower.includes('summons') || lower.includes('court order')) {
    return `WHAT THIS MEANS:
A legal notice or court summons is an official communication informing you of legal claims or ordering your appearance in court. Ignoring a summons can lead to ex-parte orders passed against you.

RELEVANT LAW:
Order V, Code of Civil Procedure, 1908.

WHAT YOU CAN DO:
- Note the exact date and court room mentioned on the summons copy.
- Prepare your written reply/statement with a lawyer before the hearing date.
- File an appearance through an advocate or appear in person on the scheduled date.

NOTE:
Consult a qualified advocate or call NALSA Helpline 15100 for your specific situation.`;
  }

  return `WHAT THIS MEANS:
Adalat Companion helps Indian citizens understand basic statutory legal rights and court procedures in simple, non-intimidating plain language according to the Constitution of India and national statutes.

WHAT YOU CAN DO:
- Ask specific questions about legal terms, FIRs, bail, court summons, or maintenance.
- Upload court order documents on the main portal to view clause-by-clause explanations.
- Contact your District Legal Services Authority (DLSA) for free legal aid if eligible.

NOTE:
Consult a qualified advocate or call NALSA Helpline 15100 for immediate legal assistance.`;
};

app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
    
    // Format history into Gemini's format: array of { role: "user" | "model", parts: [{ text: "..." }] }
    const contents = [];
    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }
    
    // Add the new user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await axios.post(
      geminiUrl,
      {
        systemInstruction: {
          parts: [{ text: CHAT_SYSTEM_PROMPT }]
        },
        contents: contents,
        generationConfig: {
          temperature: 0.3
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

    res.json({ text: responseText });
  } catch (error) {
    console.error('Chat API note:', error.response?.data?.error?.message || error.message);
    // Instant structured statutory response if API rate limited or offline
    const fallbackText = getOfflineRightsResponse(message);
    res.json({ text: fallbackText });
  }
});

// --- EMAIL REMINDERS LOGIC ---

const REMINDERS_FILE_PATH = path.join(__dirname, 'data', 'reminders.json');

const getRemindersFromDisk = () => {
  if (fs.existsSync(REMINDERS_FILE_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(REMINDERS_FILE_PATH, 'utf8'));
    } catch (e) {
      console.error('Failed to parse reminders.json', e);
    }
  }
  return [];
};

const saveRemindersToDisk = (reminders) => {
  const dir = path.dirname(REMINDERS_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(REMINDERS_FILE_PATH, JSON.stringify(reminders, null, 2), 'utf8');
};

const getEmailTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.warn('GMAIL_USER or GMAIL_PASS is missing in .env');
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });
};

app.post('/api/reminders/add', (req, res) => {
  const { email, cnrNumber, hearingDate, caseTitle } = req.body;
  if (!email || !cnrNumber || !hearingDate) {
    return res.status(400).json({ error: 'Email, CNR number, and hearing date are required.' });
  }

  const reminders = getRemindersFromDisk();
  // Check if reminder already exists
  const exists = reminders.find(r => r.email === email && r.cnrNumber === cnrNumber && r.hearingDate === hearingDate);
  if (exists) {
    return res.json({ success: true, message: 'Reminder already exists.' });
  }

  reminders.push({
    id: Date.now().toString(),
    email,
    cnrNumber,
    hearingDate,
    caseTitle: caseTitle || 'Unknown Case',
    createdAt: new Date().toISOString()
  });
  saveRemindersToDisk(reminders);
  res.json({ success: true, message: 'Reminder saved successfully.' });
});

app.post('/api/reminders/send-test', async (req, res) => {
  const { email, cnrNumber, hearingDate, caseTitle } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required for sending test.' });
  }

  const transporter = getEmailTransporter();
  if (!transporter) {
    return res.status(500).json({ error: 'Email transporter not configured. Check GMAIL_USER/PASS in .env.' });
  }

  const mailOptions = {
    from: `"Adalat Companion" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Test Reminder: Upcoming Court Hearing for ${cnrNumber}`,
    html: `
      <h2>Upcoming Court Hearing Reminder</h2>
      <p>This is a test reminder from Adalat Companion.</p>
      <ul>
        <li><strong>Case Title:</strong> ${caseTitle || 'N/A'}</li>
        <li><strong>CNR Number:</strong> ${cnrNumber}</li>
        <li><strong>Next Hearing Date:</strong> ${hearingDate}</li>
      </ul>
      <p><strong>What to expect:</strong> Please make sure to be present at the court on time and bring any necessary documents.</p>
      <hr />
      <p><em>Disclaimer: This email is automatically generated and does not constitute legal advice. Please consult your lawyer for legal matters.</em></p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Failed to send test email:', error);
    res.status(500).json({ error: 'Failed to send test email.', details: error.message });
  }
});

app.post('/api/reminders/check-now', async (req, res) => {
  const transporter = getEmailTransporter();
  if (!transporter) {
    return res.status(500).json({ error: 'Email transporter not configured.' });
  }

  const reminders = getRemindersFromDisk();
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Reset time to start of day

  let sentCount = 0;
  const emailsSentTo = [];

  for (const reminder of reminders) {
    // Parse DD-MM-YYYY or similar
    // We assume YYYY-MM-DD or DD-MM-YYYY.
    let hDate;
    if (reminder.hearingDate.match(/^\d{2}-\d{2}-\d{4}$/)) {
      const parts = reminder.hearingDate.split('-');
      hDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    } else {
      hDate = new Date(reminder.hearingDate);
    }
    
    if (isNaN(hDate)) continue;

    // Calculate diff in days
    const diffTime = hDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // If hearing is within 2 days (inclusive of today)
    if (diffDays >= 0 && diffDays <= 2) {
      const mailOptions = {
        from: `"Adalat Companion" <${process.env.GMAIL_USER}>`,
        to: reminder.email,
        subject: `Reminder: Upcoming Court Hearing in ${diffDays} day(s)`,
        html: `
          <h2>Upcoming Court Hearing Reminder</h2>
          <p>This is a reminder that you have a court hearing coming up in ${diffDays} day(s).</p>
          <ul>
            <li><strong>Case Title:</strong> ${reminder.caseTitle}</li>
            <li><strong>CNR Number:</strong> ${reminder.cnrNumber}</li>
            <li><strong>Next Hearing Date:</strong> ${reminder.hearingDate}</li>
          </ul>
          <p><strong>What to expect:</strong> Please ensure you have your documents ready and arrive at the court premises early.</p>
          <hr />
          <p><em>Disclaimer: This is an automated notification, not legal advice. Always consult your lawyer for legal guidance.</em></p>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        sentCount++;
        emailsSentTo.push(reminder.email);
      } catch (e) {
        console.error(`Failed to send reminder to ${reminder.email}: `, e);
      }
    }
  }

  res.json({ success: true, sentCount, emailsSentTo });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

