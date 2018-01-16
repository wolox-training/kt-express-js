const user = require('./controllers/user'),
  auth = require('./middlewares/auth'),
  userValidator = require('./middlewares/user');

exports.init = (app) => {
  
  app.post('/users', [], user.create);
  app.post('/admin/users', [auth.checkCredentials, auth.isAdmin], user.createAdmin);
  app.post('/users/sessions', userValidator.validateLoginInput, user.signin);
  app.get('/users/list', auth.checkCredentials, user.list);

};
