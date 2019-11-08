
/** ********************** Require Node modules ********************* */
const JOI = require('joi');
const Boom = require('boom');

/** ********************** Require Local modules ********************* */
const { logger } = require('../utils');

const schema = {
  // user apis
  '/login': {
    body: JOI.object().keys({
      practiceEmail: JOI.string().email().required(),
      password: JOI.string().required(),
    }),
    params: null,
  },
  '/registerPractice': {
    body: JOI.object().keys({
      practiceEmail: JOI.string().email().required(),
      password: JOI.string().required(),
      practiceName: JOI.string().required(),
      yourName: JOI.string().required(),
      yourRole: JOI.string().required(),
      practiceAddress: JOI.string().required(),
      practiceZipcode: JOI.string().required(),
      practicePhoneNumber: JOI.string().required()
    }),
    params: null,
  },
  '/practice/:id/registerServices': {
    body: JOI.object().keys({
      serviceName: JOI.string().required()
    }),
    params: JOI.object().keys({
      id: JOI.number().required(),
    }),
  },
  '/practice/:id/registerPrices': {
    body: JOI.object().keys({
      service: JOI.string().required(),
      price: JOI.number().required()
    }),
    params: JOI.object().keys({
      id: JOI.number().required(),
    }),
  },
  '/practice/:id/registerTimings': {
    body: JOI.object().keys({
      day: JOI.string().required(),
      from: JOI.string().required(),
      to: JOI.string().required(),
      open: JOI.number().required()
    }),
    params: JOI.object().keys({
      id: JOI.number().required(),
    }),
  },
  '/practice/:id/addSlot': {
    body: JOI.object().keys({
      serviceId: JOI.number().required(),
      fromTime: JOI.number().required()
    }),
    params: JOI.object().keys({
      id: JOI.number().required(),
    }),
  },
  '/practice/:id/deleteSlot': {
    body: JOI.object().keys({
      fromTime: JOI.number().required(),
      slotId: JOI.number().required(),
    }),
    params: JOI.object().keys({
      id: JOI.number().required(),
    }),
  },
  '/practice/:id/cancelBooking': {
    body: JOI.object().keys({
      bookingId: JOI.number().required(),
      slotId: JOI.number().required()
    }),
    params: JOI.object().keys({
      id: JOI.number().required(),
    }),
  },
  '/practice/:id/updatePrice': {
    body: JOI.object().keys({
      price: JOI.number(),
      service: JOI.string(),
      priceId: JOI.number().required()
    }),
    params: JOI.object().keys({
      id: JOI.number().required(),
    }),
  },
  '/practice/:id/deletePrice': {
    body: JOI.object().keys({
      priceId: JOI.number().required()
    }),
    params: JOI.object().keys({
      id: JOI.number().required(),
    }),
  },
  '/practice/:id/updateService': {
    body: JOI.object().keys({
      serviceName: JOI.string().required(),
      serviceId: JOI.number().required()
    }),
    params: JOI.object().keys({
      id: JOI.number().required(),
    }),
  },
  '/practice/:id/deleteService': {
    body: JOI.object().keys({
      serviceId: JOI.number().required()
    }),
    params: JOI.object().keys({
      id: JOI.number().required(),
    }),
  },
  '/practice/:id/updateTiming': {
    body: JOI.object().keys({
      from: JOI.string(),
      to: JOI.string(),
      open: JOI.number(),
      timingId: JOI.number().required()
    }),
    params: JOI.object().keys({
      id: JOI.number().required(),
    }),
  },
  '/practice/:id/deleteTiming': {
    body: JOI.object().keys({
      timingId: JOI.number().required()
    }),
    params: JOI.object().keys({
      id: JOI.number().required(),
    }),
  },
  '/booking': {
    body: JOI.object().keys({
      firstName: JOI.string().required(),
      email: JOI.string().required(),
      mobileNumber: JOI.number().required(),
      serviceId: JOI.number().required(),
      practiceId: JOI.number().required(),
      additionalNotes: JOI.string().required(),
      fromTime: JOI.number().required(),
      status: JOI.string().valid('active', 'cancelled'),
      slotId: JOI.number().required()
    }),
    params: null,
  },
  '/getPrices/:id': {
    body: null,
    params: JOI.object().keys({
      id: JOI.number().required(),
    }),
  },
  '/getServices/:id': {
    body: null,
    params: JOI.object().keys({
      id: JOI.number().required(),
    }),
  },
  '/getTimings/:id': {
    body: null,
    params: JOI.object().keys({
      id: JOI.number().required(),
    }),
  },
  '/getPracticeDetails/:id': {
    body: null,
    params: JOI.object().keys({
      id: JOI.number().required(),
    }),
  }
};

module.exports = async (req, res, next) => {
  try {
    if (schema[req.route.path].body) {
      // Body validation
      await JOI.validate(req.body, schema[req.route.path].body);
    }
    if (schema[req.route.path].params) {
      // Param validation
      await JOI.validate(req.params, schema[req.route.path].params);
    }
    if (schema[req.route.path].query) {
      await JOI.validate(req.query, schema[req.route.path].query);
    }
    next();
  } catch (err) {
    logger.error('Error in API validation', err.details[0].message);
    next(Boom.badData(err.details[0].message));
  }
};