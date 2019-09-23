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
            req.body.practiceId=req.params.id;
            const registerServicesResult = await practiceService.registerServices(req.body);
            if (!registerServicesResult) {
            next(Boom.conflict('Error while registering services'));
            }
            next();
        }catch(e){
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    registerPrices: async (req,res,next)  => {
        try{
            logger.info('Register Prices Request: ', req.body);
            req.body.practiceId=req.params.id;
            const registerPricesResult = await practiceService.registerPrices(req.body);
            if (!registerPricesResult) {
            next(Boom.conflict('Error while registering prices'));
            }
            next();
        } catch (e) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
    registerTimings: async(req,res,next) => {
        try{
            logger.info('Register Timings Request: ', req.body);
            req.body.practiceId=req.params.id;
            const registerTimingsResult = await practiceService.registerTimings(req.body);
            if (!registerTimingsResult) {
            next(Boom.conflict('Error while registering timings'));
            }
            next();
        } catch (e) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));    
        }
    }
}