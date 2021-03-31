'use strict';

const policyDbUtil = require('../utils/policyDbUtil');
const arrayUtil = require('../utils/array');
const { Policy } = require('../models/policy');

exports.create = async (req, res, next) => {
  try {
    const { resource, status } = req.body;
    let { excluded, masked } = req.body;
    let response;

    // Remove duplicate excluded fields
    excluded = [...new Set(excluded)];

    // Remove duplicate masked fields
    masked = [...new Set(masked)];

    // Check if there is an existing policy with the same excluded and masked fields on the provided resource
    const policies = await policyDbUtil.getAll();

    for (const policy of policies) {
      if ((policy.resource === resource) &&
          arrayUtil.areEqual(policy.excluded, excluded) &&
          arrayUtil.areEqual(policy.masked, masked))
      {
        response = {
          "statusCode": 200,
          "message": `Policy already exists. (policyId: ${policy._id})`
        };
        console.log(response);
        res.status(response.statusCode).json(response);
        return;
      }
    }

    // Create newPolicy document
    const newPolicy = new Policy({
      "resource": resource,
      "excluded": excluded,
      "masked": masked,
      "status": status
    });

    // Save the newPolicy document to the policies collection of the database
    const savedPolicy = await policyDbUtil.save(newPolicy);

    // Send response
    response = {
      "statusCode": 200,
      "message": "Policy created successfully"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  } catch (err) {
    return next(err);
  }
};
