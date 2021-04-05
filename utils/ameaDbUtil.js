'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');

const { Amea } = require('../models/amea');
const { Club } = require('../models/club');
const ameaMasking = require('./ameaMasking');

exports.getAll = async (policies) => {
  let ameaPolicy;
  let clubPolicy;
  let amea;

  for (const policy of policies) {
    if (policy.resource === "amea") {
      ameaPolicy = policy;
    }
    if (policy.resource === "club") {
      clubPolicy = policy;
    }
  }

  const ameaPipeline = ameaMasking.buildPipeline(ameaPolicy);

  // ameaPipeline is [] only if the role has a policy for the amea resource with both excluded and masked array fields set to []
  // If the role does not have this policy the buildPipeline function will apply the default data masking
  if (ameaPipeline.length === 0) {
    amea = await Amea.find().populate('club').exec();

    return amea;
  }

  amea = await Amea.aggregate(ameaPipeline);

  await Club.populate(amea, {
    path: "club",
    select: { "__v": 0 }
  });
  
  return amea;
};
