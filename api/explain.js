const app = require('../backend/server.js');

module.exports = (req, res) => {
  req.url = '/api/explain';
  return app(req, res);
};
