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
    transaction_type: DataTypes.STRING,
    hash: DataTypes.STRING,
    from: DataTypes.STRING,
    to: DataTypes.STRING,
    amount: DataTypes.STRING,
    fees: DataTypes.STRING,
    amountusd: DataTypes.STRING,
    feesusd: DataTypes.STRING,
    amountcurrency: DataTypes.STRING,
    currency: DataTypes.STRING,
    country: DataTypes.STRING,
    momo_method: DataTypes.STRING,
    confirmation: DataTypes.BOOLEAN,
    paymentstatus: DataTypes.BOOLEAN,
    paymentid: DataTypes.STRING,
    user_uuid: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};