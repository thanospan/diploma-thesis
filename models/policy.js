'use strict';

const mongoose = require('mongoose');

const safeameaMaskedConn = require('../connections/safeameaMaskedDb');

const policyStatus = {
  "ACTIVE": "active",
  "INACTIVE": "inactive"
};

const Schema = mongoose.Schema;

const policySchema = new Schema({
  resource: { type: String, required: true },
  excluded: { type: [String], required: true },
  masked: { type: [String], required: true },
  status: { type: String, enum: Object.values(policyStatus), default: policyStatus.ACTIVE }
});

const Policy = safeameaMaskedConn.model('Policy', policySchema, 'policies');

module.exports = {
  policyStatus,
  Policy
};
