const app = require('../backend/server.js');

module.exports = (req, res) => {
  // Ensure req.url is normalized for Express route matching on Vercel serverless
  if (req.url) {
    if (!req.url.startsWith('/api')) {
      req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
    }
  }
  return app(req, res);
};
