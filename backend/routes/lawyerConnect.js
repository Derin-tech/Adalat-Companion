const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const REQUESTS_FILE = path.join(__dirname, '..', 'data', 'lawyer-requests.json');
const LAWYERS_FILE = path.join(__dirname, '..', 'data', 'lawyers.json');

// Helper to read JSON
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
};

// Helper to write JSON
const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
};

// POST /requests - Submit a new lawyer request
router.post('/requests', (req, res) => {
  const { category, description, district, language, urgency, contactInfo } = req.body;
  
  if (!category || !description || !district || !language || !contactInfo) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const requests = readData(REQUESTS_FILE);
  const newRequest = {
    id: uuidv4(),
    category,
    description,
    district,
    language,
    urgency,
    contactInfo,
    status: 'pending',
    createdAt: new Date().toISOString(),
    notifiedLawyers: [],
    matchedLawyer: null
  };
  
  requests.push(newRequest);
  writeData(REQUESTS_FILE, requests);
  
  // Trigger matching logic asynchronously
  setTimeout(() => matchLawyers(newRequest.id), 1000);

  res.status(201).json({ id: newRequest.id, status: newRequest.status });
});

// GET /requests/:id - Get request status
router.get('/requests/:id', (req, res) => {
  const requests = readData(REQUESTS_FILE);
  const request = requests.find(r => r.id === req.params.id);
  
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }
  
  // Sanitize response: only include lawyer info if status is matched
  const responseData = {
    id: request.id,
    status: request.status,
    category: request.category,
    createdAt: request.createdAt,
    urgency: request.urgency
  };
  
  if (request.status === 'matched' && request.matchedLawyer) {
    responseData.matchedLawyer = request.matchedLawyer;
  }
  
  res.json(responseData);
});

// POST /lawyers/:lawyerId/respond - Lawyer accepts/declines a request
router.post('/lawyers/:lawyerId/respond', (req, res) => {
  const { requestId, action } = req.body; // action: 'accept' or 'decline'
  const lawyerId = req.params.lawyerId;
  
  if (!requestId || !action) {
    return res.status(400).json({ error: 'Missing requestId or action' });
  }
  
  const requests = readData(REQUESTS_FILE);
  const requestIndex = requests.findIndex(r => r.id === requestId);
  
  if (requestIndex === -1) {
    return res.status(404).json({ error: 'Request not found' });
  }
  
  const request = requests[requestIndex];
  
  if (request.status === 'matched') {
    return res.status(400).json({ error: 'Request already matched' });
  }
  
  if (action === 'accept') {
    const lawyers = readData(LAWYERS_FILE);
    const lawyer = lawyers.find(l => l.id === lawyerId);
    
    if (!lawyer) {
      return res.status(404).json({ error: 'Lawyer not found' });
    }
    
    requests[requestIndex].status = 'matched';
    requests[requestIndex].matchedLawyer = {
      id: lawyer.id,
      name: lawyer.name,
      contactInfo: lawyer.contactInfo
    };
    
    writeData(REQUESTS_FILE, requests);
    res.json({ message: 'Request accepted successfully' });
  } else if (action === 'decline') {
    // Logic for declining could go here, e.g., removing from notifiedLawyers and rematching
    res.json({ message: 'Request declined' });
  } else {
    res.status(400).json({ error: 'Invalid action' });
  }
});

// GET /lawyers - Public directory with permitted particulars
router.get('/lawyers', (req, res) => {
  const { location, practiceArea } = req.query;
  let lawyers = readData(LAWYERS_FILE);
  
  if (location) {
    lawyers = lawyers.filter(l => l.location.toLowerCase() === location.toLowerCase());
  }
  
  if (practiceArea) {
    lawyers = lawyers.filter(l => l.practiceAreas.some(pa => pa.toLowerCase() === practiceArea.toLowerCase()));
  }
  
  // Strict permitted particulars filtering (BCI Rule 36 amendment)
  const permittedLawyers = lawyers.map(l => ({
    id: l.id,
    name: l.name,
    address: l.address,
    phone: l.phone,
    email: l.email,
    enrolmentNumber: l.enrolmentNumber,
    enrolmentDate: l.enrolmentDate,
    stateBarCouncil: l.stateBarCouncil,
    barAssociation: l.barAssociation,
    qualifications: l.qualifications,
    practiceAreas: l.practiceAreas,
    location: l.location,
    photoUrl: l.photoUrl // Will be gated by frontend flag
  }));
  
  res.json(permittedLawyers);
});

// Private matching function
function matchLawyers(requestId) {
  const requests = readData(REQUESTS_FILE);
  const requestIndex = requests.findIndex(r => r.id === requestId);
  
  if (requestIndex === -1) return;
  
  const request = requests[requestIndex];
  const lawyers = readData(LAWYERS_FILE);
  
  // Filter active, verified lawyers by category, district, and language
  // Doing a fuzzy match: district/language might be exact or just overlapping.
  // We'll keep it simple: category must include request category.
  const matched = lawyers.filter(l => 
    l.active && 
    l.verified &&
    l.categories.includes(request.category)
  );
  
  // Take up to 3
  const selectedLawyers = matched.slice(0, 3);
  
  if (selectedLawyers.length > 0) {
    requests[requestIndex].status = 'matching';
    requests[requestIndex].notifiedLawyers = selectedLawyers.map(l => l.id);
    writeData(REQUESTS_FILE, requests);
    console.log(`Matched request ${requestId} to lawyers:`, requests[requestIndex].notifiedLawyers);
  } else {
    // If no lawyers matched, stay pending or set a special status, 
    // for now we'll just keep it pending but maybe log it.
    console.log(`No lawyers found for request ${requestId}`);
  }
}

module.exports = router;
