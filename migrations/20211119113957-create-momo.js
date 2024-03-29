'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('momos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      country: {
        type: Sequelize.STRING
      },
      symbol: {
        type: Sequelize.STRING
      },
      code: {
        type: Sequelize.STRING
      },
      currency: {
        type: Sequelize.STRING
      },
      channel: {
        type: Sequelize.JSON
      },
      operator: {
        type: Sequelize.JSON
      },
      available_buy: {
        type: Sequelize.BOOLEAN
      },
      available_withdraw: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('momos');
  }
};