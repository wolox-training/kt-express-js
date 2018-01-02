const userModel = require('../models/user'),
  errors = require('../errors'),
  path = require('path');


exports.signup = (req, res, next) => {

  res.status(200);
  
  res.sendFile(path.resolve('app/views/user/signup.html'));

};

exports.create = (req, res, next) => {
  
  res.status(200);

  let validation = validateInput(req.body);

  res.send('OK!');
  
};

const validateInput = (input) => {

  let errors = null;

  input.forEach(element => {
    
    if(typeof(element) == 'undefined' || element === ''){
      
      errors = 'All fields are required!';
      
      return errors;
    }

  });

};
