
/* ********************************* Import Node Modules ********************************* */
const Sequelize = require('sequelize');

/* ********************************* Import Local Modules ********************************* */
const {
    User, Service, Price, Timing
  } = require('../dbconnection');

module.exports = {
    registerServices: async (data) => {
      let result;
      for(var service in data){
        const serviceData = {
          serviceName : service.serviceName,
          practiceId : service.practiceId
        }
        result = await Service.build(serviceData).save();
      }
      if(result){
          return { serviceId: result.get('serviceId') };
      }
      throw new Error('Error while registering service');
    },
    registerPrices: async (data) => {
      let result;
      for(var p in data){
        const priceData = {
          service : p.service,
          practiceId : p.practiceId,
          price : p.price
        }
        result = await Price.build(priceData).save();
      }
      if(result){
          return { priceId: result.get('priceId') };
      }
      throw new Error('Error while registering service'); 
    },
    registerTimings: async (data) => {
      let result;
      for(var timings in data){
        const timingsData = {
          day : timings.day,
          from : timings.from,
          to : timings.to,
          open : timings.open,
          practiceId : timings.practiceId
        }
        result = await Timing.build(timingsData).save();
      }
      if(result){
          return { timingId: result.get('timingId') };
      }
      throw new Error('Error while registering service');
    }
} 