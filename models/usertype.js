'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usertype extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  usertype.init({
    name: DataTypes.STRING,
    limittransfert: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'usertype',
  });
  return usertype;
};