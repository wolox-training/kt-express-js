const user = require('./controllers/user');

exports.init = (app) => {
  
  app.post('/users', [], user.create);

  app.post('/users/sessions', [], user.signin);

};
