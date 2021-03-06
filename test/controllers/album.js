let chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../../app'),
  should = chai.should(),
  nock = require('nock'),
  config = require('../../config'),
  dictum = require('dictum.js'),
  User = require('../../app/models').users,
  Album = require('../../app/models').albums,
  moment = require('moment');

chai.use(chaiHttp);

const albumList = `${config.common.urlRequests.base}${config.common.urlRequests.albumList}`,
  photoList = `${config.common.urlRequests.base}${config.common.urlRequests.photoList}`;

const newUser = {
  name: 'Kevin',
  lastName: 'Temes',
  email: 'kevin.temes@wolox.com',
  password: '12345678',
  lastInvalidation: moment()
};

const dummyUser = {
  name: 'Dummy',
  lastName: 'User',
  email: 'dummy.user@wolox.com',
  password: '12345678',
  lastInvalidation: moment()
};

const oneAlbum = {
  userId: 1, 
  id: 1, 
  title: 'quidem molestiae enim'
};

const adminUser = {
  name: 'Kevin',
  lastName: 'Temes',
  email: 'admin@wolox.com.ar',
  password: '12345678',
  isAdmin: true,
  lastInvalidation: moment()
};

const correctLogin = {
  email: 'kevin.temes@wolox.com',
  password: '12345678'
};
const mockedPhoto = {
  albumId: 1,
  id: 1,
  title: 'accusamus beatae ad facilis cum similique qui sunt',
  url: 'http://placehold.it/600/92c952',
  thumbnailUrl: 'http://placehold.it/150/92c952'
};

const adminLogin = {
  email: 'admin@wolox.com.ar',
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

    nock(albumList).get('').reply(200, [oneAlbum]);
  
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
    nock(albumList).get('/1').query(true).reply(200, oneAlbum);
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
                nock(albumList).get('/1').query(true).reply(200, oneAlbum);
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
  let adminUserId;

  beforeEach(() => {
    
    User.create(newUser).then(user => {
      newUserId = user.id;
      User.create(dummyUser).then(dummy => {
        dummyUserId = dummy.id;
        Album.create({
          id: 1,
          userId: newUserId,
          title: 'Album 1'
        }).then(res => {
          Album.create({
            id: 2,
            userId: newUserId,
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
        nock(photoList).get('/1').query(true).reply(200, mockedPhoto);
        chai.request(server)
          .get(`/users/albums?id=${newUserId}`)
          .set('token', auth.body.token)
          .then(res => {
            res.should.have.status(200);
            res.body.albums.length.should.equal(2);
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
          .get(`/users/albums?id=${dummyUserId}`)
          .set('token', auth.body.token)
          .catch(err => {
            err.should.have.status(403);
          }).then(() => done());
      });

  });

  it('should allow an admin user to access another user`s purchase list', (done) => {
    User.create(adminUser).then(admin => {
      chai.request(server)
        .post('/users/sessions')
        .send(adminLogin)
        .then(auth => {
          chai.request(server)
            .get(`/users/albums?id=${newUserId}`)
            .set('token', auth.body.token)
            .then(res => {
              res.should.have.status(200);
              res.body.albums.length.should.equal(2);
              done();
            });
        });
    });

  });

  it('should deny access to the endpoint if the user is not logged in', (done) => {
    chai.request(server)
      .get(`/users/albums?id=${newUserId}`)
      .catch(err => {
        err.should.have.status(401);
      }).then(() => done());
  });

});

/*
* Testing the /user/albums/:albumId/photos (GET) route
*/
describe('/GET users/albums/:albumId/photos', () => {

  beforeEach(() => {
    User.create(newUser).then(user => {
      Album.create({id: 1, userId: user.id, title: 'test'});
    });
    nock(`${photoList}/1`).get('').query(true).reply(200, mockedPhoto);
  });

  it('should successfully retrieve all the photos of a purchased album', (done) => {

    chai.request(server)
      .post('/users/sessions')
      .send(correctLogin)
      .then(auth => {
        chai.request(server)
          .get('/users/albums/1/photos')
          .set('token', auth.body.token)
          .then(res => {
            res.should.have.status(200);
            res.body.photos.should.include(mockedPhoto);
            done();
          });
      });

  });

  it('should throw an error when requesting the photos of an album not purchased by the user', (done) => {
    
    chai.request(server)
      .post('/users/sessions')
      .send(correctLogin)
      .then(auth => {
        chai.request(server)
          .get('/users/albums/2/photos')
          .set('token', auth.body.token)
          .catch(err => {
            err.should.have.status(403);
          }).then(() => done());
      });

  });

  it('should deny access to the endpoint if the user is not logged in', (done) => {

    chai.request(server)
      .get('/users/albums/2/photos')
      .catch(err => {
        err.should.have.status(401);
      }).then(() => done());

  });

});