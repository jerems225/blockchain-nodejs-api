'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Cryptos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      crypto_name: {
        type: Sequelize.STRING
      },
      crypto_symbol: {
        type: Sequelize.STRING
      },
      contract_address: {
        allowNull: true,
        type: Sequelize.STRING
      },
      contract_abi: {
        allowNull: true,
        type: Sequelize.JSON
      },
      contract_address_test: {
        allowNull: true,
        type: Sequelize.STRING
      },
      contract_abi_test: {
        allowNull: true,
        type: Sequelize.JSON
      },
      staking_amount_min: {
        type: Sequelize.DOUBLE
      },
      staking_amount_max: {
        type: Sequelize.DOUBLE
      },
      amount_min: {
        type: Sequelize.DOUBLE
      },
      stakable: {
        type: Sequelize.BOOLEAN
      },
      crypto_type: {
        type: Sequelize.STRING
      },
      crypto_name_market: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Cryptos');
  }
};