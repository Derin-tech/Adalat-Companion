const app = require('../backend/server.js');

module.exports = (req, res) => {
  req.url = '/api/translate';
  return app(req, res);
};
