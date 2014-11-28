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
* a query operation on `GET /blog-posts`
* a create operation on `POST /blog-posts`
* a retrieve operation on `GET /blog-posts/:id`
* an update operation on `PUT /blog-posts/:id`
* a destroy operation on `DELETE /blog-posts/:id`



By default, Uberman APIs listen on port 443, and forces all connections to be over SSL.

## Requests
By default, Uberman accepts only JSON request bodies, and returns JSON response bodies. A typical response is as follows:

```json
{
    "timestamp": 1417150033477,
    "request_uuid": "6fedffea-51ab-49d6-8fdd-0fa081742a45",
    "status": 200,
    "payload": [
        {
            "_id": "5477f7cea92619e0ab9d327a",
            "__v": 0,
            "created": "2014-11-28T04:19:26.108Z"
        },
        {
            "_id": "5477f9dfef1ca2caacdd863a",
            "__v": 0,
            "created": "2014-11-28T04:28:15.859Z"
        }
    ]
}
```

