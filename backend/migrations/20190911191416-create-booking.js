'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Bookings', {
      BookingId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      mobileNumber: {
        type: Sequelize.INTEGER
      },
      serviceId: {
        type: Sequelize.INTEGER
      },
      practiceId: {
        type: Sequelize.INTEGER
      },
      additionalNotes: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      fromTime: {
        type: Sequelize.BIGINT
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Bookings');
  }
};