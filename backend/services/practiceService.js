
/* ********************************* Import Node Modules ********************************* */
const Sequelize = require('sequelize');
const Moment = require('moment');

/* ********************************* Import Local Modules ********************************* */
const {
  User, Service, Price, Timing, Slot, db, Booking
} = require('../dbconnection');

const min = new Date().setHours(0, 0, 0, 0);
const max = min + 2592000000;

module.exports = {
  registerServices: async (data) => {
    let result;
    const serviceData = {
      serviceName: data.serviceName,
      practiceId: data.practiceId
    }
    result = await Service.build(serviceData).save();

    if (result) {
      return { serviceId: result.get('serviceId') };
    }
    throw new Error('Error while registering service');
  },
  registerPrices: async (data) => {
    let result;
    const priceData = {
      service: data.service,
      practiceId: data.practiceId,
      price: data.price
    }
    result = await Price.build(priceData).save();
    if (result) {
      return { priceId: result.get('priceId') };
    }
    throw new Error('Error while registering price');
  },
  registerTimings: async (data) => {
    let result;
    const timingsData = {
      day: data.day,
      from: data.from,
      to: data.to,
      closed: data.closed,
      practiceId: data.practiceId
    }
    result = await Timing.build(timingsData).save();
    if (result) {
      return { timingId: result.get('timingId') };
    }
    throw new Error('Error while registering timing');
  },
  addSlot: async (data) => {
    let result;
    data.fromTime = Moment.utc(new Date(data.fromTime)).unix()*1000;
	  console.log(data.fromTime);
    const query = `SELECT "slotId" FROM "Slots" WHERE "practiceId"='${data.practiceId}' AND "serviceId"='${data.serviceId}' AND "fromTime"='${data.fromTime}'`;
    const res = await db.query(query, { type: Sequelize.QueryTypes.SELECT });
    if (!res[0]) {
      const slotData = {
        fromTime: data.fromTime,
        serviceId: data.serviceId,
        practiceId: data.practiceId,
        status: 'open'
      }
      result = await Slot.build(slotData).save();
      if (result) {
        return { slotId: result.get('slotId') };
      }
    }
    throw new Error('Slot for this practice mentioned service already exists for this time');
  },
  deleteSlot: async (data) => {
    let result;
    result = await Slot.destroy({
      where: {
        slotId: `${data.slotId}`,
        practiceId: `${data.practiceId}`,
        fromTime: `${data.fromTime}`
      }
    });
    if (result) {
      return result;
    }
    throw new Error('Slot not found');
  },
  cancelBooking: async (data) => {
    let result;
    let query = `UPDATE "Bookings" SET "status"='cancelled' WHERE "bookingId" = ${data.bookingId}`;
    result = await db.query(query, { type: Sequelize.QueryTypes.UPDATE });
    if (result) {
      let updateQuery = `UPDATE "Slots" SET "status"='open' WHERE "slotId"=${data.slotId}`;
      let updateResult = await db.query(updateQuery, { type: Sequelize.QueryTypes.UPDATE });
      if (updateResult) {
        return result;
      }
    }
    throw new Error('Booking not found');
  },
  updatePrice: async (data) => {
    let result;
    let query = ``;
    if (data.price && data.service) {
      query = `UPDATE "Prices" SET "service"='${data.service}' , "price"=${data.price} WHERE "practiceId"=${data.practiceId} AND "priceId"=${data.priceId}`;
    }
    else if (data.service) {
      query = `UPDATE "Prices" SET "service"='${data.service}' WHERE "practiceId"=${data.practiceId} AND "priceId"=${data.priceId}`;
    }
    else if (data.price) {
      query = `UPDATE "Prices" SET "price"=${data.price} WHERE "practiceId"=${data.practiceId} AND "priceId"=${data.priceId}`;
    }
    result = await db.query(query, { type: Sequelize.QueryTypes.UPDATE });
    if (result) {
      return result;
    }
    throw new Error('Price not found');
  },
  deletePrice: async (data) => {
    let result;
    result = await Price.destroy({
      where: {
        priceId: `${data.priceId}`,
        practiceId: `${data.practiceId}`
      }
    });
    if (result) {
      return result;
    }
    throw new Error('Price not found');
  },
  updateService: async (data) => {
    let result;
    let query = `UPDATE "Services" SET "serviceName"='${data.serviceName}' WHERE "practiceId"=${data.practiceId} AND "serviceId"=${data.serviceId}`;
    result = await db.query(query, { type: Sequelize.QueryTypes.UPDATE });
    if (result) {
      return result;
    }
    throw new Error('Service not found');
  },
  deleteService: async (data) => {
    let result = await Service.destroy({
      where: {
        serviceId: `${data.serviceId}`,
        practiceId: `${data.practiceId}`
      }
    });
    if (result) {
      return result;
    }
    throw new Error('Service not found');
  },
  updateTiming: async (data) => {
    let result;
    let query = ``;
    let query2;
    let res;
    if (data.closed === true || data.closed === false) {
      query = `UPDATE "Timings" SET "closed"='${data.closed}' WHERE "practiceId"='${data.practiceId}' AND "timingId"=${data.timingId}`;
      res = await db.query(query, { type: Sequelize.QueryTypes.UPDATE });
    } 
    if (res && !data.closed) {
      if (data.from && data.to) {
        query = `UPDATE "Timings" SET "from"='${data.from}' WHERE "practiceId"='${data.practiceId}' AND "timingId"=${data.timingId}`;
        query2 = `UPDATE "Timings" SET "to"='${data.to}' WHERE "practiceId"='${data.practiceId}' AND "timingId"=${data.timingId}`;
      }
      else if (data.from && !data.to) {
        query = `UPDATE "Timings" SET "to"='${data.to}' WHERE "practiceId"='${data.practiceId}' AND "timingId"=${data.timingId}`;
      }
      else if (data.to && !data.from) {
        query = `UPDATE "Timings" SET "to"='${data.to}', "from"='${data.from}' WHERE "practiceId"='${data.practiceId}' AND "timingId"=${data.timingId}`;
      }
    }
    result = await db.query(query, { type: Sequelize.QueryTypes.UPDATE });
    if(query2) {
      await db.query(query2, { type: Sequelize.QueryTypes.UPDATE });
    }
    if (result) {
      return result;
    }
    throw new Error('Timing not found');
  },
  deleteTiming: async (data) => {
    let result = await Timing.destroy({
      where: {
        timingId: `${data.timingId}`,
        practiceId: `${data.practiceId}`
      }
    });
    if (result) {
      return result;
    }
    throw new Error('Timing not found'); s
  },
  getBookingHistory: async (data) => {
    if (data.page && data.limit) {
      const { page, limit } = data;
      const offset = limit * (page - 1);
      const bookingData = await Booking.findAndCountAll({ where: { practiceId: data.id, serviceId: data.serviceId } })
      const pages = Math.ceil(bookingData.count / limit);
      const result = await Booking.findAll({
        limit,
        offset,
        raw: true,
        where: { practiceId: data.id, serviceId: data.serviceId },
        attributes: ['bookingId', 'slotId', 'firstName', 'email', 'mobileNumber', 'fromTime', 'status']
      });
      if (result) {
        const res = {
          result,
          count: bookingData.count,
          pages,
          order: [
            ['bookingId', 'DESC'],
          ],
        };
        return res;
      }
    } else {
      const allBookingsResult = await Booking.findAll({
        where: { practiceId: data.id, serviceId: data.serviceId },
        attributes: ['bookingId', 'firstName', 'email', 'mobileNumber', 'fromTime', 'status']
      });
      if(allBookingsResult) {
        return allBookingsResult;
      }
      throw new Error('Error while getting booking history');
    }
    throw new Error('Error while getting booking history');
  },
  getCalendarSlots: async (data) => {
    const query = `SELECT "slotId", "fromTime" from "Slots"
    WHERE "practiceId"=${data.id} AND "serviceId"=${data.serviceId} AND "status"='open'`;
    const result = await db.query(query, { type: Sequelize.QueryTypes.SELECT });
    if (result) {
      return result;
    }
    throw new Error('Error while getting calendar slots');
  },
  getCalendarBookings: async (data) => {
    const query = `SELECT "bookingId", "slotId", "firstName", "email", "mobileNumber", "additionalNotes", "fromTime" from "Bookings"
    WHERE "practiceId"=${data.id} AND "serviceId"=${data.serviceId} AND "status"='active' AND "fromTime" BETWEEN ${min} AND ${max}`;
    const result = await db.query(query, { type: Sequelize.QueryTypes.SELECT });
    if (result) {
      return result;
    }
    throw new Error('Error while getting calendar bookings');
  },
  getBooking: async (data) => {
    const query = `SELECT "bookingId", "slotId", "firstName", "email", "mobileNumber", "additionalNotes", "fromTime" from "Bookings"
    WHERE "practiceId"=${data.id} AND "serviceId"=${data.serviceId} AND "status"='active' AND "fromTime"=${data.fromTime}`;
    const result = await db.query(query, { type: Sequelize.QueryTypes.SELECT });
    if (result) {
      return result;
    }
    throw new Error('Error while getting booking');
  }
} 
