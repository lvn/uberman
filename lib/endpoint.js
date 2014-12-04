'use strict';

// package requires
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  express = require('express'),
  path = require('path'),
  S = require('string'),
  bodyParser = require('body-parser');

// module requires
var responses = require('./responses'),
  utils = require('./utils');

var makeResourceName = function (name) {
  return S(name).camelize().s;
};

var makeRouteName = function (name) {
  return S(name).dasherize().s;
};  

var makeEndpoint = function (name, schema, options) {
  var options = options || {},
  endpoint = {};

  endpoint.resourceName = makeResourceName(name);
  endpoint.routeName = options.route || makeRouteName(name);

  endpoint.name = name;
  endpoint.schema = schema;
  endpoint.model = mongoose.model(endpoint.resourceName, new Schema(schema));
  endpoint.router = express.Router();

  var query = function (req, res) {
    var createObj = req.body;
    endpoint.model
      .find(createObj)
      .exec(function (err, coll) {
        (err ? 
          responses.error(req, res, err, 404) :
          responses.json(req, res, coll, 200));
      });
  };

  var create = function (req, res) {
    endpoint.model
      .create(req.body, function (err, doc) {
        (err ?
          responses.error(req, res, err) :
          responses.json(req, res, doc, 201));
      });
  };

  var read = function (req, res) {
    if (!!req.params.id && !utils.validObjectId(req.params.id))
    {
      responses.error(req, res, 'Invalid ID', 400);
      return;
    }
    var id = req.params.id || responses.error(req, res, {}, 400);
    endpoint.model
      .findById(id, function (err, doc) {
        (err ?
          responses.error(req, res, err, 500) :
          (doc ?
            responses.json(req, res, doc, 200) :
            responses.error(req, res, err, 404)));
      });
  };

  var replace = function (req, res) {
    if (!!req.params.id && !utils.validObjectId(req.params.id))
    {
      responses.error(req, res, 'Invalid ID', 400);
      return;
    }
    var id = req.params.id || responses.error(req, res, {}, 400);
    var updateObj = req.body;
    updateObj._id = id;

    endpoint.model
      .findByIdAndRemove(id, function(err, doc) {
        err && responses.error(req, res, err);
        endpoint.model
          .create(updateObj, function (err, doc) {
            (err ? 
              responses.error(req, res, err) :
              responses.error(req, res, doc, 201));
          });
      });
  };

  var upsert = function (req, res) {
    if (!!req.params.id && !utils.validObjectId(req.params.id))
    {
      responses.error(req, res, 'Invalid ID', 400);
      return;
    }
    var id = req.params.id || responses.error(req, res, {}, 400);
    var updateObj = req.body;
    endpoint.model
      .findByIdAndUpdate(id, updateObj,
      {
        upsert: true
      },
       function (err, doc) {
        (err ? 
          responses.error(req, res, err, 304) :
          responses.json(req, res, doc, 200));
      });
  };

  var destroy = function (req, res) {
    if (!!req.params.id && !utils.validObjectId(req.params.id))
    {
      responses.error(req, res, 'Invalid ID', 400);
      return;
    }
    var id = req.params.id || responses.error(req, res, {}, 400);
    endpoint.model
      .findByIdAndRemove(id, function (err, doc) {
        (err ?
          responses.error(req, res, err, 403) :
          responses.json(req, res, doc, 410));
      });
  };

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