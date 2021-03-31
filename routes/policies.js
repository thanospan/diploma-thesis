'use strict';

const express = require('express');

const policiesController = require('../controllers/policies');
const userValidator = require('../utils/userValidator');
const policyValidator = require('../utils/policyValidator');
const auth = require('../auth/auth');

const router = express.Router();

router.get('/',
  userValidator.validateToken,
  auth.authenticateToken,
  auth.authorize,
  policiesController.getAll
);

router.post('/',
  userValidator.validateToken,
  auth.authenticateToken,
  auth.authorize,
  policyValidator.validateResource,
  policyValidator.validateExcluded,
  policyValidator.validateMasked,
  policyValidator.validateStatus,
  policiesController.create
);

router.post('/:policyId/excluded',
  userValidator.validateToken,
  auth.authenticateToken,
  policyValidator.validateId,
  auth.authorize,
  policyValidator.validateExcluded,
  policiesController.setExcluded
);

router.post('/:policyId/masked',
  userValidator.validateToken,
  auth.authenticateToken,
  policyValidator.validateId,
  auth.authorize,
  policyValidator.validateMasked,
  policiesController.setMasked
);

router.post('/:policyId/status',
  userValidator.validateToken,
  auth.authenticateToken,
  policyValidator.validateId,
  auth.authorize,
  policyValidator.validateStatus,
  policiesController.setStatus
);

router.delete('/:policyId/',
  userValidator.validateToken,
  auth.authenticateToken,
  policyValidator.validateId,
  auth.authorize,
  policiesController.deleteById
);

module.exports = router;
