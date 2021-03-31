'use strict';

const mongoose = require('mongoose');

const { Policy } = require('../models/policy');

exports.getAll = async () => {
  const policies = await Policy.find().exec();

  return policies;
};

exports.getById = async (policyId) => {
  let response;

  // Search for policy with the provided policyId
  const policy = await Policy.findOne({ "_id": policyId }).exec();

  // Check if there is a policy with this policyId
  if (!policy) {
    response = {
      "policy": null,
      "message": "policyId does not match any existing policy"
    };
  } else {
    response = {
      "policy": policy,
      "message": "policyId matches an existing policy"
    };
  }

  return response;
};

exports.save = async (policy) => {
  const savedPolicy = await policy.save();

  return savedPolicy;
};

exports.deleteById = async (policyId) => {
  const deletedPolicy = await Policy.findByIdAndRemove(policyId);

  return deletedPolicy;
};
