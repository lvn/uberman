var _ = require('lodash'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	S = require('string');

module.exports = {
  // wrapper around ObjectId that also foreign resource
  String: {
    type: 'String',
    mongooseType: Schema.Types.String
  },
  Number: {
    type: 'Number',
    mongooseType: Schema.Types.Number
  },
  Boolean: {
    type: 'Boolean',
    mongooseType: Schema.Types.Boolean
  },
  DocumentArray: {
    type: 'DocumentArray',
    mongooseType: Schema.Types.DocumentArray
  },
  Array: {
    type: 'Array',
    mongooseType: Schema.Types.Array
  },
  Buffer: {
    type: 'Buffer',
    mongooseType: Schema.Types.Buffer
  },
  Date: {
    type: 'Date',
    mongooseType: Schema.Types.Date
  },
  foreignKey: function (endpointName) {
    return {
      type: 'foreignKey',
      ref: S(endpointName).camelize().s,
      mongooseType: {
        type: mongoose.Schema.Types.ObjectId,
      }
    };
  },
  Mixed: {
    type: 'Mixed',
    mongooseType: Schema.Types.Mixed
  }
};