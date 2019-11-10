
/* ********************************* Import Node Modules ********************************* */
const sequelize = require('sequelize');

/* ********************************* Import Local Modules ********************************* */
const {
  db, User
} = require('../dbconnection');
const { encryption } = require('../helpers');

/* ********************************* Variable Listing ********************************* */
const checkPassword = async (data) => {
  const password = data.oldPassword || data.password;
  // const result = await User.findOne({
  //   attributes: ['practiceId', 'password'],
  //   where: {
  //         practiceEmail:
  //         {
  //           $eq: data.practiceEmail,
  //         }
  //       }
  // });
  const query = `SELECT "practiceId","password" FROM "Users" WHERE "practiceEmail"='${data.practiceEmail}'`;
  const res = await db.query(query, { type: sequelize.QueryTypes.SELECT });
  const result = {
    practiceId: res[0].practiceId,
    password: res[0].password
  };
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
    const existingUser = await User.findOne({ attributes: ['practiceId'], where: { practiceEmail: data.practiceEmail } });
    if(existingUser) {
      throw new Error('User with this email exists');
    }
    const result = await User.build(practiceData).save();
    if (result) {
      return { practiceId: result.get('practiceId') };
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