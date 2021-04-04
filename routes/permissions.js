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

router.post('/:permissionId/methods',
  userValidator.validateToken,
  auth.authenticateToken,
  auth.authorize,
  permissionValidator.validateId,
  permissionValidator.validateMethods,
  permissionsController.setMethods
);

router.post('/:permissionId/status',
  userValidator.validateToken,
  auth.authenticateToken,
  auth.authorize,
  permissionValidator.validateId,
  permissionValidator.validateStatus,
  permissionsController.setStatus
);

router.delete('/:permissionId/',
  userValidator.validateToken,
  auth.authenticateToken,
  auth.authorize,
  permissionValidator.validateId,
  permissionsController.deleteById
);

module.exports = router;
