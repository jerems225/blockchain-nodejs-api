'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class stakeholder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  stakeholder.init({
    crypto_name: DataTypes.STRING,
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
    fee_start: DataTypes.DOUBLE,
    fee_end: DataTypes.DOUBLE,
    amount_invest: DataTypes.DOUBLE,
    amount_reward: DataTypes.DOUBLE,
    amount_reward_day: DataTypes.DOUBLE,
    period: DataTypes.INTEGER,
    rate: DataTypes.DOUBLE,
    start_status: DataTypes.BOOLEAN,
    end_status: DataTypes.BOOLEAN,
    tx_stake_confirm: DataTypes.BOOLEAN,
    auto_renew: DataTypes.BOOLEAN,
    user_uuid: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'stakeholder',
  });
  return stakeholder;
};