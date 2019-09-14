'use strict';
module.exports = (sequelize, DataTypes) => {
  const Doctor = sequelize.define('Doctor', {
    doctorId : {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    practiceId : DataTypes.INTEGER,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    serviceId: DataTypes.ARRAY(DataTypes.INTEGER)
  }, {});
  Doctor.associate = function(models) {
    // associations can be defined here
    Doctor.belongsTo(models.Service);
    Doctor.belongsTo(models.Practice);
  };
  return Doctor;
};