
/* ********************************* Import Node Modules ********************************* */
const Sequelize = require('sequelize');

/* ********************************* Import Local Modules ********************************* */
const {
    User, Service, Price, Timing
  } = require('../dbconnection');

module.exports = {
    registerServices: async (data) => {
      let result;
      const serviceData = {
          serviceName : data.serviceName,
          practiceId : data.practiceId
      }
      result = await Service.build(serviceData).save();
      
      if(result){
          return { serviceId: result.get('serviceId') };
      }
      throw new Error('Error while registering service');
    },
    registerPrices: async (data) => {
      let result;
        const priceData = {
          service : data.service,
          practiceId : data.practiceId,
          price : data.price
        }
        result = await Price.build(priceData).save();
      if(result){
          return { priceId: result.get('priceId') };
      }
      throw new Error('Error while registering price'); 
    },
    registerTimings: async (data) => {
      let result;
        const timingsData = {
          day : data.day,
          from : data.from,
          to : data.to,
          open : data.open,
          practiceId : data.practiceId
        }
        result = await Timing.build(timingsData).save();
      if(result){
          return { timingId: result.get('timingId') };
      }
      throw new Error('Error while registering timing');
    },
    addSlot: async (data) => {
      let result;
      const slotData = {
        fromTime : data.fromTime,
        serviceId : data.serviceId,
        practiceId : data.practiceId
      }
      result = await Slot.build(slotData).save();
      if(result){
        return { slotId: result.get('slotId') };
      }
      throw new Error('Error while adding slot');
    }

} 