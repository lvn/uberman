'use strict';

var morgan = require('morgan'),
  connectUuid = require('connect-uuid'),
  bodyParser = require('body-parser'),
  redis = require('redis'),
  epsilonDelta = require('epsilon-delta'),
  passport = require('passport');

var responses = require('./responses');

var middlewareLocals = {};

module.exports = {
  urlencodedParser: bodyParser.urlencoded(),
  jsonParser: bodyParser.json(),
  uuidAssign: connectUuid(),
  timestamper: function(req, res, next) {
    req.timestamp = new Date().toISOString();
    next();
  },
  _setupLogger: function (opts) {
    morgan.token('uuid', function (req) {
      return req.uuid;
    });
  },
  logger: morgan(':remote-addr - :remote-user [:date[clf]] ":uuid :method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'),
  limiter: function (opts) {
    return epsilonDelta(opts);
  },
};