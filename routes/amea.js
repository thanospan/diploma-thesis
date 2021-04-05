'use strict';

const express = require('express');

const ameaController = require('../controllers/amea');
const userValidator = require('../utils/userValidator');
const auth = require('../auth/auth');

const router = express.Router();

router.get('/',
  userValidator.validateToken,
  auth.authenticateToken,
  auth.authorize,
  ameaController.getAll
);

module.exports = router;
