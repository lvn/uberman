'use strict';

// package requires
var _ = require('lodash');

// serializes a response to appropriate json formatting
function serializeResource (resource) {
  return resource;
};

module.exports = {
  respondError: function (res, err, meta) {
    meta = meta || {};
    
    var status = meta.status || 500;

    res.set(meta);
    res.status(status)
      .json({
        status: status
        error: err
      }));
  },
  respondResource: function (res, resource, meta) {
    meta = meta || {};
    resource = serializeResource(resource);
    var status = meta.status || 200;
    res.set(meta);
    res.status(status)
      .json(resource);
  },
  respondCollection: function (res, coll, meta) {
    meta = meta || {};
    coll = coll.map(serializeResource);

    var status = meta.status || 200;

    res.status(status)
      .json(coll);
  },


  error: function (req, res, err, status) {
    status = status || 500;
    res.status(status)
      .json({
        timestamp: req.timestamp,
        request_uuid: req.uuid,
        status: status,
        error: err
      })
  },
  json: function (req, res, payload, status) {
    status = status || 200;
    res.status(status)
      .json({
        timestamp: req.timestamp,
        request_uuid: req.uuid,
        status: status,
        payload: payload
      });
  }
};