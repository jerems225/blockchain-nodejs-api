const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    emailConfirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    emailConfirmationToken: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    invitationRewardCount: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    resetPasswordToken: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    resetPasswordTokenCreatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    withdrawalLimit: {
      type: DataTypes.DECIMAL(15,6),
      allowNull: true
    },
    feeDiscountFactor: {
      type: DataTypes.DECIMAL(15,6),
      allowNull: true
    },
    referredBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isBot: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isExchange: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isHolder: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    roles: {
      type: DataTypes.JSON,
      allowNull: true
    },
    userprofile_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'user',
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
        name: "user_email",
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
};
