# Uberman
### A better way to REST
#### by [Elvin Yung](https://github.com/elvinyung)

Develop and deploy REST APIs quickly with less boilerplate code.

## Introduction
Uberman is a framework for building pragmatic RESTful resource-oriented hypermedia-driven APIs, compliant with [RFC 2616](https://tools.ietf.org/html/rfc2616) and [RFC 5789](http://tools.ietf.org/html/rfc5789), and Roy Fielding's original dissertation on [representational state transfer](). It is built upon Express.js and Mongoose/MongoDB. 

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
When you build an endpoint using `addEndpoint(name, schema[, options])`, you provide a **schema**, which is the structure of the endpoint's resource-type, outlined in terms of the fields that the resource contains. Uberman exposes field types through the `uberman.Types` object, which is essentially a layer on top of the Mongoose `Schema.Types`. The following types are supported:

### `String`
Represents a primitive string type, analogous to the built-in [String]() type.
### `Number`
Represents a primitive numerical type, analogous to the built-in [Number]() type.
### `Date`
Represents a primitive datetime type, analogous to the built-in [Date]() type.
### `Buffer`

### `Boolean`
Represents a primitive boolean type, analogous to the built-in [Boolean]() type.
### `Mixed`
### `foreignKey`
Represents a reference to some other resource. In resource representations, a `foreignKey` is serialized as the `_id` field of the resource being referenced. You can declare a `foreignKey` type in schema by using the `foreignKey(ref)` constructor, where `ref` is the name of the endpoint through which the referred resource can be accessed. 
### arrays

### nested data
Creates 

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

The API root is by default set to `/api/v{version}`, where `{version}` is the API version set in the config, which is 0 by default. You can change it using the `root` config field, or the `version` field if you just want to change the version.

## Requests and Responses
By default, Uberman accepts only JSON request bodies (with the `Content-Type` header as `application/json`), and returns JSON response bodies. In all cases, the body of the response is unenveloped, and the resource or collection serialized is the entire response body. 

Any metadata is put in headers. This includes things such as the request UUID, the request timestamp, and information about the client's rate limiting.

Uberman's uses hypermedia-driven responses to facilitate transition of representational application state. For Uberman APIs, this means that in response bodies, all foreign keys are represented as hyperlinks to the resource referred to.

For example, here is a sample response body to `GET /api/v0/books` in a hypothetical REST API for tracking books:

```json
[
    {
        "_id": "5495041dd71d98000011c9d1",
        "__v": 0,
        "title": "Dune",
        "genre": "https://example.com/api/v0/genres/547a28885761190000fc8814"
    },
    {
        "_id": "5495b13b50d2bd0000368403",
        "title": "Foundation and Earth",
        "genre": "https://example.com/api/v0/genres/547a28885761190000fc8814",
        "__v": 0
    }
]
```

## Roadmap
(Roughly in descending order of priority)
* local provider-based OAuth 2 authentication server
* implement envvar based API configuration
* autodocumentation
