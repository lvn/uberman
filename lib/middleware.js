'use strict';

var morgan = require('morgan'),
  connectUuid = require('connect-uuid'),
  bodyParser = require('body-parser'),
  redis = require('redis'),
  epsilonDelta = require('epsilon-delta'),
  passport = require('passport');

var responses = require('./responses'),
  utils = require('./utils');

var middlewareLocals = {};

module.exports = {
  jsonParser: bodyParser.json(),
  uuidAssign: connectUuid(),
  timestamper: function(req, res, next) {
    req.timestamp = new Date().toISOString();
    next();
  },
  httpError: function (req, res, next) {
    (req.protocol == 'http') && responses.error(req, res, "HTTPS required", 403);
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
  idChecker: function (req, res, next) {
    ((!!req.params.id && !utils.validObjectId(req.params.id)) ?
      responses.error(req, res, 'Invalid ID', 400) :
      next());
  }
};