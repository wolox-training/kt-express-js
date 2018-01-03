//During the test the env variable is set to test
process.env.NODE_ENV = 'development';

let chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../app'),
  should = chai.should(),
  dictum = require('dictum.js'),
  User = require('../app/models').users;

chai.use(chaiHttp);

describe('User', () => {
  beforeEach((done) => {
    User.destroy({where: {}}, (err) => {}).then(done());     
  });

  /*
  * Testing the /users (POST) route
  */
  describe('/POST users', () => {

    let newUser = {
      name: 'Kevin',
      lastName: 'Temes',
      email: 'kevin.temes@wolox.com.ar',
      password: '12345678'
    };

    it('it should successfully POST a user with the given inputs', (done) => {
      chai.request(server)
        .post('/users')
        .send(newUser)
        .end((err, res) => {
          if(err) done(err);
          res.should.have.status(201);
          res.body.should.include({name: 'Kevin', lastName: 'Temes', email: 'kevin.temes@wolox.com.ar'});
          dictum.chai(res, 'description for endpoint');
          done();
        });
    });

    it('it should throw an error when attempting to POST a user with an already existing email', (done) => {
      chai.request(server)
        .post('/users')
        .send(newUser)
        .end((err, res) => {});

      chai.request(server)
        .post('/users')
        .send(newUser)
        .end((err, res) => {
          if(err) done(err);
          res.should.have.status(200);
          res.body.should.include('email must be unique');
          done();
        });
    });

    it('it should throw an error when attempting to POST a user with an invalid password', (done) => {

      let userWithWrongPassword = {
        name: 'Kevin',
        lastName: 'Temes',
        email: 'totally.real.email@email.com',
        password: '123'
      };
  
      chai.request(server)
        .post('/users')
        .send(userWithWrongPassword)
        .end((err, res) => {
          if(err) done(err);
          res.should.have.status(200);
          res.body.should.include('Passwords must contain at least 8 characters.');
          done();
        });
    });

    it('it should throw an error when attempting to POST a user with null or empty fields', (done) => {

      let emptyUser = {
        name: '',
        lastName: null,
        email: null,
        password: ''
      };
  
      chai.request(server)
        .post('/users')
        .send(emptyUser)
        .end((err, res) => {
          if(err) done(err);
          res.should.have.status(200);
          res.body.should.include('name cannot be null', 'lastName cannot be null', 'password cannot be null', 'email cannot be null');
          done();
        });
    });

  });
});


