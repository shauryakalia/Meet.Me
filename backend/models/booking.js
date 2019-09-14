'use strict';
module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    bookingId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: DataTypes.STRING,
    email: DataTypes.STRING,
    mobileNumber: DataTypes.INTEGER,
    serviceId : DataTypes.STRING,
    additionalNotes : DataTypes.STRING,
    doctorId : DataTypes.INTEGER,
    fromTime : DataTypes.BIGINT
  }, {});
  Booking.associate = function(models) {
    // associations can be defined here
    Booking.belongsTo(models.Practice);
    Booking.belongsTo(models.Practice);
  };
  return Booking;
};