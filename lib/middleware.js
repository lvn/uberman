'use strict';

var morgan = require('morgan'),
  //connectAuth = require('connect-auth'),
  connectUuid = require('connect-uuid'),
  bodyParser = require('body-parser'),
  expressLimiter = require('express-limiter');

module.exports = {
  _setupLogger: function () {
    morgan.token('uuid', function (req) {
      return req.uuid;
    });
  },
  logger: morgan(':remote-addr - :remote-user [:date[clf]] ":uuid :method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'),
  limiter: function(app) {
    // TODO: set this up
  },
  urlencodedParser: bodyParser.urlencoded(),
  jsonParser: bodyParser.json(),
  uuidAssign: connectUuid(),
  rateLimiter: function(req, res, next) { next(); },
  //auth: connectAuth()
  timestamper: function(req, res, next) {
    console.log(req.body);
    req.timestamp = Date.now();
    next();
  }
};