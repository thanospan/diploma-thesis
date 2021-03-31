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

module.exports = router;
