const User = require('../models').users,
  logger = require('../logger'),
  https = require('https'),
  url_albums_list = 'https://jsonplaceholder.typicode.com/albums';

exports.list = (req, res, next) => {

  logger.info(`Attempting GET request to url ${url_albums_list} by user [PLACEHOLDER]`);

  https.get(url_albums_list, (resp) => {
    let data = '';
    
    resp.on('data', (chunk) => {
      data += chunk;
    });
    
    resp.on('end', () => {
      logger.info(`Response received from ${url_albums_list}`);
      return res.status(200).send(data);
    });
 
  }).on('error', (err) => {
    logger.error(`An error occured while attempting a GET request to url ${url_albums_list}: ${err.message}`);
  });

};