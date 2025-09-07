/** ********************** Require node modules ************************ */
const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');
const config = require('config');

/** ********************** Require local modules ************************ */
const { logger } = require('../utils');

// Initialize MailerSend with API key
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

async function sendMail(details) {
  try {
    const sentFrom = new Sender('contact.app.meetme@gmail.com', 'Meet.Me App');
    const recipients = [new Recipient(details.email, 'User')];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(details.subject)
      .setHtml(details.template);

    const response = await mailerSend.email.send(emailParams);
    return response;
  } catch (error) {
    logger.error('Send mail failed: ', error);
    return error;
  }
}

module.exports = {
  sendMail,
};
