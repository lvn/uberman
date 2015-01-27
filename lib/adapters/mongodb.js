var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var utils = require('./../utils');

// mongoose type mappings
var typeMapping = {
  String: Schema.Types.String,
  Number: Schema.Types.Number,
  Boolean: Schema.Types.Boolean,
  DocumentArray: Schema.Types.DocumentArray,
  Array: Schema.Types.Array,
  Buffer: Schema.Types.Buffer,
  Date: Schema.Types.Date,
  foreignKey: mongoose.Schema.Types.ObjectId,
  Mixed: mongooseType: Schema.Types.Mixed
};

function mongoDb (configs) {
  this.models = {};

  mongoose.connect(
    utils.format((configs.username && configs.password) ?
        'mongodb://{username}:{password}@{host}:{port}/{database}' :
        'mongodb://{host}:{port}/{database}', configs), 
    configs);
}

mongoDb.prototype.model = function model (name, schema) {
};

mongoDb.prototype.create = function create (schema, resource) {
  
};

mongoDb.prototype.read = function read (schema, resource) {
  
};

mongoDb.prototype.readOne = function readOne (schema, resource) {
  
};

mongoDb.prototype.replace = function replace (schema, resource) {

};

mongoDb.prototype.upsert = function upsert (schema, resource) {

};

mongoDb.prototype.delete = function delete (schema, resource) {

};

function connect (configs) {
  return new mongoDb(configs);
}

module.exports = {
  typeMapping: typeMapping,
  connect: connect
};