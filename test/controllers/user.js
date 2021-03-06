const chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../../app'),
  should = chai.should(),
  expect = chai.expect,
  assert = chai.assert,
  dictum = require('dictum.js'),
  User = require('../../app/models').users,
  moment = require('moment');

chai.use(chaiHttp);

const newUser = {
  name: 'Kevin',
  lastName: 'Temes',
  email: 'kevin.temes@wolox.com.ar',
  password: '12345678',
  lastInvalidation: moment()
};

const admin = {
  name: 'Kevin',
  lastName: 'Temes',
  email: 'kevin.temes@wolox.com.ar',
  password: '12345678',
  isAdmin: true,
  lastInvalidation: moment()
};

const newAdmin = {
  name: 'Admin',
  lastName: 'Admin',
  email: 'admin@wolox.com',
  password: '12345678',
  lastInvalidation: moment()
};

const adminLogin = {
  email: 'kevin.temes@wolox.com.ar',
  password: '12345678'
};

const correctLogin = {
  email: 'kevin.temes@wolox.com.ar',
  password: '12345678'
};

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

    const userWithWrongEmail = {
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

    const userWithWrongPassword = {
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

    const emptyUser = {
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

  beforeEach(() => {

    User.create(newUser).then(res => {User.create(userOne).then(res => {User.create(userTwo);});});

  });

  it('should return all users from the database', (done) => {

    chai.request(server)
      .post('/users/sessions')
      .send(correctLogin)
      .then(res => {

        chai.request(server)
          .get('/users/list')
          .set('token', res.body.token)
          .then((res) => {
            res.should.have.status(200);
            res.body.users.should.include(
              {name: 'Kevin', lastName: 'Temes', email: 'kevin.temes@wolox.com.ar'},
              {name: 'userOne', lastName: 'userOne', email: 'userOne@wolox.com'}, 
              {name: 'userTwo', lastName: 'userTwo', email: 'userTwo@wolox.com'}
            );
            dictum.chai(res, 'User list retrieval');
            done();
          });

      });

  });

  it('should return only the second user', (done) => {

    chai.request(server)
      .post('/users/sessions')
      .send(correctLogin)
      .then(res => {
        chai.request(server)
          .get('/users/list?offset=1&limit=1')
          .set('token', res.body.token)
          .then((res) => {
            res.should.have.status(200);
            res.body.users.should.include( { name: 'userOne', lastName: 'userOne', email: 'userOne@wolox.com' } );
            done();
          });
      });
                
  });

  it('should return only the last user', (done) => {

    chai.request(server)
      .post('/users/sessions')
      .send(correctLogin)
      .then(res => {
        chai.request(server)
          .get('/users/list?offset=2&limit=1')
          .set('token', res.body.token)
          .then(res => {
            res.should.have.status(200);
            res.body.users.should.include({name: 'userTwo', lastName: 'userTwo', email: 'userTwo@wolox.com'});
            done();
          });
      });
  });

  it('should deny access to the endpoint if the user is not logged in', (done) => {

    chai.request(server)
      .get('/users/list?offset=2&limit=1')
      .catch(err => {
        err.should.have.status(401);
      }).then(() => done());

  });

});

/*
* Testing the /admin/users (POST) route
*/
describe('/POST admin/users', () => {

  const notAnAdmin = {
    name: 'Not',
    lastName: 'AnAdmin',
    email: 'not.an.admin@wolox.com',
    password: '12345678'
  };

  const notAdminLogin = {
    email: 'not.an.admin@wolox.com',
    password: '12345678'
  };

  it('should successfully create an admin user', (done) => {

    User.create(admin).then(res => {

      User.count().then(oldUsers => {

        chai.request(server)
          .post('/users/sessions')
          .send(adminLogin)
          .then((res) => {
            chai.request(server)
              .post('/admin/users')
              .send(newAdmin)
              .set('token', res.body.token)
              .then(result => {
                result.should.have.status(201);
                User.count().then(newUsers => {
                  newUsers.should.equal(oldUsers + 1);
                  done();
                });
              }).catch(err => {
                console.log(err);
              });
          });        

      });

    });

  });

  it('should successfully update a regular user to an admin user', (done) => {

    User.create(admin).then(res => {
      User.create(notAnAdmin).then(res => {
        User.count().then(oldUsers => {
          chai.request(server)
            .post('/users/sessions')
            .send(adminLogin)
            .then((res) => {
              chai.request(server)
                .post('/admin/users')
                .send(notAnAdmin)
                .set('token', res.body.token)
                .then(result => {
                  result.should.have.status(201);
                  User.count().then(newUsers => {
                    newUsers.should.equal(oldUsers);
                    done();
                  });
                });
            });
        });
      });
    });

  });

  it('should deny access to the endpoint if the user is not logged in', (done) => {

    chai.request(server)
      .post('/admin/users')
      .send(newAdmin)
      .catch(err => {
        err.should.have.status(401);
      }).then(() => done());

  });

  it('should deny access to the endpoint if the user is logged in but its not an administrator', (done) => {

    User.create(notAnAdmin).then(res => {
      chai.request(server)
        .post('/users/sessions')
        .send(notAdminLogin)
        .then((res) => {
          chai.request(server)
            .post('/admin/users')
            .send(newAdmin)
            .set('token', res.body.token)
            .catch(err => {
              err.should.have.status(403);
            }).then(() => done());
        });
    });

  });

});

/*
* Testing the expiration of session tokens
*/

describe('Token Expiration', () => {

  it('Should return an error when the user provides an expired token', (done) => {

    process.env.NODE_API_JWT_SESSION_DURATION_TEST ='1';
    process.env.NODE_API_JWT_SESSION_DURATION_UNIT_TEST = 'ms';

    User.create(newUser).then(user => {
      chai.request(server)
        .post('/users/sessions')
        .send(correctLogin)
        .then(auth => {
          chai.request(server)
            .post('/admin/users')
            .send(newAdmin)
            .set('token', auth.body.token)
            .catch(err => {
              err.should.have.status(403);
            }).then(() => done());
        });
    });

  });

  it('Should allow access to an endpoint if the user credentials are valid and havent expired', (done) => {

    process.env.NODE_API_JWT_SESSION_DURATION_TEST ='1';
    process.env.NODE_API_JWT_SESSION_DURATION_UNIT_TEST = 'm';

    User.create(admin).then(user => {
      chai.request(server)
        .post('/users/sessions')
        .send(adminLogin)
        .then(auth => {
          chai.request(server)
            .post('/admin/users')
            .send(newAdmin)
            .set('token', auth.body.token)
            .then(result => {
              result.should.have.status(201);
              done();
            });
        });
    });

  });

});

/*
* Testing the /users/sessions/invalidate_all (POST) route
*/

describe('/users/sessions/invalidate_all', () => {

  beforeEach(() => {User.create(admin);});

  it('Should sucessfully invalidate the user sessions', (done) => {

    chai.request(server)
      .post('/users/sessions')
      .send(adminLogin)
      .then(auth => {
        chai.request(server)
          .post('/users/sessions/invalidate_all')
          .set('token', auth.body.token)
          .then(res => {
            res.should.have.status(201);
            dictum.chai(res, 'Session Invalidation');
            done();
          });
      });

  });

  it('Should deny access to an endpoint if the user invalidates their sessions, then sends a request with an old token', (done) => {

    chai.request(server)
      .post('/users/sessions')
      .send(adminLogin)
      .then(auth => {
        chai.request(server)
          .post('/users/sessions/invalidate_all')
          .set('token', auth.body.token)
          .then(res => {
            chai.request(server)
              .post('/admin/users')
              .send(newAdmin)
              .set('token', auth.body.token)
              .catch(error => {
                console.log(error.message);
                error.should.have.status(403);
              }).then(() => done());
          });
      });

  });

  it('Should allow access to an endpoint if the user logs in after invalidating their sessions', (done) => {

    chai.request(server)
      .post('/users/sessions')
      .send(adminLogin)
      .then(auth => {
        chai.request(server)
          .post('/users/sessions/invalidate_all')
          .set('token', auth.body.token)
          .then(res => {
            chai.request(server)
              .post('/users/sessions')
              .send(adminLogin)
              .then(newAuth => {
                chai.request(server)
                  .post('/admin/users')
                  .send(newAdmin)
                  .set('token', newAuth.body.token)
                  .then(res => {
                    res.should.have.status(201);
                    done();
                  });
              });
          });
      });

  });

});