'use strict';

const bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
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
      allowNull:false,
      unique:true,
      notEmpty: true,
      isUnique: function(value, next) {

        user.find({where: {email: value}, attributes: ['id']})
          .done(function(error, user) {
            if (error){
              // Some unexpected error occured with the find method.
              return next(error);
            }
            if (user){
              // We found a user with this email address.
              // Pass the error to the next method.
              return next('Email address already in use!');
            }
            // If we got this far, the email address hasn't been used yet.
            // Call next with no arguments when validation is successful.
            next();
          });

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
        user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      }
    }
  });
  return user;
};

