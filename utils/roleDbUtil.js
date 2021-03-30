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
