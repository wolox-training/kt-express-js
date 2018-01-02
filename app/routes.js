const user = require('./controllers/user');

exports.init = (app) => {

  app.get('/signup', [], user.signup);
  app.post('/users', [], user.create);

};
