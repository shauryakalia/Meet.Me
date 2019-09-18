/* ********************************* Import Node Modules ********************************* */

/* ********************************* Import Local Modules ********************************* */
const {
    userController
} = require('./controllers');
const { validator, authenticator } = require('./middlewares');
const { logger } = require('./utils');

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.send({ status: true, message: req.csrfToken() });
    
        logger.info('csrf token recieved');
      });

      // user apis
      app.post('/registerPractice', validator, userController.registerPractice);
      
      app.post('/login', validator, userController.login);

      // staff-practice apis
      app.post('/practice/:id/addServiceDoctor',authenticator, validator, userController.addServiceDoctor);
      
      // patient apis
}