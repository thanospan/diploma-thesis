'use strict';

const express = require('express');

const usersController = require('../controllers/users');
const userValidator = require('../utils/userValidator');

const router = express.Router();

router.post('/signup',
  userValidator.validateEmailValue,
  userValidator.validatePassword,
  usersController.signup
);

module.exports = router;
