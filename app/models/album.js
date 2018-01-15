'use strict';

const User = require('../models').users;

module.exports = (sequelize, DataTypes) => {
  var album = sequelize.define('albums', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      notEmpty: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      notEmpty: true
    },
    title: {
      type: DataTypes.STRING, 
      allowNull: false,
      notEmpty: true
    }
  });
  return album;
};