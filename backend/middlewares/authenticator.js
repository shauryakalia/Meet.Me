const Boom = require('boom');

/* ********************* Require Local modules ******************* */
const { authentication } = require('../helpers');
const { logger } = require('../utils');

/* **************** Middleware use for verification of the Api *************************** */
module.exports = (req, res, next) => {
  const token = req.body.token || req.params.token || req.headers['x-access-token'];
  const id = parseInt(req.body.id, 10) || parseInt(req.params.id, 10);
  if (token) {
    authentication.authenticateUser(token)
      .then((decode) => {
        if (decode.user.userId === id) {
          req.body.userRole = decode.user.userRole;
          next();
        } else {
          next(Boom.unauthorized('invalid user'));
        }
      })
      .catch((error) => {
        logger.error('Error while checking token: Invalid token', error);
        next(Boom.unauthorized('invalid access-token'));
      });
  } else {
    logger.error('Error while checking token: No Token Provided');
    next(Boom.unauthorized('No token provided'));
  }
};
