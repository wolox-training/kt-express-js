const User = require('../models').users,
  errors = require('../errors'),
  logger = require('../logger'),
  path = require('path');


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
  }).then(result => {
    let message = `User ${input.name} created successfully.`;
    logger.info(message);
    res.status(200).send(message);

  }).catch(error => {

    let errorBag = [];
    if(error.errors){
      for(i = 0; i< error.errors.length; i++){
        errorBag.push(error.errors[i].message);
      }
      logger.error(`A database error occured when attempting a user signup. Details: ${errorBag}.`);
      res.status(500).send(errorBag);
    }else{
      logger.error(`Unhandled error! details: ${error}`);
      res.status(500).send(error);
    }

  });
  
};

const emptyToNull = (input) => {

  for (let key in input){

    input[key] = input[key] === '' ? null : input[key];
  
  }

  return input;

};
