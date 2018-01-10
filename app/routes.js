const user = require('./controllers/user'),
  auth = require('./middlewares/auth'),
  userValidator = require('./middlewares/user');

exports.init = (app) => {
  
  app.post('/users', [], user.create);
  app.post('/users/sessions', userValidator.validateLoginInput, user.signin);
  app.get('/users/list/:offset?/:limit?', auth.checkCredentials, user.list);

};
