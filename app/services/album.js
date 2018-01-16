const request = require('request-promise'),
  config = require('../../config'),
  albumListUrl = config.common.urlRequests.albumList;

exports.listRequest = () => {

  return request(albumListUrl);

};

exports.getAlbum = (id) => {

  return request(`${albumListUrl}/${id}`);

};

exports.getPhotoList = (id) => {

  return new Promise((resolve, reject) => {
    rp(config.common.urlRequests.photoList + id).then(response => resolve(response));
  });

};