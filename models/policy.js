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
  resource: { type: String, enum: Object.keys(resources), required: true },
  excluded: { type: [String], enum: Object.values(resources.amea), required: true },
  masked: { type: [String], enum: Object.values(resources.amea), required: true },
  status: { type: String, enum: Object.values(policyStatus), default: policyStatus.ACTIVE }
});

const Policy = safeameaMaskedConn.model('Policy', policySchema, 'policies');

module.exports = {
  policyStatus,
  Policy
};
