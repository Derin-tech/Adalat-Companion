const app = require('../backend/server.js');

module.exports = (req, res) => {
  req.url = '/api/upload';
  return app(req, res);
};
