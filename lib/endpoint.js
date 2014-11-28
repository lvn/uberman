'use strict';

// package requires
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  express = require('express'),
  path = require('path'),
  S = require('string'),
  bodyParser = require('body-parser');

// module requires
var responses = require('./responses');

var create = function (name, schema, options) {
  var app = this,
  options = options || {},
  endpoint = {},
  resourceName = S(name).camelize().s,
  endpointName = S(name).dasherize().s;

  endpoint.name = endpointName;
  endpoint.model = mongoose.model(resourceName, new Schema(schema));
  endpoint.router = express.Router();

  endpoint.router.get('/', function query (req, res) {
    endpoint.model
      .find(req.params)
      .exec(function (err, coll) {
        (err ? 
          responses.error(res, err, 404) :
          responses.json(res, coll, 200));
      });
  });
  endpoint.router.post('/', function create (req, res) {
    endpoint.model
      .create(req.body, function (err, doc) {
        (err ?
          responses.error(res, err) :
          responses.json(res, doc, 201));
      });
  });
  endpoint.router.get('/:id', function read (req, res) {
    var id = req.params.id || responses.error(res, {}, 400);
    endpoint.model
      .findById(id, function (err, doc) {
        (err ?
          responses.error(res, err, 500) :
          (doc ?
            responses.json(res, doc, 200) :
            responses.error(res, err, 404)));
      });
  });
  endpoint.router.put('/:id', function update (req, res) {
    var id = req.params.id || responses.error(res, {}, 400);
    var updateObj = req.body;
    endpoint.model
      .findByIdAndUpdate(id, updateObj, function (err, doc) {
        (err ? 
          responses.error(res, err, 304) :
          responses.json(res, doc, 200));
      });
  });
  endpoint.router.delete('/:id', function destroy (req, res) {
    var id = req.params.id || responses.error(res, {}, 400);
    endpoint.model
      .findByIdAndRemove(id, function (err, doc) {
        (err ?
          responses.error(res, err, 403) :
          responses.json(res, doc, 410));
      });
  });

  app.use(options.route || path.join(app.configs.root, endpoint.name), endpoint.router);
  return endpoint;
};

module.exports = {
  create: create
};