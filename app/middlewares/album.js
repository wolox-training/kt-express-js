const { check } = require('express-validator/check');

exports.validAlbumId = [check('id').isInt().withMessage('Invalid Album id')];