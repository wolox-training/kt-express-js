'use strict';
<<<<<<< HEAD

const bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
=======
module.exports = (sequelize, DataTypes) => {
>>>>>>> master
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
      isEmail: true,
      allowNull:false,
      unique:true,
      notEmpty: true,
      isUnique: function(value, next) {
        user.find({where: {email: value}, attributes: ['id']})
          .done(function(error, user) {
            if (error){
              return next(error);
            }
            if (user){
            }
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
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
      }
    }
  });
  return user;
};

