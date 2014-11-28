'use strict';

// package requires
var _ = require('lodash');

module.exports = {
  error: function (res, err, status) {
    status = status || 500;
    res.json(status, err);
  },
  json: function (res, payload, status) {
    status = status || 200;
    res.status(status)
      .json({
        payload: payload
      });
  }
};