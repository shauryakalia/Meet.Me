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
    doctorId: DataTypes.INTEGER
  }, {});
  Slot.associate = function(models) {
    // associations can be defined heres
    Slot.belongsTo(models.Practice);
    Slot.belongsTo(models.Doctor);
  };
  return Slot;
};