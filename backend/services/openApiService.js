
/* ********************************* Import Node Modules ********************************* */
const Sequelize = require('sequelize');

/* ********************************* Import Local Modules ********************************* */
const {
    User, Service, Price, Timing, Slot, db, Booking
} = require('../dbconnection');

const min = new Date().setHours(0, 0, 0, 0);
const max = min + 2592000000;

module.exports = {
    booking: async (data) => {
        let result;
        const bookingData = {
            firstName: data.firstName,
            email: data.email,
            mobileNumber: data.mobileNumber,
            serviceId: data.serviceId,
            practiceId: data.practiceId,
            additionalNotes: data.additionalNotes,
            fromTime: data.fromTime,
            status: 'active',
            slotId: data.slotId
        }
        result = await Booking.build(bookingData).save();
        if (result) {
            let updateSlotQuery = `UPDATE "Slots" SET "status"='booked' WHERE "slotId"=${data.slotId}`;
            const updateResult = await db.query(updateSlotQuery, { type: Sequelize.QueryTypes.UPDATE });
            if (updateResult) {
                return result;
            }
        }
        throw new Error('Error while adding booking');
    },
    getPrices: async (data) => {
        const result = await Price.findAll({ where: { practiceId: data }, attributes: ['priceId', 'service', 'price'] });
        if (result) {
            return result;
        }
        throw new Error('Error while getting prices');
    },
    getServices: async (data) => {
        const result = await Service.findAll({ where: { practiceId: data }, attributes: ['serviceId', 'serviceName'] });
        if (result) {
            return result;
        }
        throw new Error('Error while getting services');
    },
    getTimings: async (data) => {
        const result = await Timing.findAll({ where: { practiceId: data }, attributes: ['timingId', 'day', 'from', 'to', 'closed'] });
        if (result) {
            return result;
        }
        throw new Error('Error while getting timings');
    },
    getPracticeDetails: async (data) => {
        const result = await User.findAll({ where: { practiceId: data }, attributes: ['practiceId', 'practiceName', 'yourName', 'practiceEmail', 'practiceAddress', 'practiceZipcode', 'practicePhoneNumber'] });
        if (result) {
            return result;
        }
        throw new Error('Error while getting practice details');
    },
    getSlots: async (data) => {
        let date = new Date(data.date).setHours(0, 0, 0, 0);
        const from = new Date(date).getTime();
        const to = min + 86400000;
        const query = `SELECT "slotId", "fromTime" from "Slots"
        WHERE "practiceId"=${data.id} AND "serviceId"=${data.serviceId} AND "status"='open' AND "fromTime" BETWEEN ${from} AND ${to}`;
        const result = await db.query(query, { type: Sequelize.QueryTypes.SELECT });
        if (result) {
            return result;
        }
        throw new Error('Error while getting slots');
    }
}