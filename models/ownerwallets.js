const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ownerwallets', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    crypto_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pubkey: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    privkey: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mnemonic: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ownerwallets',
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
    ]
  });
};
