var DataTypes = require("sequelize").DataTypes;
var _ownerwallets = require("./ownerwallets");

function initModels(sequelize) {
  var ownerwallets = _ownerwallets(sequelize, DataTypes);


  return {
    ownerwallets,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
