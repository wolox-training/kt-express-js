const User = require('../models').users,
  logger = require('../logger'),
  https = require('https'),
  config = require('../../config');

exports.list = (req, res, next) => {

  logger.info(`Attempting GET request to url ${config.common.urlRequests.albumList}`);

  https.get(config.common.urlRequests.albumList, (resp) => {
    let data = '';
    
    resp.on('data', (chunk) => {
      data += chunk;
    });
    
    resp.on('end', () => {
      logger.info(`Response received from ${config.common.urlRequests.albumList}`);
      return res.status(200).send(JSON.parse(data));
    });
 
  }).on('error', (err) => {
    logger.error(`An error occured while attempting a GET request to url ${config.common.urlRequests.albumList}: ${err.message}`);
  });

};