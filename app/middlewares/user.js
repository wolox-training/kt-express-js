const { check } = require('express-validator/check');

exports.validateLoginInput = [
  check('email').isEmail().withMessage('Email is invalid'), 
  check('password', 'passwords must be at least 8 chars long').isLength({ min: 8 })
];