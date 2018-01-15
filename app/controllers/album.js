const albumService = require('../services/album'),
  albumInteractor = require('../interactors/album'),
  error = require('../errors'),
  logger = require('../logger'),
  config = require('../../config'),
  { validationResult } = require('express-validator/check');

exports.list = (req, res, next) => {

  logger.info(`Attempting GET request to url ${config.common.urlRequests.albumList}`);

  albumService.listRequest().then(albums => {
    logger.info(`Response received from ${config.common.urlRequests.albumList}`);
    return res.status(200).send(JSON.parse(albums));
  }).catch(error => {
    logger.error(`An error occured while attempting a GET request to url ${config.common.urlRequests.albumList}: ${error.message}`);
    return res.status(502).send(error.message);
  });

};

exports.purchase = (req, res, next) => {

  try {
    validationResult(req).throw();
  } catch (err) {
    return next(error.invalidAlbumId);
  }

  logger.info(`User ${req.user.email} requested to purchase an Album, ID ${req.body.id}`);

  albumService.checkAlbum(req.body.id).then(album => {
    if(!album){
      return next(errors.notAnAlbum);
    }else{

      albumInteractor.purchaseAlbum(req.user, JSON.parse(album)).then(purchased => {

        if(!purchased){
          return next(error.alreadyPurchased);
        }else{
          return res.status(201).send({
            id: purchased.id,
            title: purchased.title
          });
        }

      });
      
    }
  }).catch(error => {

    if(error.statusCode === 404){
      return next(error.notAnAlbum);
    }else{
      logger.error(`Unhandled error exception! Details: ${error.message}`);
      return res.status(500).send(error.message);
    }

  });

};