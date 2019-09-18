
/* ********************************* Import Node Modules ********************************* */
const Sequelize = require('sequelize');

/* ********************************* Import Local Modules ********************************* */
const {
    User
  } = require('../dbconnection');
const { encryption } = require('../helpers');

module.exports = {
    registerPractice: async (data) => {
        const encryptPassword = encryption.encryptPassword(data.password);
        const practiceData = {
            practiceEmail: data.practiceEmail,
            password: encryptPassword,
            practiceName: data.practiceName,
            yourName: data.yourName,
            yourRole: data.yourRole,
            practiceAddress: data.practiceAddress,
            practiceZipcode: data.practiceZipcode,
            practicePhoneNumber: data.practicePhoneNumber
          };
          const result = await User.build(practiceData).save();
          if(result){
            return { practiceId: result.get('practiceId'), password };
          }
          throw new Error('Error while registering practice');
    }
}