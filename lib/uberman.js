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
  responses = require('./responses'),
  middleware = require('./middleware'),
  types = require('./types');


function uberman (configs) {
  var app = express();

  // apply configs here
  configs = configs || {};
  app.configs = {};
  app.configs.host = configs.host || '0.0.0.0';
  app.configs.port = configs.port || 443;
  app.configs.env = configs.env || 'dev';
  app.configs.version = configs.version || 0;
  app.configs.root = configs.root || path.join('/api', 'v{version}'.replace('{version}', app.configs.version));
  app.configs.name = configs.name || 'app';
  app.configs.ssl = {
    key: fs.readFileSync(configs.keyPath),
    cert: fs.readFileSync(configs.certPath)
  };
  app.configs.limiter = configs.limiter || {};
  app.configs.logger = configs.logger || {};

  // setup middleware
  middleware._setupLogger(app.configs.logger);

  // apply middleware
  app.use(middleware.timestamper);
  app.use(middleware.uuidAssign);
  app.use(middleware.limiter(app.configs.limiter));
  app.use(middleware.jsonParser);
  app.use(middleware.logger);

  // init endpoint object
  app.endpoints = {};

  // connect to mongoDB
  mongoose.connect((app.configs.mongoURI || ('mongodb://localhost/' + (app.configs.name || ''))), app.configs.mongo);


  function addEndpoint (name, schema, options) {
    options = options || {};
    var endpointObj = endpoint.makeEndpoint(name, schema);
    var endpointRoute = path.join(app.configs.root, endpointObj.route);
    app.use(endpointRoute, endpointObj.router);
    app.endpoints[name] = endpointObj;
  };

  function listEndpoints () {
    var eps = {};
    Object.keys(app.endpoints).forEach(function (ep) {
      eps[app.endpoints[ep].name] = path.join([app.configs.host, app.configs.port].join(':'), 
                                      app.configs.root, app.endpoints[ep].route);
    });
    return eps;
  };


  function listen (port) {

    // catchall middleware
    app.use('/*', function (req, res) {
      responses.json(req, res, listEndpoints());
    });

    port = port || app.configs.port || 443;
    console.log('listening on port {port}'.replace('{port}', port));
    https.createServer(app.configs.ssl, app)
      .listen(port, app.configs.host);
  };

  return {
    listen: listen,
    addEndpoint: addEndpoint,
    listEndpoints: listEndpoints
  };
};

uberman.Types = types;

module.exports = uberman;