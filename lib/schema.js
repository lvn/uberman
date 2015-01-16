
// the intermediary Uberman schema layer

var types = require('./types');

function toMongooseField (field) {
  return {
    function: function (field) {
      // field is either String, Number, Boolean, Array, or Date
      // return it literally
      return field;
    },
    object: function (field) {
      // field is some sort of object or array
      // can be either an extened field description, nested schema,
      //  or special uberman type
      if (Array.isArray(field)) {
        return field.map(toMongooseField);
      }
      else {
        return (field.mongooseType ? 
          field.mongooseType :
          field);
      }
    },
    undefined: function (field) {
      // wtf?
    }
  }[typeof field](field);
};

function toMongooseSchema (schema) {
  var mongooseSchema = {};
  Object.keys(schema)
    .forEach(function(fieldName){
      var field = schema[fieldName];
      mongooseSchema[fieldName] = toMongooseField(field);
    });

  return mongooseSchema;
}

// basic document field type validator 
function validate (schema, document, opts) {
  Object.keys(document);
}

module.exports = {
  // validate each schema field
  toMongooseSchema: toMongooseSchema

};
