const app = require('../backend/server.js');

module.exports = (req, res) => {
  req.url = '/api/examples';
  return app(req, res);
};
