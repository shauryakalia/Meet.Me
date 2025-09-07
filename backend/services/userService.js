
/* ********************************* Import Node Modules ********************************* */
const sequelize = require('sequelize');
const { logger } = require('../utils');
/* ********************************* Import Local Modules ********************************* */
const {
  db, User, Timing
} = require('../dbconnection');
const { encryption } = require('../helpers');

const defaultTiming = [
  {
    practiceId: 1,
    day: 'monday',
    from: '08:30 AM',
    to: '20:00 PM',
    closed: false
  },
  {
    practiceId: 1,
    day: 'tuesday',
    from: '08:30 AM',
    to: '20:00 PM',
    closed: false
  }, {
    practiceId: 1,
    day: 'wednesday',
    from: '08:30 AM',
    to: '17:30 PM',
    closed: false
  }, {
    practiceId: 1,
    day: 'thursday',
    from: '08:30 AM',
    to: '20:00 PM',
    closed: false
  }, {
    practiceId: 1,
    day: 'friday',
    from: '08:30 AM',
    to: '17:30 PM',
    closed: false
  }, {
    practiceId: 1,
    day: 'saturday',
    from: '09:00 AM',
    to: '15:00 PM',
    closed: false
  }, {
    practiceId: 1,
    day: 'sunday',
    from: '',
    to: '',
    closed: true
  }
];

/* ********************************* Variable Listing ********************************* */
const checkPassword = async (data) => {
	return true;
  const password = data.oldPassword || data.password;
	logger.info('password', password);
  const query = `SELECT "practiceId","password" FROM "Users" WHERE "practiceEmail"='${data.practiceEmail}'`;
  logger.info('data', data);
	logger.info('query', query);
	const res = await db.Sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
  logger.info('result', result);
	const result = {
    practiceId: res[0].practiceId,
    password: res[0].password
  };
  if (result) {
    const validPassword = encryption.comparePassword(password, result);
    logger.info('validpass', validPassword)
	  return validPassword;
  }
  throw new Error('FATA 3 Practice does not exist');
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

    if (existingUser) {
      throw new Error('User with this email exists');
    }

    const result = await User.build(practiceData).save();

    if (result) {
      defaultTiming.forEach(element => {
        const timingData = {
          practiceId: result.practiceId,
          day: element.day,
          from: element.from,
          to: element.to,
          closed: element.closed
        }
        const timing = Timing.build(timingData).save();
      });
      return result;
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
  },

}
