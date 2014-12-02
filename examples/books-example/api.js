var uberman = require('./../..');

// grabs the key and cert from the current directory
var booksAPI = uberman({
  keyPath: process.cwd() + '/key.key',
  certPath: process.cwd() + '/cert.crt'
});

// creates an endpoint for books
booksAPI.addEndpoint('books', {
  title: String,
  genre: uberman.Types.foreignKey('genres')
});

// creates an endpoint for genres
booksAPI.addEndpoint('genres', {
  name: String,
  books: [uberman.Types.foreignKey('books')]
});

// the passphrase is `password`... try running the app!
booksAPI.listen(8443);