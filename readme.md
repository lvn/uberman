# Uberman
### A better way to REST
#### by [Elvin Yung](https://github.com/elvinyung)

Develop and deploy REST APIs quickly with less boilerplate code.

## Introduction
Uberman is an opinionated Node.js HTTPS JSON REST API framework powered by Express.js and MongoDB. 

## Features
* Extremely easy generation of resources and endpoints
* Pragmatic JSON responses

## Quickstart
Install [from NPM](https://www.npmjs.org/package/uberman).

Suppose we want to create a REST API for a blog, which exposes a single endpoint for blog posts. The code to do that is as follows:
    
```javascript
var uberman = require('uberman');
var blogAPI = uberman({
    certPath: // PATH TO SSL CERT
    keyPath: // PATH TO SSL KEY
});

blogAPI.addEndpoint('blogPosts', {
    title: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    },
    upvotes: Number
});

blogAPI.listen();
```

`uberman(config)` creates an API and applies the given `config`. `keyCert` and `keyPath` are required fields in the `config` and must respectively point to an TLS/SSL certificate file and its corresponding private key. Other fields in the config will be discussed later in this readme.

`addEndpoint(name, schema[, options])` adds an endpoint in the API with the given schema, and the supplied options. The name is camelized to create the MongoDB collection, and dasherized to create the route. (For example, an endpoint named `xTreMeKoolEndPoint` would be routed to `x-tre-me-kool-end-point`, and have a Mongoose model named `xTreMeKoolEndPoint`.)

In the context of the quickstart example, the route `blogPosts` was created in the `blogAPI`, routed to `/blog-posts`, and backed by a Mongoose model named `blogPosts`. The following default operations on the endpoint, are also generated:
* a **query** operation on `GET /blog-posts`. This is queriable through parameters in the query string.
* a **create** operation on `POST /blog-posts`. This accepts only valid JSON with the `Content-Type` header as `application/json`.
* a **retrieve** operation on `GET /blog-posts/:id`.
* a **replace** operation on `PUT /blog-posts/:id`. This accepts only valid JSON with the `Content-Type` header as `application/json`.
* an **upsert** operation on `PATCH /blog-posts/:id`. This accepts only valid JSON with the `Content-Type` header as `application/json`.
* a **destroy** operation on `DELETE /blog-posts/:id`

These operations are compliant with [RFC 2616](https://tools.ietf.org/html/rfc2616) and [RFC 5789](http://tools.ietf.org/html/rfc5789).

`listen([port], [host])` binds connections in the given host and port to the API. By default, Uberman APIs listen on localhost port 443, and accepts only HTTPS connections.

## Resources
When you build an endpoint using `addEndpoint(name, schema[, options])`, you provide a **schema**, which is the structure of the endpoint's resource, outlined in terms of the fields that the resource contains. Uberman exposes field types through the `uberman.types` object, which is essentially a layer on top of the Mongoose `Schema.Types`. The following types are supported:

### `String`
### `Number`
### `Date`
### `Buffer`
### `Boolean`
### `Mixed`
### `foreignKey`
### arrays
### nested data

Below is an example schema.

```javascript
{
    name: String,
    score: Number,
    birthday: Date,

}
```

## Routing
Uberman dasherizes all endpoint routes, and places them under the API root.

The API root is by default set to `/api/v{version}`, where `{version}` is the API version set in the config, or `0` by default. You can change it using the `root` config field.

## Requests and Responses
By default, Uberman accepts only JSON request bodies (with the `Content-Type` header as `application/json`), and returns JSON response bodies. A typical response body is as follows:

```json
{
    "timestamp": "2014-11-28T05:18:31.507Z",
    "request_uuid": "c95fef02-9b13-4661-84d7-21431815dc42",
    "status": 200,
    "payload": [
        {
            "_id": "5478048fabb051f5b765e74b",
            "title": "this is a test blogpost",
            "body": "hello world!!!!!!!!!1",
            "__v": 0,
            "created": "2014-11-28T05:13:51.220Z"
        }
    ]
}
```

