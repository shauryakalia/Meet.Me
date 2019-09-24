
/* ********************************* Import Node Modules ********************************* */
const Sequelize = require('sequelize');

/* ********************************* Import Local Modules ********************************* */
const {
    User
  } = require('../dbconnection');
const { encryption } = require('../helpers');

/* ********************************* Variable Listing ********************************* */
const checkPassword = async (data) => {
  const password = data.oldPassword || data.password;
  const result = await User.findOne({
    attributes: ['practiceId', 'password'],
    where: {
          email:
          {
            $eq: data.email,
          }
        }
  });
  if (result) {
    const validPassword = encryption.comparePassword(password, result);
    return validPassword;
  }
  throw new Error('Practice does not exist');
};

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
            return { practiceId: result.get('practiceId')};
          }
          throw new Error('Error while registering practice');
    },
    login: async (data) => {
      const password = await checkPassword(data);
      if (password) {
        const result = await User.findOne({ where: { practiceEmail: data.practiceEmail } });
        return result;
      }
      throw new Error('Invalid password');
    }
}