'use strict';

// package requires
var _ = require('lodash'),
  path = require('path'),
  httpStatus = require('http-status');

// local module requires
var utils =  require('./utils');

// serializes a response to appropriate json formatting
// type matches it to schema
function serializeResource (req, schema, resource) {
  // TODO: refactor this shit
  if (Array.isArray(resource)) {
    schema = Array.isArray(schema) ? schema[0] : schema;
    return resource.map(function (r) {
      return serializeResource(req, schema, r);
    });
  }
  else if (typeof resource == 'object') {
    var ret = {};

    if (schema.type == 'foreignKey') {
      return 'https://' + req.get('Host') +
        path.join(
          req.configs.root, 
          schema.ref,
          resource.toString()
        );
    }
    for (var field in resource) {
      ret[field] = schema[field] ?
        serializeResource(req, schema[field], resource[field]) :
        resource[field];
    }
    return ret;
  }
  else {
    return resource;
  }
};

function serializeError (req, res) {
  var ret = {
    error: httpStatus[res.stat]
  };
  
  res.message && (ret.message = res.message);
  return ret;
}

// a pseudo-middleware that serializes and returns the response.
function serializeResponse (req, res) {
  // set common metadata headers
  res.set({
      'Request-Timestamp': req.timestamp,
      'Request-UUID': req.uuid,
      'Content-Type': 'application/json'
  });

  res.status(res.stat || (res.body ? 200 : 500));
  var responseBody = res.body ? 
    ((res.bodyType == 'literal') ? res.body : 
      serializeResource(req, res.schema, res.body)) :
    serializeError(req, res);

  res.send(responseBody);
}

// deprecated
function error (req, res, err, status) {
  status = status || 500;
  res.status(status)
    .json({
      timestamp: req.timestamp,
      request_uuid: req.uuid,
      status: status,
      error: err
    })
};

// deprecated
function json (req, res, payload, status) {
  status = status || 200;
  res.status(status)
    .json({
      timestamp: req.timestamp,
      request_uuid: req.uuid,
      status: status,
      payload: payload
    });
};

module.exports = {
  error: error,
  json: json,
  serializeResponse: serializeResponse
};