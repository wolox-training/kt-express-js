const errors = require('../errors'),
  logger = require('../logger'),
  jwt = require('jwt-simple'),
  config = require('../../config'),
  moment = require('moment'),
  User = require('../models').users;

exports.checkCredentials = (req, res, next) => {

  if (!req.headers.token){
    return res.status(401).send('You must be logged in to access this endpoint.');
  }

  const token = jwt.decode(req.headers.token, config.common.session.secret);

  User.findOne({
    where: {email: token.email}
  }).then(user => {

    if(!user){
      return next(errors.invalidCredentialError);
    }
    if(sessionExpired(token.expirationDate)){
      return next(errors.sessionExpired);
    }
    if(!sessionStillValid(token.creationDate, user.lastInvalidation)){
      return next(errors.sessionExpired);
    }
    
    req.user = user;
    next();
  
  });

};

exports.isAdmin = (req, res, next) => {

  if(!req.user.isAdmin){
    return next(errors.notAnAdmin);
  }
  next();
};

const sessionExpired = (date) => {
  return moment().diff(date, config.common.session.unit) > 0;
};

const sessionStillValid = (creationDate, lastInvalidation) => {
  const creation = moment(creationDate);
  const invalidation = moment(lastInvalidation, config.common.session.unit);
  const diff = creation.diff(lastInvalidation);
  return moment(creationDate).diff(moment(lastInvalidation, config.common.session.unit)) > 0;
};