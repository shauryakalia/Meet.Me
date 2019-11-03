/* eslint-disable max-len */
const Boom = require('boom');
const fs = require('fs');
const Path = require('path');
const _ = require('lodash');
const sequelize = require('sequelize');

/* ********************************* Import Local Modules ********************************* */
const { logger } = require('../utils');
const { mailer } = require('../helpers');
const { openApiService } = require('../services');
const { db } = require('../dbconnection'); 

module.exports = {
    booking: async(req,res,next) => {
        try{
            logger.info('Add Booking Request: ', req.body);
            const addBookingResult = await openApiService.booking(req.body);
            if (!addBookingResult) {
                next(Boom.conflict('Error while booking'));
            }
            res.message = `Succesfully booked`;
            next();
        }catch(err){
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    },
}