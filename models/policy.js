'use strict';

const mongoose = require('mongoose');

const safeameaMaskedConn = require('../connections/safeameaMaskedDb');
const resources = require('../constants/resources');

const policyStatus = {
  "ACTIVE": "active",
  "INACTIVE": "inactive"
};

const Schema = mongoose.Schema;

const policySchema = new Schema({
  resource: { type: String, required: true },
  excluded: { type: [String], required: true },
  masked: { type: [String], required: true },
  status: { type: String, default: policyStatus.ACTIVE }
});

policySchema.pre('save', function(next) {
  if (!resources.getAllNames().includes(this.resource)) {
    return next(new Error('Invalid resource'));
  }

  for (const exlcudedField of this.excluded) {
    if (!resources.getResourceFields(this.resource).includes(exlcudedField)) {
      return next(new Error('Invalid excluded fields'));
    }
  }

  for (const maskedField of this.masked) {
    if (!resources.getResourceFields(this.resource).includes(maskedField)) {
      return next(new Error('Invalid masked fields'));
    }
  }

  if (!Object.values(policyStatus).includes(this.status)) {
    return next(new Error('Invalid policy status'));
  }

  return next();
});

const Policy = safeameaMaskedConn.model('Policy', policySchema, 'policies');

module.exports = {
  policyStatus,
  Policy
};
