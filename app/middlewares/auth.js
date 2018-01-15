const errors = require('../errors'),
  logger = require('../logger'),
  jwt = require('jwt-simple'),
  config = require('../../config'),
  User = require('../models').users;

exports.checkCredentials = (req, res, next) => {

  if (!req.headers.token){
    return res.status(401).send('You must be logged in to access this endpoint.');
  }

  const token = jwt.decode(req.headers.token, config.common.session.secret);

  User.findOne({
    where: token
  }).then(user => {

    if(!user){
      return next(errors.invalidCredentialError);
    }

    req.user = user;
    next();
  
  });

};

exports.isAdmin = (req, res, next, user) => {

  if(!req.user.isAdmin){
    return next(errors.notAnAdmin);
  }
  next();
};