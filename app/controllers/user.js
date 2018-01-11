const User = require('../models').users,
  errors = require('../errors'),
  logger = require('../logger'),
  jwt = require('jwt-simple'),
  config = require('../../config/index'),
  { validationResult } = require('express-validator/check'),
  bcrypt = require('bcrypt');

exports.create = (req, res, next) => {

  const input = emptyToNull(req.body);

  User.create({
    name: input.name,
    lastName: input.lastName,
    email: input.email,
    password: input.password
  })
    .then(result => {
      logger.info(`User ${input.name} created successfully.`);
      res.status(201).send({
        name: result.name,
        lastName: result.lastName,
        email: result.email
      });

    }).catch(error => {

      let errorBag = [];
      if(error.errors){
        errorBag = error.errors.map(err => err.message);
        logger.error(`A database error occured when attempting a user signup. Details: ${errorBag}.`);
        res.status(401).send(errorBag);
      }else{
        logger.error(`Unhandled error! details: ${error}`);
        res.status(500).send(error);
      }

    });

};

exports.signin = (req, res, next) => {

  try {
    validationResult(req).throw();
  } catch (err) {
    return next(errors.invalidCredentialError);
  }

  const input = emptyToNull(req.body);

  if (req.headers.token){

    let token = jwt.decode(req.headers.token, config.common.session.secret);

    if(token.email == input.email){
      return res.status(200).send('You are already logged in!');
    }
    
  }

  User.findOne({
    where: { email: input.email }
  }).then(result => {

    if(!result){
      logger.info(`Failed login attempt to account with invalid email: "${input.email}"`);
      return next(errors.invalidCredentialError);
    }
    
    bcrypt.compare(input.password, result.password).then(correctPassword => {

      if(!correctPassword){
        logger.info(`Failed login attempt to account with email: "${input.email}", invalid password`);
        return next(errors.invalidCredentialError);
      }

      const token = jwt.encode({email: result.email}, config.common.session.secret);
      logger.info(`User ${result.email} successfully logged in`);
      return res.status(200).send({
        user:{
          name: result.name,
          lastName: result.lastName,
          email: result.email
        },
        token: token
      });
    });


  }).catch(error => {
    logger.error(`Unhandled error! details: ${error}`);
    return next(errors.defaultError);
  });

};

exports.list = (req, res, next) => {

  let params = emptyToNull(req.params);

  User.findAll({
    attributes: ['name', 'lastName', 'email'],
    offset: params.offset,
    limit: params.limit ? params.limit : 10
  })
    .then(result => {
      logger.info('User list requested');
      return res.status(200).send({users: result});

    }).catch(err => {
      logger.error(`Unexpected error occurred! Details: ${err}`);
      return res.status(500).send(err);
    });

};

const emptyToNull = (input) => {

  let newInput = {};

  Object.keys(input).forEach((key) => {

    newInput[key] = input[key] === '' ? null : input[key];
  
  });

  return newInput;

};

const newUser = (req, res, next, input) => {

  User.create({
    name: input.name,
    lastName: input.lastName,
    email: input.email,
    password: input.password,
    isAdmin: input.isAdmin
  })
    .then(result => {
      if(input.isAdmin){
        logger.info(`Admin user ${input.email} created successfully.`);
      }else{
        logger.info(`User ${input.email} created successfully.`);
      }
      return res.status(201).send({
        name: result.name,
        lastName: result.lastName,
        email: result.email
      });

    }).catch(error => {

      let errorBag = [];
      if(error.errors){
        errorBag = error.errors.map(err => err.message);
        logger.error(`A database error occured when attempting a user signup. Details: ${errorBag}.`);
        return res.status(401).send(errorBag);
      }else{
        logger.error(`Unhandled error! details: ${error}`);
        return res.status(500).send(error);
      }

    });

};
