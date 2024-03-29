'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompanyFees extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CompanyFees.init({
    fees_type: DataTypes.STRING,
    crypto_name: DataTypes.STRING,
    hash: DataTypes.STRING,
    tx_hash: DataTypes.STRING,
    amount: DataTypes.DOUBLE,
    from: DataTypes.STRING,
    to: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'CompanyFees',
  });
  return CompanyFees;
};