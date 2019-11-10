/* eslint-disable max-len */
const Boom = require('boom');
const fs = require('fs');
const Path = require('path');
const _ = require('lodash');
const sequelize = require('sequelize');

/* ********************************* Import Local Modules ********************************* */
const { logger } = require('../utils');
const { authentication, mailer } = require('../helpers');
const { userService } = require('../services');
const { db } = require('../dbconnection');

module.exports = {
    registerPractice: async (req, res, next) => {
        try {
            logger.info('Register Practice Request: ', req.body);
            const registerPracticeResult = await userService.registerPractice(req.body);
            if (!registerPracticeResult) {
                next(Boom.conflict('Error while adding User'));
            }
            res.data = registerPracticeResult.practiceId;
            next();
        } catch (err) {
            logger.error(err);
            if (err.message === 'User with this email exists') {
                next(Boom.conflict('User with this email exists'));
            } else {
                next(Boom.conflict('Something went wrong'));
            }
        }
    },
    login: async (req, res, next) => {
        try {
            logger.info('Login Request: ', req.body);
            const loginResult = await userService.login(req.body);
            if (loginResult) {
                const token = await authentication.createToken(loginResult);
                const responseData = {
                    token,
                    email: loginResult.practiceEmail,
                    userId: loginResult.practiceId,
                };
                res.data = responseData;
                next();
            } else {
                next(Boom.notFound('User does not exist'));
            }
        } catch (err) {
            logger.error(err);
            next(Boom.conflict('Something went wrong'));
        }
    }
}