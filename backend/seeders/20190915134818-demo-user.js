'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        practiceId: 1,
        practiceEmail: 'shauryastesting@gmail.com',
        password: 'shaurya123',
        practiceName: 'test',
        yourName: 'shaurya',
        yourRole: 'dev',
        practiceAddress: 'ghar ki baat hai',
        practiceZipcode: '420',
        practicePhoneNumber: '9999999999',
        createdAt : new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
