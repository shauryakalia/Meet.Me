
/* ********************************* Import Node Modules ********************************* */
const Sequelize = require('sequelize');

/* ********************************* Import Local Modules ********************************* */
const {
    User, Service, Price, Timing, Slot, db, Booking
} = require('../dbconnection');

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
                return { bookingId: result.get('bookingId') };
            }
        }
        throw new Error('Error while adding booking');
    },
    getPrices: async (data) => {
        const result = await Price.findAll({ where: { practiceId: data }, attributes: ['priceId', 'service', 'price'] });
        if(result) {
            return result;
        }
        throw new Error('Error while getting prices');
	},
	getServices: async (data) => {
		const result = await Service.findAll({ where: { practiceId: data }, attributes: ['serviceId', 'serviceName'] });
        if(result) {
            return result;
        }
        throw new Error('Error while getting services');
	}
}