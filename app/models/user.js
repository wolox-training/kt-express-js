'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('users', {
    name: {
      type: DataTypes.STRING, 
      allowNull: false,
      notEmpty: true
    },
    lastName: {
      type: DataTypes.STRING, 
      allowNull: false,
      notEmpty: true
    },
    password: {
      type: DataTypes.STRING, 
      isAlphanumeric: true,
      allowNull:false,
      notEmpty: true,
      validate: {
        len: {
          args: [8, 255],
          msg: 'Passwords must contain at least 8 characters.'
        }
      }
    },
    email:{
      type: DataTypes.STRING, 
      isEmail: true,
      allowNull:false,
      unique:true,
      notEmpty: true,
      validate: {
        woloxMail(value) {
          if (!value.endsWith('@wolox.com.ar') && !value.endsWith('@wolox.com')){
            throw new Error('The email provided is not a valid Wolox email.');
          }
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
    },
    hooks: {
      afterValidate: (user, options) => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
      }
    }
  });
  return user;
};

