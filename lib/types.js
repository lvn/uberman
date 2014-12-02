var _ = require('lodash'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	S = require('string');

module.exports = {
  // wrapper around ObjectId that also foreign resource
  foreignKey: function (endpointName) {
    return {
      type: mongoose.Schema.Types.ObjectId,
      ref: S(endpointName).camelize().s
    }
  },
  Mixed: Schema.Types.Mixed
});