const user = require('./controllers/user');

exports.init = (app) => {
  
  app.post('/users', [], user.create);

  app.post('/users/sessions', [], user.signin);

  app.get('/users/list/:offset?/:limit?', [], user.list);

};
