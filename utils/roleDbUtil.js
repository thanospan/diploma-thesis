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

exports.save = async (role) => {
  const savedRole = await role.save();

  return savedRole;
};

exports.deleteById = async (roleId) => {
  const deletedRole = await Role.findByIdAndRemove(roleId);

  return deletedRole;
};
