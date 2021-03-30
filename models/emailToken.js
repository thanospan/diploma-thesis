'use strict';

const mongoose = require('mongoose');

const safeameaMaskedConn = require('../connections/safeameaMaskedDb');

const Schema = mongoose.Schema;

const emailTokenSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  value: { type: String, required: true, unique: true },
  createdAt: { type: Date, expires: '1h', default: Date.now }
});

const EmailToken = safeameaMaskedConn.model('EmailToken', emailTokenSchema, 'emailTokens');

module.exports = {
  EmailToken
};
