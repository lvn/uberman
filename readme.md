# Uberman
### A better way to REST
#### by [Elvin Yung](https://github.com/elvinyung)

Develop and deploy REST APIs quickly with less boilerplate code.

## Introduction
Uberman is an opinionated Node.js REST API framework powered by Express.js and MongoDB. 

## Features
* Extremely easy generation of resources and endpoints
* Pragmatic responses

## Quickstart
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