'use strict';

const mongoose = require('mongoose');

const { Role } = require('../models/role');
const { Permission } = require('../models/permission');
const { Policy } = require('../models/policy');

exports.getAll = async () => {
  const roles = await Role.find()
    .populate('permissions policies')
    .exec();

  return roles;
};

exports.getAllNames = async () => {
  const roles = await Role.find({}, 'name').exec();

  return roles;
};

exports.getById = async (roleId) => {
  let response;

  // Search for role with the provided roleId
  const role = await Role.findOne({ "_id": roleId }).exec();

  // Check if there is a role with this roleId
  if (!role) {
    response = {
      "role": null,
      "message": "roleId does not match any existing role"
    };
  } else {
    response = {
      "role": role,
      "message": "roleId matches an existing role"
    };
  }

  return response;
}

exports.save = async (role) => {
  const savedRole = await role.save();

  return savedRole;
};

exports.deleteById = async (roleId) => {
  const deletedRole = await Role.findByIdAndRemove(roleId);

  return deletedRole;
};
