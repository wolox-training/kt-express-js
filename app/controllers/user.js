const User = require('../models').users,
  errors = require('../errors'),
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

    res.status(200).send('OK');

  }).catch(error => {

    let errorBag = [];

    for(i = 0; i< error.errors.length; i++){

      errorBag.push(error.errors[i].message);

    }

    res.status(200).send(errorBag);

  });
  
};

const emptyToNull = (input) => {

  for (let key in input){

    input[key] = input[key] === '' ? null : input[key];
  
  }

  return input;

};
