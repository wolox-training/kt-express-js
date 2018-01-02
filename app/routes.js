const user = require('./controllers/user');

exports.init = (app) => {
  
  app.post('/users', [], user.create);

};
