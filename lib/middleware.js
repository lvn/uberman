'use strict';

var morgan = require('morgan'),
    //connectAuth = require('connect-auth'),
    connectUuid = require('connect-uuid'),
    bodyParser = require('body-parser');

module.exports = {
    _setupLogger: function () {
        morgan.token('uuid', function (req) {
            return req.uuid;
        });
    },
    logger: morgan(':remote-addr - :remote-user [:date[clf]] ":uuid :method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'),
    jsonParser: bodyParser.json({
        inflate: false
    }),
    uuidAssign: connectUuid(),
    rateLimiter: function(req, res, next){next();},
    //auth: connectAuth()
};