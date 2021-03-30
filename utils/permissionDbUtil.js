'use strict';

const mongoose = require('mongoose');

const { Permission } = require('../models/permission');

exports.getAll = async () => {
  const permissions = await Permission.find().exec();

  return permissions;
};

exports.getById = async (permissionId) => {
  let response;

  // Search for permission with the provided permissionId
  const permission = await Permission.findOne({ "_id": permissionId }).exec();

  // Check if there is a permission with this permissionId
  if (!permission) {
    response = {
      "permission": null,
      "message": "permissionId does not match any existing permission"
    };
  } else {
    response = {
      "permission": permission,
      "message": "permissionId matches an existing permission"
    };
  }

  return response;
};

exports.save = async (permission) => {
  const savedPermission = await permission.save();

  return savedPermission;
};

exports.deleteById = async (permissionId) => {
  const deletedPermission = await Permission.findByIdAndRemove(permissionId);

  return deletedPermission;
};
