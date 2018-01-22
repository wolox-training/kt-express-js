const albumService = require('../services/album'),
  albumInteractor = require('../interactors/album'),
  error = require('../errors'),
  logger = require('../logger'),
  { validationResult } = require('express-validator/check'),
  mailer = require('nodemailer');

exports.list = (req, res, next) => {

  logger.info('Attempting to get all albums');

  albumService.listRequest().then(albums => {
    logger.info('Albums retrieved!');
    return res.status(200).send(JSON.parse(albums));
  }).catch(error => {
    logger.error(`An error occured while attempting to get the albums list. Details: ${error.message}`);
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

  albumService.getAlbum(req.body.id).then(album => {
    if(!album){
      return next(errors.notAnAlbum);
    }

    const parsedAlbum = JSON.parse(album);

    albumInteractor.purchaseAlbum(req.user, parsedAlbum).then(purchased => {

      if(!purchased){
        return next(error.alreadyPurchased);
      }
      return res.status(201).send({
        id: parsedAlbum.id,
        title: parsedAlbum.title
      });
      
    });
    
  }).catch(error => {
    if(error.statusCode === 404){
      return next(error.notAnAlbum);
    }
    logger.error(`Unhandled error exception! Details: ${error.message}`);
    return res.status(500).send(error.message);
    

  });

};

exports.purchaseList = (req, res, next) => {

  try {
    validationResult(req).throw();
  } catch (err) {
    return next(error.invalidUserId);
  }

  id = req.query.id;

  if((id != req.user.id) && !req.user.isAdmin){
    return next(error.notAnAdmin);
  }

  albumInteractor.getAlbumsByUser(id).then(albums => {
    return res.status(200).send({albums: albums});
  });
};
 
exports.photoList = (req, res, next) => {

  logger.info(`User ${req.user.email} requested the photos of an album with ID ${req.params.albumId}`);

  if(!req.params.albumId || isNaN(req.params.albumId)){
    return next(error.invalidAlbumId);
  }

  albumInteractor.checkPurchasedAlbum(req.user.id, req.params.albumId).then(album => {

    if(!album){
      return next(error.notOwned);
    }else{
      albumService.getPhotoList(album.id).then(photos => {
        return res.status(200).send({photos: JSON.parse(photos)});
      });
    }

  }).catch(error => {
    logger.error(`Unhandled error exception! Details: ${error.message}`);
    return res.status(500).send(error.message);
  });

};

exports.emailPhotos = (req, res, next) => {

  logger.info(`User ${req.user.email} requested to receive an email with the photos of an album with ID ${req.params.albumId}`);

  if(!req.params.albumId || isNaN(req.params.albumId)){
    return next(error.invalidAlbumId);
  }

  albumInteractor.checkPurchasedAlbum(req.user.id, req.params.albumId).then(album => {

    if(!album){
      return next(error.notOwned);
    }
    albumService.getPhotoList(album.id).then(photos => {
    
      sendMail(req.user.email, 'Album photo list', photos);

      return res.status(200).send('Email sent.');

    });
    

  }).catch(error => {
    logger.error(`Unhandled error exception! Details: ${error.message}`);
    return res.status(500).send(error.message);
  });

};

const sendMail = (to, subject, message) => {

  mailer.createTestAccount((err, account) => {
    let transporter = mailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });

    let mailOptions = {
      from: '"Wolox" <wolox@wolox.com.ar>',
      to,
      subject: subject,
      text: message,
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(`An error ocurred while trying to send an email: Details: ${error}`);
      }
    });
  });

};