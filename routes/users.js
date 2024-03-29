'use strict';

const express = require('express');

const usersController = require('../controllers/users');
const userValidator = require('../utils/userValidator');
const emailTokenValidator = require('../utils/emailTokenValidator');
const { paramOptions } = require('../utils/param');
const auth = require('../auth/auth')

const router = express.Router();

router.post('/signup',
  userValidator.validateEmailValue,
  userValidator.validatePassword,
  usersController.signup
);

router.post('/email-verification',
  userValidator.validateId({ userId: paramOptions.REQ_QUERY }),
  emailTokenValidator.validateEmailTokenValue,
  usersController.verifyEmail
);

router.post('/login',
  userValidator.validateEmailValue,
  auth.authenticateEmailPass,
  usersController.login
);

router.post('/logout',
  userValidator.validateToken,
  auth.authenticateToken,
  usersController.logout
);

router.get('/',
  userValidator.validateToken,
  auth.authenticateToken,
  auth.authorize,
  usersController.getAll
);

router.post('/:userId/roles',
  userValidator.validateToken,
  auth.authenticateToken,
  auth.authorize,
  userValidator.validateId({ userId: paramOptions.REQ_PARAMS }),
  userValidator.validateRoles,
  usersController.setRoles
);

router.delete('/:userId/',
  userValidator.validateToken,
  auth.authenticateToken,
  auth.authorize,
  userValidator.validateId({ userId: paramOptions.REQ_PARAMS }),
  usersController.deleteById
);

module.exports = router;
