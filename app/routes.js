const user = require('./controllers/user'),
  auth = require('./middlewares/auth');

exports.init = (app) => {
  
  app.post('/users', [], user.create);

  app.post('/users/sessions', [], user.signin);

  app.get('/users/list/:offset?/:limit?', auth.checkCredentials, user.list);

};
