'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class appsetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  appsetting.init({
    policy: DataTypes.STRING,
    conditions: DataTypes.STRING,
    terms: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'appsetting',
  });
  return appsetting;
};