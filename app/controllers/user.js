const User = require('../models').users,
  errors = require('../errors'),
  logger = require('../logger'),
  jwt = require('jwt-simple'),
  secret = process.env.NODE_API_JWT_SECRET_STRING,
  { check, validationResult } = require('express-validator/check'),
  bcrypt = require('bcrypt');


exports.signup = (req, res, next) => {

  res.status(200);
  
  res.sendFile(path.resolve('app/views/user/signup.html'));

};

exports.create = (req, res, next) => {

  let input = emptyToNull(req.body);

  User.create({
    name: input.name,
    lastName: input.lastName,
    email: input.email,
    password: input.password
  })
    .then(result => {
      let message = `User ${input.name} created successfully.`;
      logger.info(message);
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

  let input = emptyToNull(req.body);

  if (req.headers.token){

    let token = jwt.decode(req.headers.token, secret);

    if(token.token == input.email){
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
    
    bcrypt.compare(input.password, result.password).catch(err => {}).then(correctPassword => {

      if(!correctPassword){
        logger.info(`Failed login attempt to account with email: "${input.email}", invalid password`);
        return next(errors.invalidCredentialError);
      }

      let token = jwt.encode({token: result.email}, secret);
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
    console.log(error);
    return next(errors.defaultError);
  });

};

const emptyToNull = (input) => {

  let newInput = {};

  Object.keys(input).forEach((key) => {

    newInput[key] = input[key] === '' ? null : input[key];
  
  });

  return newInput;

};
