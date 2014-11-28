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
    keyPath: // PATH TO SSL KEY
    certPath: // PATH TO SSL CERT
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

This creates an API with an endpoint route `blog-posts`, backed by a MongoDB collection named `blogPosts`. The following default operations on the endpoint, routed to `/blog-posts`, are also generated:
* a **query** operation on `GET /blog-posts`. This is queriable through the query parameters.
* a **create** operation on `POST /blog-posts`. This accepts only valid JSON with the `Content-Type` header as `application/json`.
* a **retrieve** operation on `GET /blog-posts/:id`.
* an **update** operation on `PUT /blog-posts/:id`. This accepts only valid JSON with the `Content-Type` header as `application/json`.
* a **destroy** operation on `DELETE /blog-posts/:id`

By default, Uberman APIs listen on port 443, and forces all connections to be over SSL.

## Requests and Responses
By default, Uberman accepts only JSON request bodies (with the `Content-Type` header as `application/json`), and returns JSON response bodies. A typical response is as follows:

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

