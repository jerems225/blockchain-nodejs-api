'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Transaction.init({
    crypto_name: DataTypes.STRING,
    hash: DataTypes.STRING,
    from: DataTypes.STRING,
    to: DataTypes.STRING,
    amount: DataTypes.STRING,
    fees: DataTypes.STRING,
    confirmation: DataTypes.BOOLEAN,
    user_uuid: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};