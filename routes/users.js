'use strict';

const express = require('express');

const usersController = require('../controllers/users');
const userValidator = require('../utils/userValidator');
const emailTokenValidator = require('../utils/emailTokenValidator');
const reqParamOptions = require('../constants/reqParamOptions');

const router = express.Router();

router.post('/signup',
  userValidator.validateEmailValue,
  userValidator.validatePassword,
  usersController.signup
);

router.post('/email-verification',
  userValidator.validateUserId(reqParamOptions.QUERY),
  emailTokenValidator.validateEmailTokenValue,
  usersController.verifyEmail  
);

module.exports = router;
