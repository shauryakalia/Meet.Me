/* eslint-disable max-len */
const Boom = require('boom');
const fs = require('fs');
const Path = require('path');
const _ = require('lodash');
const sequelize = require('sequelize');

/* ********************************* Import Local Modules ********************************* */
const { logger } = require('../utils');
const { mailer } = require('../helpers');
const { practiceService } = require('../services');
const { db } = require('../dbconnection');

module.exports = {
    registerServices: async (req,res,next) => {
        try{
            logger.info('Register Services Request: ', req.body);
            req.body.practiceId= parseInt(req.params.id,10);
            const registerServicesResult = await practiceService.registerServices(req.body);
            if (!registerServicesResult) {
            next(Boom.conflict('Error while registering services'));
            }
            res.message = `Succesfully registered service`;
            next();
        }catch(err){
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    registerPrices: async (req,res,next)  => {
        try{
            logger.info('Register Prices Request: ', req.body);
            req.body.practiceId= parseInt(req.params.id,10);
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
    registerTimings: async(req,res,next) => {
        try{
            logger.info('Register Timings Request: ', req.body);
            req.body.practiceId=parseInt(req.params.id,10);
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
    addSlot: async(req,res,next) => {
        try {
            logger.info('Add Slot Request: ', req.body);
            req.body.practiceId=parseInt(req.params.id,10);
            const addSlotResult = await practiceService.addSlot(req.body);
            if (!addSlotResult) {
            next(Boom.conflict('Error while adding slot'));
            }
            next();
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    }
}
