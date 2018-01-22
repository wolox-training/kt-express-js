const user = require('./controllers/user'),
  auth = require('./middlewares/auth'),
  userValidator = require('./middlewares/user'),
  albumValidator = require('./middlewares/album'),
  album = require('./controllers/album');

exports.init = (app) => {
  
  //User endpoint routes
  app.post('/users', [], user.create);
  app.post('/admin/users', [auth.checkCredentials, auth.isAdmin], user.createAdmin);
  app.post('/users/sessions', userValidator.validateLoginInput, user.signin);
  app.post('/users/sessions/invalidate_all', auth.checkCredentials, user.invalidateSessions);
  app.get('/users/list', auth.checkCredentials, user.list);

  //Album endpoint routes
  app.get('/albums', auth.checkCredentials, album.list);
  app.post('/albums', [auth.checkCredentials, albumValidator.validAlbumId], album.purchase);
  app.get('/users/albums', auth.checkCredentials, album.purchaseList);
  app.get('/users/albums/:albumId/photos', auth.checkCredentials, album.photoList);

};
