const albumService = require('../services/album');

exports.list = (req, res, next) => {

  albumService.listRequest(req, res, next);

};