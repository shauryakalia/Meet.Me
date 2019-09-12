'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    practiceEmail: DataTypes.STRING,
    password: DataTypes.STRING,
    practiceName : DataTypes.STRING,
    yourName : DataTypes.STRING,
    yourRole : DataTypes.STRING,
    practiceAddress : DataTypes.STRING,
    practiceZipcode : DataTypes.INTEGER,
    practicePhoneNumber : DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};