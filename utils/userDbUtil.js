'use strict';

const mongoose = require('mongoose');

const { User } = require('../models/user');
const { Role } = require('../models/role');
const { Permission } = require('../models/permission');
const { Policy } = require('../models/policy');

exports.getByEmail = async (email) => {
  let response;

  // Search for user with the provided email address
  const user = await User.findOne({ "email.value": email })
    .populate({
      path: 'roles',
      populate: [
        { path: 'permissions' },
        { path: 'policies' }
      ]
    })
    .exec();

  // Check if there is a user with this email address
  if (!user) {
    response = {
      "user": null,
      "message": "email does not match any registered user"
    };
  } else {
    response = {
      "user": user,
      "message": "email matches a registered user"
    };
  }

  return response;
};

exports.getById = async (userId) => {
  let response;

  // Search for user with the provided userId
  const user = await User.findOne({ "_id": userId })
    .populate({
      path: 'roles',
      populate: [
        { path: 'permissions' },
        { path: 'policies' }
      ]
    })
    .exec();

  // Check if there is a user with this userId
  if (!user) {
    response = {
      "user": null,
      "message": "userId does not match any registered user"
    };
  } else {
    response = {
      "user": user,
      "message": "userId matches a registered user"
    };
  }

  return response;
};

exports.save = async (user) => {
  const savedUser = await user.save();

  return savedUser;
};
