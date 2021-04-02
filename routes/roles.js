'use strict';

const express = require('express');

const rolesController = require('../controllers/roles');
const userValidator = require('../utils/userValidator');
const roleValidator = require('../utils/roleValidator');
const auth = require('../auth/auth');

const router = express.Router();

router.post('/',
  userValidator.validateToken,
  auth.authenticateToken,
  auth.authorize,
  roleValidator.validateName,
  roleValidator.validatePermissions,
  roleValidator.validatePolicies,
  roleValidator.validateStatus,
  rolesController.create
);

module.exports = router;
