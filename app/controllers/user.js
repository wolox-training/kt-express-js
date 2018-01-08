const User = require('../models').users,
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
    res.status(201).send(result);

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

  let input = emptyToNull(req.body);

  let test = check('password').exists();

  if(!input.email || !input.password){
    return res.status(400).send('Both email and password are required to continue');
  }
  if (req.headers.token){

    let token = jwt.decode(req.headers.token, secret);

    if(token.token == input.email){
      return res.status(200).send('You are already logged in!');
    }
    
  }

  User.findOne({
    where: {
      email: input.email
    }
  }).then(result => {
    
    if(!result){
      logger.info(`Login attempt with invalid email: "${input.email}"`);
      return res.status(401).send('Database error');
    }

    if(!result.validPassword(input.password)){
      logger.info(`Failed login attempt to account with email "${input.email}", invalid password`);
      return res.status(401).send('Invalid password');
    }
    
    let token = jwt.encode({token: result.email}, secret);
    logger.info(`User ${result.email} successfully logged in`);
    res.status(200).json(token);

  }).catch(error => {
    logger.error(`Unhandled error! details: ${error}`);
    return next(error);
  });

};

const emptyToNull = (input) => {

  let newInput = {};

  Object.keys(input).forEach((key) => {

    newInput[key] = input[key] === '' ? null : input[key];
  
  });

  return newInput;

};
