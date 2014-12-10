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
  // alias to the JSON body parser.
  jsonParser: bodyParser.json(),
  // assigns a UUID to each request.
  uuidAssign: connectUuid(),
  // assigns a ISO-string timestamp to each request.
  timestamper: function(req, res, next) {
    req.timestamp = new Date().toISOString();
    next();
  },
  // checks for http. If HTTP, err with message,
  httpError: function (req, res, next) {
    (req.protocol == 'http') && responses.error(req, res, "HTTPS required", 403);
    next();
  },
  // sets up the Morgan logger:
  //  * Adds a UUID field to the logger.
  _setupLogger: function (opts) {
    morgan.token('uuid', function (req) {
      return req.uuid;
    });
  },
  // Morgan logger middleware.
  logger: morgan(':remote-addr - :remote-user [:date[clf]] ":uuid :method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'),
  // epsilon delta rate-limiter.
  limiter: function (opts) {
    return epsilonDelta(opts);
  },
  // if request has id field, check if id is a valid MongoDB ObjectId.
  idChecker: function (req, res, next) {
    ((!!req.params.id && !utils.validObjectId(req.params.id)) ?
      responses.error(req, res, 'Invalid ID', 400) :
      next());
  }
};