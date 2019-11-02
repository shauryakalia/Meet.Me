
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
  '/practice/:id/deleteSlot/:slotId': {
    body: JOI.object().keys({
      fromTime: JOI.number().required(),
    }),
    params: JOI.object().keys({
      id: JOI.number().required(),
      slotId: JOI.number().required(),
    }),
  },
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