
exports.notFound = {
  statusCode: 404,
  message: 'Not found'
};

exports.defaultError = {
  statusCode: 500,
  message: 'Internal Server Error. Please try again later.'
};

exports.invalidCredentialError = {
  statusCode: 401,
  message: 'Invalid Email/Password combination'
};

exports.notLoggedIn = {
  statusCode: 401,
  message: 'You must be logged in to access this endpoint'
};

exports.notAnAdmin = {
  statusCode: 403,
  message: 'You must be an Administrator to access this endpoint.'
};

exports.notAnAlbum = {
  statusCode: 404,
  message: 'The requested Album does not exist.'
};

exports.alreadyPurchased = {
  statusCode: 422,
  message: 'You have already purchased that Album.'
};

exports.invalidAlbumId = {
  statusCode: 400,
  message: 'You must provide a valid Album id to attempt a purchase.'
};

exports.notAnAdmin = {
  statusCode: 403,
  message: 'You must be an Administrator to access this endpoint.'
};

exports.invalidUserId = {
  statusCode: 400,
  message: 'Invalid user Id'
};

exports.sessionExpired = {
  statusCode: 403,
  message: 'You session credentials have expired.'
};