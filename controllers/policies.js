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
    // console.log(JSON.stringify(response, null, 2));
    console.log({ statusCode: response.statusCode, message: "Retrieved all policies successfully" });
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
    excluded = arrayUtil.removeDuplicates(excluded);

    // Remove duplicate masked fields
    masked = arrayUtil.removeDuplicates(masked);

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

exports.setExcluded = async (req, res, next) => {
  try {
    const { policyId } = req.params;
    // The policy with this policyId is saved to res.locals.policy during policyId validation
    let { excluded } = req.body;
    let response;

    // Remove duplicate excluded fields
    excluded = arrayUtil.removeDuplicates(excluded);

    // Check if there is an existing policy with the same excluded and masked fields on the provided resource
    const policies = await policyDbUtil.getAll();

    for (const policy of policies) {
      if ((policy.resource === res.locals.policy.resource) &&
          arrayUtil.areEqual(policy.excluded, excluded) &&
          arrayUtil.areEqual(policy.masked, res.locals.policy.masked))
      {
        response = {
          "statusCode": 200,
          "message": `Policy already exists. (policyId: ${policy._id}`
        };
        console.log(response);
        res.status(response.statusCode).json(response);
        return;
      }
    }

    // Update the policy's excluded fields
    res.locals.policy.excluded = excluded;

    // Update the policy's document in the database
    await policyDbUtil.save(res.locals.policy);

    // Send response
    response = {
      "statusCode": 200,
      "message": `Policy's excluded fields set to [${res.locals.policy.excluded}]`
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  } catch (err) {
    return next(err);
  }
};

exports.setMasked = async (req, res, next) => {
  try {
    const { policyId } = req.params;
    // The policy with this policyId is saved to res.locals.policy during policyId validation
    let { masked } = req.body;
    let response;

    // Remove duplicate masked fields
    masked = arrayUtil.removeDuplicates(masked);

    // Check if there is an existing policy with the same excluded and masked fields on the provided resource
    const policies = await policyDbUtil.getAll();

    for (const policy of policies) {
      if ((policy.resource === res.locals.policy.resource) &&
          arrayUtil.areEqual(policy.excluded, res.locals.policy.excluded) &&
          arrayUtil.areEqual(policy.masked, masked))
      {
        response = {
          "statusCode": 200,
          "message": `Policy already exists. (policyId: ${policy._id}`
        };
        console.log(response);
        res.status(response.statusCode).json(response);
        return;
      }
    }

    // Update the policy's masked fields
    res.locals.policy.masked = masked;

    // Update the policy's document in the database
    await policyDbUtil.save(res.locals.policy);

    // Send response
    response = {
      "statusCode": 200,
      "message": `Policy's masked fields set to [${res.locals.policy.masked}]`
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
    // The policy with this policyId is saved to res.locals.policy during policyId validation
    const { status } = req.body;
    let response;

    // Update policy's status
    res.locals.policy.status = status;

    // Update the policy's document in the database
    await policyDbUtil.save(res.locals.policy);

    // Send response
    response = {
      "statusCode": 200,
      "message": `Policy's status set to ${res.locals.policy.status}`
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
    // The policy with this policyId is saved to res.locals.policy during policyId validation
    let response;

    // Delete policy with the provided policyId
    const dbResponse = await policyDbUtil.deleteById(policyId);

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
