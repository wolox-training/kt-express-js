const user = require('./controllers/user');

exports.init = (app) => {

  app.get('/signup', [], user.signup);
  app.post('/signup', [], user.create);
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);

};
