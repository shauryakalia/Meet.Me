'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      practiceId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      practiceName: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      practiceEmail: {
        type: Sequelize.STRING
      },
      yourName: {
        type: Sequelize.STRING
      },
      yourRole: {
        type: Sequelize.STRING
      },
      practiceAddress: {
        type: Sequelize.STRING
      },
      practiceZipcode: {
        type: Sequelize.INTEGER
      },
      practicePhoneNumber: {
        type: Sequelize.INTEGER
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};