// stray functions that don't fit into anywhere (yet).

function validObjectId (id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// performs string interpolation on str from fields in obj.
function formatFromObj (str, obj) {
  return Object.keys(obj)
    .reduce(function (currentStr, key) {
      return currentStr.replace(
          new RegExp('{{key}}'.replace('{key}', key), 'g'),
          obj[key]
        );
    }, str);
}

var constants = {
  primaryKeyField: '_id'
};

module.exports = {
  validObjectId: validObjectId,
  formatFromObj: formatFromObj,
  constants: constants
};
