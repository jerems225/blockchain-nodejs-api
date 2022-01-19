'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class twilio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  twilio.init({
    to: DataTypes.STRING,
    code: DataTypes.STRING,
    user_uuid : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'twilio',
  });
  return twilio;
};