
/** ********************** Require node modules ************************ */
const nodemailer = require('nodemailer');
const config = require('config');


/** ********************** Require local modules ************************ */
const { apiKey, email, password } = config.get('General');
const { logger } = require('../utils');

async function sendMail(details) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false, // true for 465, false for other ports
      tls: true,
      auth: {
        user: apiKey,
        pass: password,
      },
    });
    const mailOptions = {
      from: email,
      to: details.email,
      subject: details.subject,
      html: details.template,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    logger.error('Send mail failed: ', error);
    return error;
  }
}

module.exports = {
  sendMail,
};
