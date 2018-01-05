//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../../app'),
  should = chai.should(),
  dictum = require('dictum.js'),
  User = require('../../app/models').users;

chai.use(chaiHttp);


beforeEach((done) => {
  User.destroy({where: {}}, (err) => {}).then(done());     
});

/*
* Testing the /users (POST) route
*/
describe('/POST users', () => {

  const newUser = {
    name: 'Kevin',
    lastName: 'Temes',
    email: 'kevin.temes@wolox.com.ar',
    password: '12345678'
  };

  it('Should successfully POST a user with the given inputs', (done) => {
    chai.request(server)
      .post('/users')
      .send(newUser)
      .then((res) => {
        res.should.have.status(201);
        res.body.should.include({name: 'Kevin', lastName: 'Temes', email: 'kevin.temes@wolox.com.ar'});
        dictum.chai(res, 'description for endpoint');
        done();
      });
  });

  it('Should throw an error when attempting to POST a user with an already existing email', (done) => {
    chai.request(server)
      .post('/users')
      .send(newUser)
      .then((res) => {

        chai.request(server)
          .post('/users')
          .send(newUser)
          .catch(err => {
            err.should.have.status(401);
          }).then(() => done());

      });


  });

  it('Should throw an error when attempting to POST a user with an invalid password', (done) => {

    let userWithWrongPassword = {
      name: 'Kevin',
      lastName: 'Temes',
      email: 'totally.real.email@email.com',
      password: '123'
    };

    chai.request(server)
      .post('/users')
      .send(userWithWrongPassword)
      .catch(err => {
        err.should.have.status(401);
      }).then(() => done());
  });

  it('Should throw an error when attempting to POST a user with null or empty fields', (done) => {

    let emptyUser = {
      name: '',
      lastName: null,
      email: null,
      password: ''
    };

    chai.request(server)
      .post('/users')
      .send(emptyUser)
      .catch(err => {
        err.should.have.status(401);
      }).then(() => done());
  });

});



