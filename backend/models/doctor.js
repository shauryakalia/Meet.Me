'use strict';
module.exports = (sequelize, DataTypes) => {
  const Doctor = sequelize.define('Doctor', {
    doctorID : {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    serviceId: DataTypes.ARRAY(DataTypes.INTEGER)
  }, {});
  Doctor.associate = function(models) {
    // associations can be defined here
  };
  return Doctor;
};