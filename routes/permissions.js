'use strict';

const express = require('express');

const permissionsController = require('../controllers/permissions');
const userValidator = require('../utils/userValidator');
const permissionValidator = require('../utils/permissionValidator');
const auth = require('../auth/auth');

const router = express.Router();

router.get('/',
  userValidator.validateToken,
  auth.authenticateToken,
  auth.authorize,
  permissionsController.getAll
);

router.post('/',
  userValidator.validateToken,
  auth.authenticateToken,
  auth.authorize,
  permissionValidator.validateEndpoint,
  permissionValidator.validateMethods,
  permissionValidator.validateStatus,
  permissionsController.create
);

router.delete('/:permissionId/',
  userValidator.validateToken,
  auth.authenticateToken,
  permissionValidator.validateId,
  auth.authorize,
  permissionsController.deleteById
);

module.exports = router;
