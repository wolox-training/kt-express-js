let chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../../app'),
  should = chai.should(),
  dictum = require('dictum.js'),
  User = require('../../app/models').users;

chai.use(chaiHttp);

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

  it('Should throw an error when attempting to POST a user with an non-woloxer email', (done) => {

    let userWithWrongEmail = {
      name: 'Kevin',
      lastName: 'Temes',
      email: 'im.not.from.wolox@email.com',
      password: '12345678'
    };

    chai.request(server)
      .post('/users')
      .send(userWithWrongEmail)
      .catch(err => {
        err.should.have.status(401);
      }).then(() => done());

  });

  it('Should throw an error when attempting to POST a user with an invalid password', (done) => {

    let userWithWrongPassword = {
      name: 'Kevin',
      lastName: 'Temes',
      email: 'totally.real.email@wolox.com',
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

/*
* Testing the /users/sessions (POST) route
*/
describe('/POST users/sessions', () => {

  let newUser = {
    name: 'Kevin',
    lastName: 'Temes',
    email: 'kevin.temes@wolox.com.ar',
    password: '12345678'
  };

  it('should successfully log a user', (done) => {

    let correctLogin = {
      email: 'kevin.temes@wolox.com.ar',
      password: '12345678'
    };

    chai.request(server)
      .post('/users')
      .send(newUser)
      .end((err, res) => {

        chai.request(server)
          .post('/users/sessions')
          .send(correctLogin)
          .end((err, res) => {
            res.should.have.status(200);
            res.res.text.should.equal(`User ${newUser.name} logged in correctly!`);
            dictum.chai(res, 'User signin');
            done();
          });

      });

  });

  it('should throw an error when attempting a login with empty or null email/password', (done) => {

    let emptyLogin = {
      email: '',
      password: null
    };

    chai.request(server)
      .post('/users/sessions')
      .send(emptyLogin)
      .catch(err => {
        err.should.have.status(400);
      })
      .then(() => done());

  });

  it('should throw an error when attemping a login with an invalid email', (done) => {

    let invalidEmail = {
      email: 'fake.email.@error.com',
      password: '12345678'
    };

    chai.request(server)
      .post('/users/sessions')
      .send(invalidEmail)
      .catch(err => {
        err.should.have.status(404);
      })
      .then(() => done());

  });

  it('should throw an error when attempting a login with an existing email but invalid password', (done) => {

    let invalidPassword = {
      email: 'kevin.temes@wolox.com.ar',
      password: '87654321'
    };
    
    chai.request(server)
      .post('/users')
      .send(newUser)
      .then((res) => {
        
        chai.request(server)
          .post('/users/sessions')
          .send(invalidPassword)
          .catch(err => {
            err.should.have.status(401);
          })
          .then(() => done());

      });
  });

});



