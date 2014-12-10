var _ = require('lodash'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	S = require('string');

module.exports = {
  // wrapper around ObjectId that also foreign resource
  String: Schema.Types.String,
  Number: Schema.Types.Number,
  Boolean: Schema.Types.Boolean,
  DocumentArray: Schema.Types.DocumentArray,
  Array: Schema.Types.Array,
  Buffer: Schema.Types.Buffer,
  Date: Schema.Types.Date,
  foreignKey: function (endpointName) {
    return {
      type: mongoose.Schema.Types.ObjectId,
      ref: S(endpointName).camelize().s
    };
  },
  Mixed: Schema.Types.Mixed
};