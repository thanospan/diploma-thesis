'use strict';

const mongoose = require('mongoose');

const safeameaMaskedConn = require('../connections/safeameaMaskedDb');
const tokenUtil = require('../utils/token');

const emailStatus = {
  "ACCEPTED": "accepted",
  "PENDING": "pending",
  "REJECTED": "rejected"
};

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    value: { type: String, unique: true, required: true },
    status: { type: String, enum: Object.values(emailStatus), default: emailStatus.PENDING }
  },
  password: { type: String, required: true },
  token: { type: String, default: tokenUtil.DEFAULT_TOKEN },
  roles: { type: [{ type: Schema.Types.ObjectId, ref: 'Role' }], required: true }
}, { timestamps: true });

const User = safeameaMaskedConn.model('User', userSchema, 'users');

module.exports = {
  emailStatus,
  User
};
