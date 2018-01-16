
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
  message : 'Invalid Email/Password combination'
};

exports.notAnAdmin = {
  statusCode: 403,
  message: 'You must be an Administrator to access this endpoint.'
};