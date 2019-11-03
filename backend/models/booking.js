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
    mobileNumber: DataTypes.STRING,
    serviceId: DataTypes.INTEGER,
    practiceId: DataTypes.INTEGER,
    additionalNotes: DataTypes.STRING,
    fromTime: DataTypes.BIGINT
  }, {});
  Booking.associate = function(models) {
    // associations can be defined here
    Booking.belongsTo(models.User);
    Booking.belongsTo(models.Service);
  };
  return Booking;
};