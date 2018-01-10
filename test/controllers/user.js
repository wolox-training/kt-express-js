let chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../../app'),
  should = chai.should(),
  expect = chai.expect,
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

let token = '';

/*
* Testing the /users (POST) route
*/
describe('/POST users', () => {

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

  it('should successfully log a user', (done) => {

    chai.request(server)
      .post('/users')
      .send(newUser)
      .then(res => {

        chai.request(server)
          .post('/users/sessions')
          .send(correctLogin)
          .then((res) => {
            res.should.have.status(200);
            expect(res.body).to.have.property('token');
            token = res.body.token;
            dictum.chai(res, 'User signin');

            done();
          });

      });

  });

  it('should throw an error when attempting a login with empty or null email/password', (done) => {

    const emptyLogin = {
      email: '',
      password: null
    };

    chai.request(server)
      .post('/users/sessions')
      .send(emptyLogin)
      .catch(err => {
        err.should.have.status(401);
      })
      .then(() => done());

  });

  it('should throw an error when attemping a login with an invalid email', (done) => {

    const invalidEmail = {
      email: 'fake.email.@error.com',
      password: '12345678'
    };

    chai.request(server)
      .post('/users/sessions')
      .send(invalidEmail)
      .catch(err => {
        err.should.have.status(401);
      })
      .then(() => done());

  });

  it('should throw an error when attempting a login with an existing email but invalid password', (done) => {

    const invalidPassword = {
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

/*
* Testing the /users/list (POST) route
*/
describe('/POST users/list', () => {

  const userOne = {
    name: 'userOne',
    lastName: 'userOne',
    email: 'userOne@wolox.com',
    password: '12345678'
  };

  const userTwo = {
    name: 'userTwo',
    lastName: 'userTwo',
    email: 'userTwo@wolox.com',
    password: '12345678'
  };

  it('should return all users from the database', (done) => {

    chai.request(server)
      .post('/users')
      .send(newUser)
      .then((res) => {

        chai.request(server)
          .post('/users')
          .send(userOne)
          .then((res) => {

            chai.request(server)
              .post('/users')
              .send(userTwo)
              .then((res) => {

                chai.request(server)
                  .get('/users/list')
                  .set('token', token)
                  .then((res) => {
                    res.should.have.status(200);
                    res.body.should.include(
                      {name: 'userOne', lastName: 'userOne', email: 'userOne@wolox.com'}, 
                      {name: 'userTwo', lastName: 'userTwo', email: 'userTwo@wolox.com'}
                    );
                    dictum.chai(res, 'User list retrieval');
                    done();
                  });
                
                
              });
            
          });
        
      });

  });

  it('should return only the second user', (done) => {

    chai.request(server)
      .post('/users')
      .send(newUser)
      .then((res) => {

        chai.request(server)
          .post('/users')
          .send(userOne)
          .then((res) => {

            chai.request(server)
              .post('/users')
              .send(userTwo)
              .then((res) => {

                chai.request(server)
                  .get('/users/list/1/1')
                  .set('token', token)
                  .then((res) => {
                    res.should.have.status(200);
                    res.body.should.include({name: 'userOne', lastName: 'userOne', email: 'userOne@wolox.com'});
                    done();
                  });
                
              });
            
          });
        
      });

  });

  it('should return only the last user', (done) => {

    chai.request(server)
      .post('/users')
      .send(newUser)
      .then((res) => {

        chai.request(server)
          .post('/users')
          .send(userOne)
          .then((res) => {

            chai.request(server)
              .post('/users')
              .send(userTwo)
              .then((res) => {

                chai.request(server)
                  .get('/users/list/2/1')
                  .set('token', token)
                  .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.include({name: 'userTwo', lastName: 'userTwo', email: 'userTwo@wolox.com'});
                    done();
                  });
                
              });
            
          });
        
      });

  });

});



