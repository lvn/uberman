'use strict';

// package requires
var _ = require('lodash');

module.exports = {
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