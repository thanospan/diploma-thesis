'use strict';

const mongoose = require('mongoose');

const { Permission } = require('../models/permission');

exports.getAll = async () => {
  const permissions = await Permission.find().exec();

  return permissions;
};

exports.save = async (permission) => {
  const savedPermission = await permission.save();

  return savedPermission;
};

exports.deleteById = async (permissionId) => {
  const deletedPermission = await Permission.findByIdAndRemove(permissionId);

  return deletedPermission;
};
