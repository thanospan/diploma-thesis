'use strict';

const mongoose = require('mongoose');

const safeameaMaskedConn = require('../connections/safeameaMaskedDb');
const endpoints = require('../constants/endpoints');

const permissionStatus = {
  "ACTIVE": "active",
  "INACTIVE": "inactive"
};

const permissionMethods = {
  "GET": "GET",
  "POST": "POST",
  "PUT": "PUT",
  "DELETE": "DELETE",
  "PATCH": "PATCH"
};

const Schema = mongoose.Schema;

const permissionSchema = new Schema({
  endpoint: { type: String, enum: endpoints, required: true },
  methods: { type: [String], enum: Object.values(permissionMethods), required: true },
  status: { type: String, enum: Object.values(permissionStatus), default: permissionStatus.ACTIVE }
}, { timestamps: true });

const Permission = safeameaMaskedConn.model('Permission', permissionSchema, 'permissions');

module.exports = {
  permissionStatus,
  permissionMethods,
  Permission
};
