/* ********************************* Import Node Modules ********************************* */

/* ********************************* Import Local Modules ********************************* */
const {
  
} = require('./controllers');
const { validator, authenticator } = require('./middlewares');
const { logger } = require('./utils');

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.send({ status: true, message: req.csrfToken() });
    
        logger.info('csrf token recieved');
      });

      // staff apis
      app.post('/login', validator, userController.login);
      
      //patient apis
}