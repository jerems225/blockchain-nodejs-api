'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class rate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  rate.init({
    country: DataTypes.STRING,
    currency: DataTypes.STRING,
    value: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'rate',
  });
  return rate;
};