const user = require('./controllers/user'),
  userValidator = require('./middlewares/user');

exports.init = (app) => {
  
  app.post('/users', [], user.create);

  app.post('/users/sessions', userValidator.validateLoginInput, user.signin);

};
