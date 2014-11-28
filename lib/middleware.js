'use strict';

var morgan = require('morgan'),
    //connectAuth = require('connect-auth'),
    connectUuid = require('connect-uuid'),
    bodyParser = require('body-parser');

module.exports = {
    logger: morgan('dev'),
    jsonParser: bodyParser.json({
        inflate: false
    }),
    uuidAssign: connectUuid(),
    rateLimiter: function(req, res, next){next();},
    //auth: connectAuth()
};