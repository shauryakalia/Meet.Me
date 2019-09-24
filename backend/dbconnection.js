const config = require('config');

const Sequelize = require('sequelize');
const userModel = require('./models/user');
const serviceModel = require('./models/service');
const priceModel = require('./models/price');
const timingModel = require('./models/timing');
const bookingModel = require('./models/booking');
const slotModel = require('./models/slot');

const { logger } = require('./utils');

const dbConfig = config.get('dbConfig');
const db = new Sequelize(
  `${dbConfig.dialect}://${dbConfig.username}:${dbConfig.password
  }@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`, {
    logging: false,
  },
);

const User = userModel(db, Sequelize);
const Service = serviceModel(db, Sequelize);
const Price = priceModel(db, Sequelize);
const Timing = timingModel(db, Sequelize);
const Booking = bookingModel(db, Sequelize);
const Slot = slotModel(db, Sequelize);

db
  .authenticate()
  .then(() => {
    logger.info('DB connection has been established successfully.');
  })
  .catch((err) => {
    logger.error('Unable to connect to the database:', err);
  });

module.exports = {
    db,
    User,
    Service,
    Price,
    Timing,
    Booking,
    Slot
}