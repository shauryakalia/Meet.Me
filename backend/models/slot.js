'use strict';
module.exports = (sequelize, DataTypes) => {
  const Slot = sequelize.define('Slot', {
    slotId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fromTime: DataTypes.BIGINT,
    practiceId: DataTypes.INTEGER,
    serviceId: DataTypes.INTEGER
  }, {});
  Slot.associate = function(models) {
    // associations can be defined heres
    Slot.belongsTo(models.User);
    Slot.belongsTo(models.Service);
  };
  return Slot;
};