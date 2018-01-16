const user = require('./controllers/user'),
  auth = require('./middlewares/auth'),
  userValidator = require('./middlewares/user'),
  album = require('./controllers/album');

exports.init = (app) => {
  
  app.post('/users', [], user.create);
  app.post('/users/sessions', userValidator.validateLoginInput, user.signin);
  app.get('/users/list', auth.checkCredentials, user.list);

  app.get('/albums', auth.checkCredentials, album.list);

};
