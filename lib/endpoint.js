'use strict';

// package requires
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  express = require('express'),
  path = require('path'),
  S = require('string'),
  bodyParser = require('body-parser');

// module requires
var middleware = require('./middleware'), 
  sch = require('./schema'),
  responses = require('./responses'),
  utils = require('./utils');

function makeResourceName (name) {
  return S(name).camelize().s;
};

function makeRouteName (name) {
  return S(name).dasherize().s;
};  

function makeEndpoint (name, schema, options) {
  var options = options || {},
  endpoint = {};

  endpoint.resourceName = makeResourceName(name);
  endpoint.route = options.route || makeRouteName(name);

  endpoint.name = name;
  endpoint.schema = schema;
  endpoint.resource = mongoose.model(endpoint.resourceName, sch.toMongooseSchema(schema));
  endpoint.router = express.Router();

  function query (req, res, next) {
    endpoint.resource
      .find(req.query)
      .exec(function (err, coll) {
        res.stat = err ? 404 : 200;
        res.body = coll.map(function (r) {
          return r.toObject();
        });
        responses.serializeResponse(req, res);
      });
  };

  function create (req, res, next) {
    endpoint.resource
      .create(req.body, function (err, doc) {
        res.stat = err ? 500 : 201;
        res.body = doc.toObject();
        responses.serializeResponse(req, res);
      });
  };

  function read (req, res, next) {
    endpoint.resource
      .findById(req.params.id, function (err, doc) {
        res.stat = err ? 500 : (doc ? 200 : 404);
        res.body = doc.toObject();
        responses.serializeResponse(req, res);
      });
  };

  function replace (req, res, next) {
    var updateObj = req.body;
    updateObj._id = req.params.id;

    endpoint.resource
      .findByIdAndRemove(req.params.id, function(err, doc) {
        if (err) {
          res.stat = 500;
        }
        else {
          endpoint.resource
            .create(updateObj, function (err, doc) {
              res.stat = err ? 500 : 201;
              res.body = doc.toObject();
            });
        }
        responses.serializeResponse(req, res);
      });
  };

  function upsert (req, res, next) {
    var updateObj = req.body;
    updateObj._id = req.params.id;
    endpoint.resource
      .findByIdAndUpdate(req.params.id, updateObj, { upsert: true },
       function (err, doc) {
        res.stat = err ? 304 : 200;
        res.body = doc.toObject();
        responses.serializeResponse(req, res);
      });
  };

  function destroy (req, res, next) {
    endpoint.resource
      .findByIdAndRemove(req.params.id, function (err, doc) {
        res.body = doc.toObject();
        res.stat = err ? 403 : 410;
        responses.serializeResponse(req, res);
      });
  };

  // mount route-specific middleware
  endpoint.router.use('/:id', middleware.idChecker)
  endpoint.router.use(function addResponseMetadata (req, res, next) {
    res.schema = endpoint.schema;
    next();
  });

  // mount endpoint operations
  endpoint.router.get('/', query);
  endpoint.router.post('/', create);
  endpoint.router.get('/:id', read);
  endpoint.router.put('/:id', replace);
  endpoint.router.patch('/:id', upsert);
  endpoint.router.delete('/:id', destroy);

  return endpoint;
};

module.exports = {
  makeEndpoint: makeEndpoint,
  makeResourceName: makeResourceName,
  makeRouteName: makeRouteName
};