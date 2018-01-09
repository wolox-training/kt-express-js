const errors = require('../errors'),
  logger = require('../logger'),
  jwt = require('jwt-simple');

exports.checkCredentials = (req, res, next) => {

  if (!req.headers.token){
    return res.status(401).send('You must be logged in to access this endpoint');
  }

  let token = jwt.decode(req.headers.token, secret);

  User.findOne({
    where: {
      email: token.token
    }
  }).then(result => {

    if(!result){
      return res.status(401).send('Invalid credentials');
    }

    next();
  
  });

};