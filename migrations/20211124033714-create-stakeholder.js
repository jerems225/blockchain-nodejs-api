'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('stakeholders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      crypto_name: {
        type: Sequelize.STRING
      },
      start_time: {
        type: Sequelize.DATE
      },
      end_time: {
        type: Sequelize.DATE
      },
      fee_start: {
        type: Sequelize.DOUBLE
      },
      fee_end: {
        type: Sequelize.DOUBLE
      },
      amount_invest: {
        type: Sequelize.DOUBLE
      },
      amount_reward: {
        type: Sequelize.DOUBLE
      },
      amount_reward_day: {
        type: Sequelize.DOUBLE
      },
      period: {
        type: Sequelize.INTEGER
      },
      rate: {
        type: Sequelize.DOUBLE
      },
      start_status: {
        type: Sequelize.BOOLEAN
      },
      end_status: {
        type: Sequelize.BOOLEAN
      },
      amount_invest_return: {
        type: Sequelize.DOUBLE
      },
      tx_stake_confirm: {
        type: Sequelize.BOOLEAN
      },
      auto_renew: {
        type: Sequelize.BOOLEAN
      },
      user_uuid: {
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
    await queryInterface.dropTable('stakeholders');
  }
};