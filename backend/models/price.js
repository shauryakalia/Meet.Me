'use strict';
module.exports = (sequelize, DataTypes) => {
  const Price = sequelize.define('Price', {
    priceId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    serviceName: DataTypes.STRING,
    practiceId: DataTypes.INTEGER,
    price: DataTypes.FLOAT
  }, {});
  Price.associate = function(models) {
    // associations can be defined here
    Price.belongsTo(models.User);
  };
  return Price;
};