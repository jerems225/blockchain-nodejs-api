var DataTypes = require("sequelize").DataTypes;
var _userauthstatus = require("./userauthstatus");

function initModels(sequelize) {
  var userauthstatus = _userauthstatus(sequelize, DataTypes);

  userauthstatus.belongsTo(user, { as: "user", foreignKey: "users_id"});
  user.hasMany(userauthstatus, { as: "userauthstatuses", foreignKey: "users_id"});

  return {
    userauthstatus,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
