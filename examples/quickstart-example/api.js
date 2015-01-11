var uberman = require('./../..');

// grabs the key and cert from the current directory
var blogAPI = uberman({
  keyPath: process.cwd() + '/key.key',
  certPath: process.cwd() + '/cert.crt'
});

// creates a basic CRUD endpoint
blogAPI.resource('blogPosts', {
  title: String,
  body: String,
  created: {
    type: Date,
    default: Date.now
  },
  upvotes: Number
});

// the passphrase is `password`... try running the app!
blogAPI.listen();