'use strict';

const express = require('express');

const rolesController = require('../controllers/roles');
const userValidator = require('../utils/userValidator');
const roleValidator = require('../utils/roleValidator');
const auth = require('../auth/auth');

const router = express.Router();

router.get('/',
  userValidator.validateToken,
  auth.authenticateToken,
  auth.authorize,
  rolesController.getAll
);

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

router.delete('/:roleId/',
  userValidator.validateToken,
  auth.authenticateToken,
  roleValidator.validateId,
  auth.authorize,
  rolesController.deleteById
);

module.exports = router;
