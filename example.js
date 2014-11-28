var uberman = require('./lib/uberman');

console.log(process.cwd());

var blogAPI = uberman({
	keyPath: process.cwd() + '/examplepk.key',
	certPath: process.cwd() + '/examplecert.crt'
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

blogAPI.listen(8443);