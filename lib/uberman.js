'use strict';

// package requires
var fs = require('fs'),
    express = require('express'),
    mongoose = require('mongoose'),
    _ = require('lodash'),
    string = require('string');

// module requires
var endpoint = require('./endpoint'),
    middleware = require('./middleware');


var uberman = function (configs) {
    var app = express();
    

    // apply standard middleware here
    app.use(middleware.uuidAssign);
    app.use(middleware.jsonParser);
    app.use(middleware.logger);

    // apply options here
    configs = configs || {};
    app.configs = {};
    app.configs.root = configs.root || '/api';
    app.configs.name = configs.name || 'app';
    app.configs.sslKey = '';
    app.configs.sslCert = '';
    app.endpoints = {};

    mongoose.connect((app.configs.mongoURI || ('mongodb://localhost/' + (app.configs.appName || ''))), app.configs.mongo);

    return {
        listen: function (port) {
            port = port || 1337;
            app.listen(port);
        },
        addEndpoint: function (name, schema, options) {
            options = options || {};
            var endpointObj = endpoint.create.call(app, name, schema);
            app.endpoints[endpointObj.name] = endpointObj;
        }
    };
};

uberman.Types = _.assign(mongoose.Schema.Types,{
    foreignKey: function (resource) {
        
    }
});

module.exports = uberman;