'use strict';

// package requires
var fs = require('fs'),
  path = require('path'),
  https = require('https'),
  express = require('express'),
  mongoose = require('mongoose'),
  _ = require('lodash'),
  string = require('string');

// module requires
var endpoint = require('./endpoint'),
  middleware = require('./middleware'),
  types = require('./types');


var uberman = function (configs) {
  var app = express();

  // apply configs here
  configs = configs || {};
  app.configs = {};
  app.configs.env = configs.env || 'dev';
  app.configs.version = configs.version || 0;
  app.configs.root = configs.root || path.join('/api', 'v{version}'.replace('{version}', app.configs.version));
  app.configs.name = configs.name || 'app';
  app.configs.ssl = {
    key: fs.readFileSync(configs.keyPath),
    cert: fs.readFileSync(configs.certPath)
  };
  app.configs.limiter = app.configs.limiter || {};

  // setup middleware
  middleware._setupLogger({
    // logger config goes here
  });

  // apply middleware
  app.use(middleware.limiter(app.configs.limiter));
  app.use(middleware.timestamper);
  app.use(middleware.uuidAssign);
  app.use(middleware.urlencodedParser);
  app.use(middleware.jsonParser);
  app.use(middleware.logger);

  // init endpoint object
  app.endpoints = {};

  // connect to mongoDB
  mongoose.connect((app.configs.mongoURI || ('mongodb://localhost/' + (app.configs.name || '')))2, app.configs.mongo);

  return {
    listen: function (port) {
      port = port || 443;

      console.log('listening on port {port}'.replace('{port}', port));
      https.createServer(app.configs.ssl, app)
        .listen(port);
    },
    addEndpoint: function (name, schema, options) {
      options = options || {};
      var endpointObj = endpoint.makeEndpoint(name, schema);
      app.use(options.route || path.join(app.configs.root, endpointObj.routeName), endpointObj.router);
      app.endpoints[name] = endpointObj;
    }
  };
};

uberman.Types = types;

module.exports = uberman;