'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Crypto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Crypto.init({
    crypto_name: DataTypes.STRING,
    crypto_symbol: DataTypes.STRING,
    contract_address: DataTypes.STRING,
    contract_abi: DataTypes.JSON,
    contract_address_test: DataTypes.STRING,
    contract_abi_test: DataTypes.JSON,
    amount_min: DataTypes.DOUBLE,
    staking_amount_min: DataTypes.DOUBLE,
    staking_amount_max: DataTypes.DOUBLE,
    stakable: DataTypes.BOOLEAN,
    crypto_type: DataTypes.STRING,
    crypto_name_market: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Crypto',
  });
  return Crypto;
};