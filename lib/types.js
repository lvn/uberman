var _ = require('lodash'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	S = require('string');

var utils = require('./utils');

module.exports = {
  // wrapper around ObjectId that also foreign resource
  String: {
    type: 'String',
    validate: function validate (field) {
      return typeof(field) == 'string';
    },
    mongooseType: Schema.Types.String
  },
  Number: {
    type: 'Number',
    validate: function validate (field) {
      return typeof(field) == 'number';
    },
    mongooseType: Schema.Types.Number
  },
  Boolean: {
    type: 'Boolean',
    validate: function validate (field) {
      return typeof(field) == 'boolean';
    },
    mongooseType: Schema.Types.Boolean
  },
  DocumentArray: {
    type: 'DocumentArray',
    validate: function validate (field) {
      return Array.isArray(field);
    },
    mongooseType: Schema.Types.DocumentArray
  },
  Array: {
    type: 'Array',
    validate: function validate (field) {
      return Array.isArray(field);
    },
    mongooseType: Schema.Types.Array
  },
  Buffer: {
    type: 'Buffer',
    mongooseType: Schema.Types.Buffer
  },
  Date: {
    type: 'Date',
    validate: function validate (field) {
      return Array.isArray(field);
    },
    mongooseType: Schema.Types.Date
  },
  foreignKey: function (endpointName) {
    return {
      type: 'foreignKey',
      ref: S(endpointName).camelize().s,
      validate: function validate (field) {
        return utils.validObjectId(field);
      },
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