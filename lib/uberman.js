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
  middleware = require('./middleware');


var uberman = function (configs) {
  var app = express();

  // setup middleware
  middleware._setupLogger();
  //middleware._setupRateLimiter();

  // apply middleware
  app.use(middleware.timestamper);
  app.use(middleware.uuidAssign);
  app.use(middleware.urlencodedParser);
  app.use(middleware.jsonParser);
  app.use(middleware.logger);

  // apply options here
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

  // init endpoint object
  app.endpoints = {};

  // connect to mongoDB
  mongoose.connect((app.configs.mongoURI || ('mongodb://localhost/' + (app.configs.name || ''))), app.configs.mongo);

  return {
    listen: function (port) {
      port = port || 443;

      console.log('listening on port {port}'.replace('{port}', port));
      https.createServer(app.configs.ssl, app)
        .listen(port);
    },
    addEndpoint: function (name, schema, options) {
      options = options || {};
      var endpointObj = endpoint.create.call(app, name, schema);
      app.endpoints[endpointObj.name] = endpointObj;
    }
  };
};

uberman.Types = _.assign(mongoose.Schema.Types,{
  foreignKey: function (resource) {
    
  }
});

module.exports = uberman;