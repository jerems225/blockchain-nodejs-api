'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class momo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  momo.init({
    country: DataTypes.STRING,
    symbol: DataTypes.STRING,
    code: DataTypes.STRING,
    currency: DataTypes.STRING,
    available_buy: DataTypes.BOOLEAN,
    available_withdraw: DataTypes.BOOLEAN,
    channel: DataTypes.JSON,
    operator: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'momo',
  });
  return momo;
};