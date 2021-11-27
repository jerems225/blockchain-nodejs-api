'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ownerstakewallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ownerstakewallet.init({
    crypto_name: DataTypes.STRING,
    pubkey: DataTypes.STRING,
    privkey: DataTypes.STRING,
    mnemonic: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ownerstakewallet',
  });
  return ownerstakewallet;
};