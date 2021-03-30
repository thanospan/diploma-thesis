'use strict';

const mongoose = require('mongoose');

const safeameaMaskedConn = require('../connections/safeameaMaskedDb');

const roleStatus = {
  "ACTIVE": "active",
  "INACTIVE": "inactive"
};

const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  permissions: { type: [{ type: Schema.Types.ObjectId, ref: 'Permission' }], required: true },
  policies: { type: [{ type: Schema.Types.ObjectId, ref: 'Policy' }], required: true },
  status: { type: String, enum: Object.values(roleStatus), default: roleStatus.ACTIVE }
}, { timestamps: true });

const Role = safeameaMaskedConn.model('Role', roleSchema, 'roles');

module.exports = {
  roleStatus,
  Role
};
