let chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../../app'),
  should = chai.should(),
  nock = require('nock'),
  config = require('../../config'),
  dictum = require('dictum.js'),
  User = require('../../app/models').users,
  Album = require('../../app/models').albums;

chai.use(chaiHttp);

const url = config.common.urlRequests.albumList;

const newUser = {
  name: 'Kevin',
  lastName: 'Temes',
  email: 'kevin.temes@wolox.com',
  password: '12345678'
};

const dummyUser = {
  name: 'Dummy',
  lastName: 'User',
  email: 'dummy.user@wolox.com',
  password: '12345678'
};

const oneAlbum = {
  userId: 1, 
  id: 1, 
  title: 'quidem molestiae enim'
};

const firstAlbum = { id: 1 };
const correctLogin = {
  email: 'kevin.temes@wolox.com',
  password: '12345678'
};

const firstAlbum = { id: 1 },
  secondAlbum = {id: 2},
  thirdAlbum = {id: 3},
  invalidAlbum = {id : 'error'};


/*
* Testing the /albums (GET) route
*/
describe('/GET albums', () => {

  it('should successfully retrieve a list of albums', (done) => {

    nock(url).get('').reply(200, [oneAlbum]);
  
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
              res.body.should.include(oneAlbum);
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

/*
* Testing the /albums (POST) route
*/
describe('/POST albums', () => {

  beforeEach(() => {
    nock(url).get('/1').query(true).reply(200, oneAlbum);
  });

  it('should successfully purchase an album', (done) => {

    User.create(newUser).then(user => {
      Album.count().then(albumCount => {
        chai.request(server)
          .post('/users/sessions')
          .send(correctLogin)
          .then(auth => {
            chai.request(server)
              .post('/albums')
              .send(firstAlbum)
              .set('token', auth.body.token)
              .then(res => {
                res.should.have.status(201);
                Album.count({ where: {'id': 1, 'userId': user.id} }).then(newAlbums => {
                  newAlbums.should.equal(albumCount + 1);
                });
                done();
              });
          });
      });
    });

  });

  it('should prevent an album from being purchased more than once by the same user', (done) => {

    User.create(newUser).then(user => {
      chai.request(server)
        .post('/users/sessions')
        .send(correctLogin)
        .then(auth => {
          chai.request(server)
            .post('/albums')
            .send(firstAlbum)
            .set('token', auth.body.token)
            .then(res => {
              Album.count().then(firstAlbumCount => {
                nock(url).get('/1').query(true).reply(200, oneAlbum);
                chai.request(server)
                  .post('/albums')
                  .send(firstAlbum)
                  .set('token', auth.body.token)
                  .catch(err => {
                    err.should.have.status(422);
                    Album.count().then(secondAlbumCount => {
                      secondAlbumCount.should.equal(firstAlbumCount);
                    });
                  }).then(() => done());
              });
            });
        });
    });

  });

  it('should return an error when attempting an album purchase with an invalid ID', (done) => {

    User.create(newUser).then(user => {
      Album.count().then(albumCount => {
        chai.request(server)
          .post('/users/sessions')
          .send(correctLogin)
          .then(auth => {
            chai.request(server)
              .post('/albums')
              .send(firstAlbum)
              .set('token', auth.body.token)
              .catch(err => {
                err.should.have.status(400);
              }).then(() => done());
          });
      });
    });

  });

  it('should deny access to the endpoint if the user is not logged in', (done) => {

    chai.request(server)
      .post('/albums')
      .send(firstAlbum)
      .catch(err => {
        err.should.have.status(401);
      }).then(() => done());

  });

});

/*
* Testing the /albums (POST) route
*/
describe('/GET users/albums', () => {

  let newUserId;
  let dummyUserId;

  beforeEach(() => {
    User.create(newUser).then(user => {
      newUserId = user.id;
      User.create(dummyUser).then(dummy => {
        dummyUserId = dummy.id;
        Album.create({
          id: 1,
          userId: user.id,
          title: 'Album 1'
        }).then(res => {
          Album.create({
            id: 2,
            userId: user.id,
            title: 'Album 2'
          });
        });
      });
    });
  });

  it('should retrieve all albums owned by the user', (done) => {

    chai.request(server)
      .post('/users/sessions')
      .send(correctLogin)
      .then(auth => {
        chai.request(server)
          .get('/users/albums?id=' + newUserId)
          .set('token', auth.body.token)
          .then(res => {
            res.should.have.status(200);
            res.body.length.should.equal(2);
            done();
          });
      });    

  });

  it('should prevent a regular user from accessing another user`s purchase list', (done) => {

    chai.request(server)
      .post('/users/sessions')
      .send(correctLogin)
      .then(auth => {
        chai.request(server)
          .get('/users/albums?id=' + dummyUserId)
          .set('token', auth.body.token)
          .catch(err => {
            err.should.have.status(403);
          }).then(() => done());
      });

  });

  it('should deny access to the endpoint if the user is not logged in', (done) => {
    chai.request(server)
      .get('/users/albums?id=' + newUserId)
      .catch(err => {
        err.should.have.status(401);
      }).then(() => done());
  });

});