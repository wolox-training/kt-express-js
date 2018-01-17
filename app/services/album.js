const rp = require('request-promise'),
  config = require('../../config'),
  albumList = `${config.common.urlRequests.base}${config.common.urlRequests.albumList}`,
  photoList = `${config.common.urlRequests.base}${config.common.urlRequests.photoList}`;

exports.listRequest = () => {

  return request(albumList);

};

exports.getAlbum = (id) => {

  return request(`${albumListUrl}/${id}`);

};

exports.getPhotoList = (albumId) => {

  rp(`${photoList}${albumId}`);

};