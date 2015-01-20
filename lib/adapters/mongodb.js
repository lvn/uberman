var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

//
var schemaTypes = {
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
