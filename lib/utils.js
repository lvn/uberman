// stray functions that don't fit into anywhere (yet).

function validObjectId (id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

var constants = {
  primaryKeyField: '_id'
};

module.exports = {
  validObjectId: validObjectId,
  constants: constants
};
