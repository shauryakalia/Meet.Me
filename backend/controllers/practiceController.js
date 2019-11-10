/* eslint-disable max-len */
const Boom = require('boom');
const fs = require('fs');
const Path = require('path');
const _ = require('lodash');
const sequelize = require('sequelize');
const mustache = require('mustache');

/* ********************************* Import Local Modules ********************************* */
const { logger } = require('../utils');
const { mailer } = require('../helpers');
const { practiceService } = require('../services');
const { db, User, Service, Booking } = require('../dbconnection');

let cancelBookingPracticeTemplate;

fs.readFile(`${__dirname}/../templates/cancelBookingPractice.html`, 'utf8', (err, fileData) => {
    if (err) cancelBookingPracticeTemplate = '';
    else cancelBookingPracticeTemplate = fileData;
    mustache.parse(cancelBookingPracticeTemplate);
});

module.exports = {
    registerServices: async (req, res, next) => {
        try {
            logger.info('Register Services Request: ', req.body);
            req.body.practiceId = parseInt(req.params.id, 10);
            const registerServicesResult = await practiceService.registerServices(req.body);
            if (!registerServicesResult) {
                next(Boom.conflict('Error while registering services'));
            }
            res.message = `Succesfully registered service`;
            next();
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    registerPrices: async (req, res, next) => {
        try {
            logger.info('Register Prices Request: ', req.body);
            req.body.practiceId = parseInt(req.params.id, 10);
            const registerPricesResult = await practiceService.registerPrices(req.body);
            if (!registerPricesResult) {
                next(Boom.conflict('Error while registering prices'));
            }
            res.message = `Succesfully registered Price`;
            next();
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    registerTimings: async (req, res, next) => {
        try {
            logger.info('Register Timings Request: ', req.body);
            req.body.practiceId = parseInt(req.params.id, 10);
            const registerTimingsResult = await practiceService.registerTimings(req.body);
            if (!registerTimingsResult) {
                next(Boom.conflict('Error while registering timings'));
            }
            res.message = `Succesfully registered Timing`;
            next();
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    addSlot: async (req, res, next) => {
        try {
            logger.info('Add Slot Request: ', req.body);
            req.body.practiceId = parseInt(req.params.id, 10);
            const addSlotResult = await practiceService.addSlot(req.body);
            if (!addSlotResult) {
                next(Boom.conflict('Error while adding slot'));
            }
            res.message = 'slot added succesfully';
            next();
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    deleteSlot: async (req, res, next) => {
        try {
            logger.info('Delete Slot Request: ', req.body);
            req.body.practiceId = parseInt(req.params.id, 10);
            const deleteSlotResult = await practiceService.deleteSlot(req.body);
            if (!deleteSlotResult) {
                next(Boom.conflict('Error while adding slot'));
            }
            res.message = 'slot deleted succesfully';
            next();
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    cancelBooking: async (req, res, next) => {
        try {
            logger.info('Cancel Booking Request ', req.body);
            req.body.practiceId = parseInt(req.params.id, 10);
            const cancelBookingResult = await practiceService.cancelBooking(req.body);
            const booking = await Booking.findOne({ attributes: ['firstName', 'fromTime', 'serviceId'], where: { practiceId: req.body.practiceId, bookingId: req.body.bookingId } });
            const service = await Service.findOne({ attributes: ['serviceName'], where: { practiceId: req.body.practiceId, serviceId: booking.serviceId } });
            const practice = await User.findOne({ attributes: ['practiceEmail'], where: { practiceId: req.body.practiceId} });
            if (!cancelBookingResult) {
                next(Boom.conflict('Error while adding slot'));
            } else {
                mailer.sendMail({
                    email: practice.practiceEmail,
                    subject: 'Appointment Cancellation',
                    template: mustache.render(cancelBookingPracticeTemplate, {
                        firstName: booking.firstName, 
                        fromTime: new Date(booking.fromTime),
                        serviceName : service.serviceName
                    }),
                });
                res.message = 'booking has been cancelled succesfully';
                next();
            }
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    updatePrice: async (req, res, next) => {
        try {
            logger.info('Update Price Request', req.body);
            req.body.practiceId = parseInt(req.params.id, 10);
            const updatePriceResult = await practiceService.updatePrice(req.body);
            if (!updatePriceResult) {
                next(Boom.conflict('Error while updating price'));
            }
            res.message = 'Price updated succesfully';
            next();
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    deletePrice: async (req, res, next) => {
        try {
            logger.info('Delete Price Request', req.body);
            req.body.practiceId = parseInt(req.params.id, 10);
            const deletePriceResult = await practiceService.deletePrice(req.body);
            if (!deletePriceResult) {
                next(Boom.conflict('Error while deleting price'));
            }
            res.message = 'Price deleted succesfully';
            next();
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    updateService: async (req, res, next) => {
        try {
            logger.info('Update Service Request', req.body);
            req.body.practiceId = parseInt(req.params.id, 10);
            const updateServiceResult = await practiceService.updateService(req.body);
            if (!updateServiceResult) {
                next(Boom.conflict('Error while updating price'));
            }
            res.message = 'Service updated succesfully';
            next();
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    deleteService: async (req, res, next) => {
        try {
            logger.info('Delete Service Request', req.body);
            req.body.practiceId = parseInt(req.params.id, 10);
            const deleteServiceResult = await practiceService.deleteService(req.body);
            if (!deleteServiceResult) {
                next(Boom.conflict('Error while deleting price'));
            }
            res.message = 'Service deleted succesfully';
            next();
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    updateTiming: async (req, res, next) => {
        try {
            logger.info('Update Timings Request', req.body);
            req.body.practiceId = parseInt(req.params.id, 10);
            const updateTimingsResult = await practiceService.updateTiming(req.body);
            if (!updateTimingsResult) {
                next(Boom.conflict('Error while updating timing'));
            }
            res.message = 'Timing updated succesfully';
            next();
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    deleteTiming: async (req, res, next) => {
        try {
            logger.info('Delete Timing Request', req.body);
            req.body.practiceId = parseInt(req.params.id, 10);
            const deleteTimingResult = await practiceService.deleteTiming(req.body);
            if (!deleteTimingResult) {
                next(Boom.conflict('Error while deleting Timing'));
            }
            res.message = 'Timing deleted succesfully';
            next();
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    getBookingHistory: async (req, res, next) => {
        try {
            logger.info('Get Booking History Request', req.params);
            req.params.page = req.query.page;
            req.params.limit = req.query.limit;
            const getBookingHistoryResult = await practiceService.getBookingHistory(req.params);
            if (!getBookingHistoryResult) {
                next(Boom.conflict('Error while getting booking history'));
            }
            res.data = getBookingHistoryResult;
            next();
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    getCalendarSlots: async (req, res, next) => {
        try {
            logger.info('Get Calendar Slots Request', req.params);
            const getCalendarSlotsResult = await practiceService.getCalendarSlots(req.params);
            if (!getCalendarSlotsResult) {
                next(Boom.conflict('Error while getting calendar slots'));
            }
            res.data = getCalendarSlotsResult;
            next();
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    getCalendarBookings: async (req, res, next) => {
        try {
            logger.info('Get Calendar Bookings Request', req.params);
            const getCalendarBookingsResult = await practiceService.getCalendarBookings(req.params);
            if (!getCalendarBookingsResult) {
                next(Boom.conflict('Error while getting calendar bookings'));
            }
            res.data = getCalendarBookingsResult;
            next();
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    }
}
