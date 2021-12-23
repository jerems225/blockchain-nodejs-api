'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      crypto_name: {
        type: Sequelize.STRING
      },
      transaction_type: {
        type: Sequelize.STRING
      },
      hash: {
        type: Sequelize.STRING
      },
      from: {
        type: Sequelize.STRING
      },
      to: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.STRING
      },
      fees: {
        type: Sequelize.STRING
      },
      amountusd: {
        type: Sequelize.STRING
      },
      feesusd: {
        type: Sequelize.STRING
      },
      amountcurrency: {
        allowNull: true,
        type: Sequelize.STRING
      },
      currency: {
        allowNull:true,
        type: Sequelize.STRING
      },
      country: {
        allowNull:true,
        type: Sequelize.STRING
      },
        momo_method: {
          allowNull:true,
          type: Sequelize.STRING
        },
        phone: {
          allowNull:true,
          type: Sequelize.STRING
        },
      confirmation: {
        type: Sequelize.BOOLEAN
      },
      paymentstatus: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      paymentid: {
        allowNull:true,
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Transactions');
  }
};