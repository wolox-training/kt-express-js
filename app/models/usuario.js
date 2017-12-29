'use strict';
module.exports = function(sequelize, DataTypes) {
  var usuario = sequelize.define('usuario', {
    id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return usuario;
};
