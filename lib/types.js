var _ = require('lodash'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	S = require('string');

var utils = require('utils');

module.exports = {
  // wrapper around ObjectId that also foreign resource
  String: {
    type: 'String',
    validate: function validate (field) {
      return typeof(field) == 'string';
    }
  },
  Number: {
    type: 'Number',
    validate: function validate (field) {
      return typeof(field) == 'number';
    }
  },
  Boolean: {
    type: 'Boolean',
    validate: function validate (field) {
      return typeof(field) == 'boolean';
    }
  },
  DocumentArray: {
    type: 'DocumentArray',
    validate: function validate (field) {
      return Array.isArray(field);
    }
  },
  Array: {
    type: 'Array',
    validate: function validate (field) {
      return Array.isArray(field);
    }
  },
  Buffer: {
    type: 'Buffer'
  },
  Date: {
    type: 'Date',
    validate: function validate (field) {
      return Array.isArray(field);
    }
  },
  foreignKey: function (endpointName) {
    return {
      type: 'foreignKey',
      ref: S(endpointName).camelize().s,
      validate: function validate (field) {
        return utils.validObjectId(field);
      }
    };
  },
  Mixed: {
    type: 'Mixed',
    validator: function (field) {
      return true;
    }
  }
};