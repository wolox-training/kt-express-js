const request = require('request-promise'),
  config = require('../../config'),
  albumListUrl = config.common.urlRequests.albumList;

exports.listRequest = () => {

  return request(albumListUrl);

};

exports.getAlbum = (id) => {

  return request(`${albumListUrl}/${id}`);

};