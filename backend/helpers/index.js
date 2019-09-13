
/** ********************** Require Local modules ********************* */
const authentication = require('./authentication');
const encryption = require('./encryption');
const mailer = require('./mailer');
const passwordGenerator = require('./passwordGenerator');

module.exports = {
  authentication,
  encryption,
  mailer,
  passwordGenerator,
};
