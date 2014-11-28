var uberman = require('./lib/uberman');
var blogAPI = uberman();

blogAPI.addEndpoint('blogPost', {
    title: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    },
    upvotes: Number
});

blogAPI.listen();