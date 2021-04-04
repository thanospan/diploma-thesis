'use strict';

const express = require('express');

const policiesController = require('../controllers/policies');
const userValidator = require('../utils/userValidator');
const policyValidator = require('../utils/policyValidator');
const { paramOptions } = require('../utils/param');
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
  policyValidator.validateExcluded({ resource: paramOptions.REQ_BODY }),
  policyValidator.validateMasked({ resource: paramOptions.REQ_BODY }),
  policyValidator.validateStatus,
  policiesController.create
);

router.post('/:policyId/excluded',
  userValidator.validateToken,
  auth.authenticateToken,
  auth.authorize,
  policyValidator.validateId,
  policyValidator.validateExcluded({ resource: paramOptions.RES_LOCALS }),
  policiesController.setExcluded
);

router.post('/:policyId/masked',
  userValidator.validateToken,
  auth.authenticateToken,
  auth.authorize,
  policyValidator.validateId,
  policyValidator.validateMasked({ resource: paramOptions.RES_LOCALS }),
  policiesController.setMasked
);

router.post('/:policyId/status',
  userValidator.validateToken,
  auth.authenticateToken,
  auth.authorize,
  policyValidator.validateId,
  policyValidator.validateStatus,
  policiesController.setStatus
);

router.delete('/:policyId/',
  userValidator.validateToken,
  auth.authenticateToken,
  auth.authorize,
  policyValidator.validateId,
  policiesController.deleteById
);

module.exports = router;
