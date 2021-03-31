'use strict';

const policyDbUtil = require('../utils/policyDbUtil');
const arrayUtil = require('../utils/array');
const { Policy } = require('../models/policy');

exports.getAll = async (req, res, next) => {
  try {
    let response;

    const policies = await policyDbUtil.getAll();

    response = {
      "statusCode": 200,
      "message": policies
    };
    console.log(JSON.stringify(response, null, 2));
    res.status(response.statusCode).json(response.message);
    return;
  } catch (err) {
    return next(err);
  }
};

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

exports.setStatus = async (req, res, next) => {
  try {
    const { policyId } = req.params;
    const { status } = req.body;
    let response;

    // Search for policy with the provided policyId
    const dbResponse = await policyDbUtil.getById(policyId);

    // Check if there is a policy with this policyId
    if (!dbResponse.policy) {
      response = {
        "statusCode": 404,
        "message": dbResponse.message
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Update policy's status
    dbResponse.policy.status = status;

    // Update the policy's document in the database
    await policyDbUtil.save(dbResponse.policy);

    // Send response
    response = {
      "statusCode": 200,
      "message": `Policy's status set to ${dbResponse.policy.status}`
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  } catch (err) {
    return next(err);
  }
};

exports.deleteById = async (req, res, next) => {
  try {
    const { policyId } = req.params;
    let response;

    // Delete policy with the provided policyId
    const dbResponse = await policyDbUtil.deleteById(policyId);

    // Check if policyId matches an existing policy
    if (!dbResponse) {
      response = {
        "statusCode": 404,
        "message": "policyId does not match any existing policy"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Send response
    response = {
      "statusCode": 200,
      "message": "Policy deleted successfully"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  } catch (err) {
    return next(err);
  }
};
