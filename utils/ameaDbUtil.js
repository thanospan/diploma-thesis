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

  let ameaPipeline = [];
  let clubPipeline = [];

  clubPipeline.push({
    $match: {
      $expr: {
        $in: [ "$_id", "$$club_id" ]
      }
    }
  });

  clubPipeline = [
    ...clubPipeline,
    ...clubMasking.buildPipeline(clubPolicy)
  ];

  ameaPipeline.push({
    $lookup: {
      from: "clubs",
      let: { club_id: "$club" },
      pipeline: clubPipeline,
      as: "club"
    }
  });

  ameaPipeline = [
    ...ameaPipeline,
    ...ameaMasking.buildPipeline(ameaPolicy)
  ];

  const amea = await Amea.aggregate(ameaPipeline);
  
  return amea;
};
