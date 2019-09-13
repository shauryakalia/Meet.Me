'use strict';
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    serviceId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    serviceName: DataTypes.STRING,
    practiceId:  DataTypes.INTEGER
  }, {});
  Service.associate = function(models) {
    // associations can be defined here
  };
  return Service;
};