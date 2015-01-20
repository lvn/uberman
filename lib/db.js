
// basic data persistence layer.

function setupDb (configs) {
  // connect to db
  var db = require(configs.adapter);

  // setup db
  db.connect({
    uri: configs.uri
    port: configs.port
  });

  // return an API of 
  return {
    createCollection: function (name, schema) {

    },
    create: function (doc) {

    },
    read: function () {

    },
    update: function () {

    },
    delete: function () {

    }
  }
};

module.exports = setupDb;