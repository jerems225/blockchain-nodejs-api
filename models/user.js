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
      allowNull: false
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
      allowNull: false
    },
    userprofile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'userprofile',
        key: 'id'
      },
      unique: "FK_8D93D64981863E41"
    },
    uuid: {
      type: DataTypes.BLOB,
      allowNull: false,
      comment: "(DC2Type:uuid)",
      unique: "UNIQ_8D93D649D17F50A6"
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
        name: "UNIQ_8D93D64981863E41",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "userprofile_id" },
        ]
      },
      {
        name: "UNIQ_8D93D649D17F50A6",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "uuid" },
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
