
/** ********************** Require node modules ************************ */
const nodemailer = require('nodemailer');
const config = require('config');
const sgMail = require('@sendgrid/mail');


/** ********************** Require local modules ************************ */
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { logger } = require('../utils');

async function sendMail(details) {
  try {
    const msg = {
      to: details.email,
      from: 'contact.app.meetme@gmail.com',
      subject: details.subject,
      html: details.template
    }
    sgMail.send(msg);
  } catch (error) {
    logger.error('Send mail failed: ', error);
    return error;
  }
}

module.exports = {
  sendMail,
};
