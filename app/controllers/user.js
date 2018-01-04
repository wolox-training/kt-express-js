const User = require('../models').users,
  errors = require('../errors'),
  logger = require('../logger');

exports.create = (req, res, next) => {

  const input = emptyToNull(req.body);

  User.create({
    name: input.name,
    lastName: input.lastName,
    email: input.email,
    password: input.password
  }).then(result => {
    logger.info(`User ${input.name} created successfully.`);
    res.status(200).send(`User ${input.name} created successfully.`);

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

const emptyToNull = (input) => {

  let newInput = [];

  for (let key in input){

    newInput[key] = input[key] === '' ? null : input[key];
  
  }

  return newInput;

};
