const request = require('request-promise'),
  logger = require('../logger'),
  config = require('../../config');

exports.listRequest = (req, res, next) => {

  logger.info(`Attempting GET request to url ${config.common.urlRequests.albumList}`);

  request(config.common.urlRequests.albumList).then(response => {

    logger.info(`Response received from ${config.common.urlRequests.albumList}`);
    return res.status(200).send(JSON.parse(response));

  }).catch(error => {

    logger.error(`An error occured while attempting a GET request to url ${config.common.urlRequests.albumList}: ${error.message}`);
    return res.status(502).send(error.message);

  });

};