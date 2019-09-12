'use strict';
module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    firstName: DataTypes.STRING,
    email: DataTypes.STRING,
    mobileNumber: DataTypes.INTEGER,
    service : DataTypes.STRING,
    additionalNotes : DataTypes.STRING,
    doctorId : DataTypes.INTEGER,
    toTime : DataTypes.BIGINT,
    fromTime : DataTypes.BIGINT
  }, {});
  Booking.associate = function(models) {
    // associations can be defined here
  };
  return Booking;
};