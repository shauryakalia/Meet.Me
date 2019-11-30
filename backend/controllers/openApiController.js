/* eslint-disable max-len */
const Boom = require('boom');
const fs = require('fs');
const Path = require('path');
const mustache = require('mustache');
const sequelize = require('sequelize');

/* ********************************* Import Local Modules ********************************* */
const { logger } = require('../utils');
const { mailer } = require('../helpers');
const { openApiService } = require('../services');
const { db, User, Service, Booking } = require('../dbconnection');

let newBookingPatientTemplate;
let newBookingPracticeTemplate;

fs.readFile(`${__dirname}/../templates/newBookingPatient.html`, 'utf8', (err, fileData) => {
    if (err) newBookingPatientTemplate = '';
    else newBookingPatientTemplate = fileData;
    mustache.parse(newBookingPatientTemplate);
});

fs.readFile(`${__dirname}/../templates/newBookingPractice.html`, 'utf8', (err, fileData) => {
    if (err) newBookingPracticeTemplate = '';
    else newBookingPracticeTemplate = fileData;
    mustache.parse(newBookingPracticeTemplate);
});

module.exports = {
    booking: async (req, res, next) => {
        try {
            logger.info('Add Booking Request: ', req.body);
            const addBookingResult = await openApiService.booking(req.body);
            const service = await Service.findOne({ attributes: ['serviceName'], where: { practiceId: req.body.practiceId, serviceId: req.body.serviceId } });
            const practice = await User.findOne({ attributes: ['practiceEmail', 'practiceName', 'practiceAddress'], where: { practiceId: req.body.practiceId} });
            if (!addBookingResult) {
                next(Boom.conflict('Error while booking'));
            } else {
                mailer.sendMail({
                    email: req.body.email,
                    subject: 'Appointment Confirmed',
                    template: mustache.render(newBookingPatientTemplate, {
                        firstName: req.body.firstName, 
                        fromTime: new Date(req.body.fromTime),
                        serviceName : service.serviceName,
                        practiceName : practice.practiceName,
                        practiceAddress : practice.practiceAddress
                    }),
                });
                mailer.sendMail({
                    email: practice.practiceEmail,
                    subject: 'New Appointment',
                    template: mustache.render(newBookingPracticeTemplate, {
                        firstName: req.body.firstName, 
                        fromTime: new Date(req.body.fromTime),
                        email: req.body.email,
                        serviceName : service.serviceName,
                        mobileNumber: req.body.mobileNumber
                    }),
                });
                res.message = `Succesfully booked`;
                next();
            }
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    getPrices: async (req, res, next) => {
        try {
            logger.info('Get Prices Request: ', req.params);
            const getPricesResult = await openApiService.getPrices(req.params.id);
            if (!getPricesResult) {
                next(Boom.conflict('Error while getting prices'));
            }
            res.data = getPricesResult;
            next();
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    getServices: async (req, res, next) => {
        try {
            logger.info('Get Services Request: ', req.params);
            const getServicesResult = await openApiService.getServices(req.params.id);
            if (!getServicesResult) {
                next(Boom.conflict('Error while getting services'));
            }
            res.data = getServicesResult;
            next();
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    getTimings: async (req, res, next) => {
        try {
            logger.info('Get Timings Request: ', req.params);
            const getTimingsResult = await openApiService.getTimings(req.params.id);
            if (!getTimingsResult) {
                next(Boom.conflict('Error while getting timings'));
            }
            res.data = getTimingsResult;
            next();
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    getPracticeDetails: async (req, res, next) => {
        try {
            logger.info('Get Practice Details Request: ', req.params);
            const getPracticeDetailsResult = await openApiService.getPracticeDetails(req.params.id);
            if (!getPracticeDetailsResult) {
                next(Boom.conflict('Error while getting practice details'));
            }
            res.data = getPracticeDetailsResult[0];
            next();
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    getSlots: async (req, res, next) => {
        try {
            logger.info('Get Slots Request: ', req.params);
            req.params.date = req.query.date;
            const getSlotsResult = await openApiService.getSlots(req.params);
            if (!getSlotsResult) {
                next(Boom.conflict('Error while getting slots'));
            }
            let result = [];
            getSlotsResult.map(slot => {
                let newSlot = {
                    slotId : slot.slotId,
                    startDate : new Date(parseInt(slot.fromTime)),
                    endDate: new Date(parseInt(slot.fromTime)+1800000),
                };
                result.push(newSlot);
            });
            res.data = result;
            next();
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    }
}