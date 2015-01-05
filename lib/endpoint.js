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

  var query = function query (req, res, next) {
    var paginationParams 
    endpoint.resource
      .find(req.query)
      .limit(50)
      .exec(function (err, coll) {
        res.stat = err ? 404 : 200;
        res.body = coll.map(function (r) {
          return r.toObject();
        });
        responses.serializeResponse(req, res);
      });
  };

  var create = function create (req, res, next) {
    endpoint.resource
      .create(req.body, function (err, doc) {
        res.stat = err ? 500 : 201;
        doc && (res.body = doc.toObject());
        responses.serializeResponse(req, res);
      });
  };

  var read = function read (req, res, next) {
    endpoint.resource
      .findById(req.params.id, function (err, doc) {
        res.stat = err ? 500 : (doc ? 200 : 404);
        doc && (res.body = doc.toObject());
        responses.serializeResponse(req, res);
      });
  };

  var replace = function replace (req, res, next) {
    var updateObj = req.body;
    updateObj._id = req.params.id;

    endpoint.resource
      .findByIdAndRemove(req.params.id, function (err) {
        if (err) {
          res.stat = 500;
          res.message = err;
          responses.serializeResponse(req, res);
        }
        else {
          endpoint.resource
            .create(updateObj, function (err, doc) {
              res.stat = err ? 500 : 201;
              doc && (res.body = doc.toObject());
              res.message = err;
              responses.serializeResponse(req, res);
            });
        }
      });
  };

  var upsert = function upsert (req, res, next) {
    var updateObj = req.body;
    updateObj._id = req.params.id;
    endpoint.resource
      .findByIdAndUpdate(req.params.id, updateObj, { upsert: true },
       function (err, doc) {
        res.stat = err ? 304 : 200;
        doc && (res.body = doc.toObject());
        responses.serializeResponse(req, res);
      });
  };

  var destroy = function destroy (req, res, next) {
    endpoint.resource
      .findByIdAndRemove(req.params.id, function (err, doc) {
        doc && (res.body = doc.toObject());
        res.stat = err ? 403 : 410;
        responses.serializeResponse(req, res);
      });
  };

  // mount route-specific middleware
  endpoint.router.use(var addResponseMetadata = function addResponseMetadata (req, res, next) {
    res.schema = endpoint.schema;
    next();
  });
  endpoint.router.use('/:id', middleware.idChecker)

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