const request = require('request-promise'),
  logger = require('../logger'),
  config = require('../../config');

exports.listRequest = () => {

  return new Promise((resolve, reject) => {

  request(config.common.urlRequests.albumList).then(response => resolve(response));
  
  });

};

exports.checkAlbum = (id) => {

  return new Promise((resolve, reject) => {
    rp(config.common.urlRequests.albumList + '/' + id)
      .then(album => resolve(album))
      .catch(error => {
        reject(error);
      });
  });

};