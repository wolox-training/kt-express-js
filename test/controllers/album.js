let chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../../app'),
  should = chai.should(),
  dictum = require('dictum.js'),
  User = require('../../app/models').users;

chai.use(chaiHttp);

const newUser = {
  name: 'Kevin',
  lastName: 'Temes',
  email: 'kevin.temes@wolox.com.ar',
  password: '12345678'
};

const correctLogin = {
  email: 'kevin.temes@wolox.com.ar',
  password: '12345678'
};

describe('/GET albums', () => {

  it('should successfully retrieve a list of albums', (done) => {
  
    User.create(newUser).then(res => {
      chai.request(server)
        .post('/users/sessions')
        .send(correctLogin)
        .then(auth => {
          chai.request(server)
            .get('/albums')
            .set('token', auth.body.token)
            .then(res => {
              res.should.have.status(200);
              res.body.should.include({userId: 1, id: 1, title: 'quidem molestiae enim'});
              dictum.chai(res, 'Get Albums');
              done();
            });
        });
    });
  
  });

  it('should deny access to the endpoint if the user is not logged in', (done) => {

    chai.request(server)
      .get('/albums')
      .catch(err => {
        err.should.have.status(401);
      }).then(() => done());

  });

});