const app = require('../backend/server.js');

module.exports = (req, res) => {
  req.url = '/api/chat';
  return app(req, res);
};
