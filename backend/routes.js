/* ********************************* Import Node Modules ********************************* */

/* ********************************* Import Local Modules ********************************* */
const {
    userController, practiceController, openApiController
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
    app.post('/practice/:id/registerServices', authenticator, validator, practiceController.registerServices);

    app.post('/practice/:id/registerPrices', authenticator, validator, practiceController.registerPrices);

    app.post('/practice/:id/registerTimings', authenticator, validator, practiceController.registerTimings);

    app.post('/practice/:id/addSlot', authenticator, validator, practiceController.addSlot);

    app.post('/practice/:id/deleteSlot', authenticator, validator, practiceController.deleteSlot);

    app.post('/practice/:id/cancelBooking', authenticator, validator, practiceController.cancelBooking);

    app.post('/practice/:id/updatePrice', authenticator, validator, practiceController.updatePrice);

	app.post('/practice/:id/deletePrice', authenticator, validator, practiceController.deletePrice);

	app.post('/practice/:id/updateService', authenticator, validator, practiceController.updateService);

	app.post('/practice/:id/deleteService', authenticator, validator, practiceController.deleteService);

	app.post('/practice/:id/updateTiming', authenticator, validator, practiceController.updateTiming);

	app.post('/practice/:id/deleteTiming', authenticator, validator, practiceController.deleteTiming);
	  
    // open apis
    app.post('/booking', validator, openApiController.booking);

	app.get('/getPrices/:id', validator, openApiController.getPrices);
	
	app.get('/getServices/:id', validator, openApiController.getServices);

    app.get('/getTimings/:id', validator, openApiController.getTimings);
    
    app.get('/getPracticeDetails/:id', validator ,openApiController.getPracticeDetails);

    //app.get('/getSlots', validator, openApiController.getAllSlots);
}