
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
            fromTime: data.fromTime
        }
        result = await Booking.build(bookingData).save();
        if (result) {
            return { bookingId: result.get('bookingId') };
        }
        throw new Error('Error while adding booking');
    },
}