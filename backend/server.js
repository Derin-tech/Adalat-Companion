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

// 3. GET /api/lookup/:cnrNumber
app.get('/api/lookup/:cnrNumber', async (req, res) => {
  try {
    // Assuming we have a scraper/lookup service in the future
    throw new Error('Not implemented yet');
  } catch (error) {
    console.error('Lookup failed, falling back to mock data:', error.message);
    const mockData = getMockData('lookup1.json');
    if (mockData) {
      res.json(mockData);
    } else {
      res.status(500).json({ error: 'Mock data not found' });
    }
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
