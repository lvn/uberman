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
  types = require('./types'),
  auth = require('./auth');


function uberman (configs) {
  var app = express();

  // apply configs here
  configs = configs || {};
  app.configs = {};
  app.configs.host = configs.host || process.env.HOST || 'localhost';
  app.configs.port = configs.port || parseInt(process.env.PORT) || 443;
  app.configs.env = configs.env || process.env.ENV || 'dev';
  app.configs.version = configs.version || parseFloat(process.env.VERSION) || 0;
  app.configs.root = configs.root || process.env.API_ROOT || '/v{ver}'.replace('{ver}', app.configs.version);
  app.configs.name = configs.name || process.env.API_NAME || 'app';
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
  app.use(function attachConfigData (req, res, next) {
    // attach metadata to request.
    req.configs = app.configs;
    next();
  });

  // init endpoint object
  app.endpoints = {};

  // connect to mongoDB
  mongoose.connect((app.configs.mongoURI || ('mongodb://localhost/' + (app.configs.name || ''))), app.configs.mongo);

  // route a router/sub-app to the endpoint that also updates app.endpoints.
  var routeEndpoint = function routeEndpoint (name, middleware) {
    app.use(path.join(app.configs.root, endpointObj.route), endpoint);
    app.endpoints[name] = middleware;
  };

  var resource = function resource (name, schema, options) {
    console.log('Registering endpoint \'{name}\'...'.replace('{name}', name));
    if (app.endpoints[name]) {
      console.log('The endpoint \'{name}\' has already been registered, and cannot be added again.'.replace('{name}', name));
      return;
    }
    options = options || {};
    var endpointObj = endpoint.makeEndpoint(name, schema);
    var endpointRoute = path.join(app.configs.root, endpointObj.route);
    app.use(endpointRoute, endpointObj.router);
    app.endpoints[name] = endpointObj;
  };

  var listEndpoints = function listEndpoints (req, res) {
    res.bodyType = 'literal';

    var eps = {};
    Object.keys(app.endpoints).forEach(function (ep) {
      eps[app.endpoints[ep].name] = 'https://' + req.get('Host') +
        path.join(
          req.configs.root, 
          app.endpoints[ep].route
        );
    });
    res.body = eps;
    responses.serializeResponse(req, res);
  };

  var listen = function listen (port, host) {
    // catchall middleware
    app.use('*', listEndpoints);

    app.configs.port = port || app.configs.port;
    app.configs.host = host || app.configs.host;
    console.log('listening on port {port}'.replace('{port}', app.configs.port));

    https.createServer(app.configs.ssl, app)
      .listen(app.configs.port, app.configs.host);
  };

  return {
    listen: listen,
    resource: resource,
    listEndpoints: listEndpoints
  };
};

uberman.Types = types;

module.exports = uberman;