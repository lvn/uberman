'use strict';

var mongoose = require('mongoose'),
    express = require('express'),
    path = require('path'),
    S = require('string'),
    bodyParser = require('body-parser');

var create = function (name, schema, options) {
    var app = this,
        options = options || {},
        endpoint = {},
        resourceName = S(name).camelize().s,
        endpointName = S(name).dasherize().s;

    endpoint.name = endpointName;
    endpoint.model = mongoose.model(resourceName, schema);
    endpoint.router = express.Router();

    endpoint.router.get('/', function query (req, res) {
        res.json({
            'status': 'success'
        })
    });
    endpoint.router.post('/', function create (req, res) {

    });
    endpoint.router.get('/:id', function read (req, res) {

    });
    endpoint.router.put('/:id', function update (req, res) {

    });
    endpoint.router.delete('/:id', function destroy (req, res) {

    });
    
    app.use(options.route || path.join(app.configs.root, endpoint.name), endpoint.router);
    return endpoint;
};

module.exports = {
    create: create
};