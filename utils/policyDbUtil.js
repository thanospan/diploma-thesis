'use strict';

const mongoose = require('mongoose');

const { Policy } = require('../models/policy');

exports.getAll = async () => {
  const policies = await Policy.find().exec();

  return policies;
};

exports.save = async (policy) => {
  const savedPolicy = await policy.save();

  return savedPolicy;
};

exports.deleteById = async (policyId) => {
  const deletedPolicy = await Policy.findByIdAndRemove(policyId);

  return deletedPolicy;
};
