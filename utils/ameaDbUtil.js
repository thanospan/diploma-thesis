'use strict';

const mongoose = require('mongoose');

const { Amea } = require('../models/amea');
const { Club } = require('../models/club');
const ameaMasking = require('./ameaMasking');
const clubMasking = require('./clubMasking');
const { policyStatus } = require('../models/policy');

exports.getAll = async (policies) => {
  const ameaPolicy = policies.find(policy => ((policy.resource === "amea") && (policy.status === policyStatus.ACTIVE))); 
  const clubPolicy = policies.find(policy => ((policy.resource === "club") && (policy.status === policyStatus.ACTIVE))); 

  const ameaPipeline = ameaMasking.buildPipeline(ameaPolicy);
  const clubPipeline = clubMasking.buildPipeline(clubPolicy);

  let amea;
  /*
  ameaPipeline and clubPipeline are [] only if the role has policies for the amea and clubs resources
  with both excluded and masked array fields set to []. That means that the user can access the resources without any constraint.
  If the role does not have a policy for the resource, the buildPipeline function will apply the default data masking.
  */
  if ((ameaPipeline.length === 0) && (clubPipeline.length === 0)) {
    amea = await Amea.find().populate('club').exec();

    return amea;
  }

  ameaPipeline.push({
    $lookup: {
      from: "clubs",
      pipeline: clubPipeline,
      as: "club"
    }
  })

  amea = await Amea.aggregate(ameaPipeline);
  
  return amea;
};
