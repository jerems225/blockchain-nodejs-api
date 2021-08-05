const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userauthstatus', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    users_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    twoFactorAuthEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    twoFactorAuthSecret: {
      type: DataTypes.STRING(4000),
      allowNull: true
    },
    smsVerificationToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    smsEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'userauthstatus',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "IDX_7066F40C67B3B43D",
        using: "BTREE",
        fields: [
          { name: "users_id" },
        ]
      },
    ]
  });
};
