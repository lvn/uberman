var uberman = require('./../..');

// grabs the key and cert from the current directory
var booksAPI = uberman({
  keyPath: process.cwd() + '/key.key',
  certPath: process.cwd() + '/cert.crt'
});

// creates an endpoint for books
booksAPI.resource('books', {
  title: String,
  genre: uberman.Types.foreignKey('genres')
});

// creates an endpoint for genres
booksAPI.resource('genres', {
  name: String,
  books: [uberman.Types.foreignKey('books')]
});

// the passphrase is `password`... try running the app!
booksAPI.listen();