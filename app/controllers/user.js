const User = require('../models').users,
  errors = require('../errors'),
  logger = require('../logger'),
  session = require('client-sessions');


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
    res.status(201).send(result);

  }).catch(error => {

    let errorBag = [];
    if(error.errors){
      for(i = 0; i< error.errors.length; i++){
        errorBag.push(error.errors[i].message);
      }
      logger.error(`A database error occured when attempting a user signup. Details: ${errorBag}.`);
      res.status(200).send(errorBag);
    }else{
      logger.error(`Unhandled error! details: ${error}`);
      res.status(500).send(error);
    }

  });
  
};

exports.signin = (req, res, next) => {

  let input = emptyToNull(req.body);

  if(!input.email || !input.password){
    return res.status(400).send('Both email and password are required to continue');
  }
  if (req.session && req.session.user && req.session.user.email === input.email){
    return res.status(200).send('You are already logged in!');
    
  }

  User.findOne({
    where: {
      email: input.email
    }
  }).then(result => {
    
    if(!result || !result.email){
      logger.info(`Login attempt with invalid email: "${input.email}"`);
      return res.status(404).send('The provided email does not exist in our database!');
    }

    if(!result.validPassword(input.password)){
      logger.info(`Failed login attempt to account with email "${input.email}", invalid password`);
      return res.status(401).send('Invalid password');
    }
    
    req.session.user = result;
    logger.info(`User ${result.email} successfully logged in`);
    res.status(200).send(`User ${result.name} logged in correctly!`);

  }).catch(error => {
    console.log(error);
    logger.error(`Unhandled error! details: ${error}`);
    return next();
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
      logger.info('User list requested.');
      return res.status(200).send(result);

    }).catch(err => {
      logger.error(`Unexpected error occurred! Details: ${err}`);
      return res.status(500).send(err);
    });

};

const emptyToNull = (input) => {

  for (let key in input){

    input[key] = input[key] === '' ? null : input[key];
  
  }

  return input;

};
