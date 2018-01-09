let chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../app'),
  should = chai.should(),
  dictum = require('dictum.js');

chai.use(chaiHttp);

describe('/GET albums', () => {

  it('should successfully retrieve a list of albums', (done) => {
    chai.request(server)
      .get('/albums')
      .then(res => {
        res.should.have.status(200);
        dictum.chai(res, 'Get Albums');
        done();
      });
  });

});