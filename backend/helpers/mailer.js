/** ********************** Require node modules ************************ */
const postmark = require('postmark');
const config = require('config');

/** ********************** Require local modules ************************ */
const { logger } = require('../utils');

// Initialize Postmark client with server API token
const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN);

async function sendMail(details) {
  try {
    const emailData = {
      From: process.env.POSTMARK_FROM_EMAIL || 'contact@broadwaydentalstudio.co.uk',
      To: details.email,
      Subject: details.subject,
      HtmlBody: details.template
    };

    const response = await client.sendEmail(emailData);
    logger.info('Email sent successfully:', response);
    return response;
  } catch (error) {
    logger.error('Send mail failed: ', error);
    throw error; // Re-throw to let calling code handle appropriately
  }
}

module.exports = {
  sendMail,
};
