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
      //console.log(field, resource, resource[field], schema[field]);
      return 'https://' + req.get('Host') +
        path.join(
          req.root, 
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

// a pseudo-middleware that serializes and returns the response.
function serializeResponse (req, res) {
  // set common metadata headers
  res.set({
      'Request-Timestamp': req.timestamp,
      'Request-UUID': req.uuid,
      'Content-Type': 'application/json'
  });

  res.status(res.stat || (res.bodyType == 'error' ? 500 : 200));
  var body = (res.bodyType == 'error') ? HttpCodes[res.stat] :
    (res.bodyType == 'literal') ? res.body :
    serializeResource(req, res.schema, res.body);

  //console.log(body);
  res.send(body);
}

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