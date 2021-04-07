'use strict';

const validator = require('validator');

const { getParam } = require('./param');
const resources = require('../constants/resources');
const { policyStatus } = require('../models/policy');
const policyDbUtil = require('./policyDbUtil');

exports.validateResource = (req, res, next) => {
  let { resource } = req.body;
  let response;

  // Check if resource is provided
  if (!resource) {
    response = {
      "statusCode": 400,
      "message": "No resource provided"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  // Validate resource
  if (!resources.getAllNames().includes(resource)) {
    response = {
      "statusCode": 400,
      "message": "Invalid resource"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  return next();
};

exports.validateExcluded = (options) => {
  return (req, res, next) => {
    const resource = getParam({
      param: "resource",
      option: options.resource,
      obj: (options.resource.split(".")[0] === "req") ? req : res
    });
    let { excluded } = req.body;
    let response;

    // Check if excluded array is provided
    if (!excluded) {
      response = {
        "statusCode": 400,
        "message": "No excluded array provided"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Check if excluded parameter is an array
    if (!Array.isArray(excluded)) {
      response = {
        "statusCode": 400,
        "message": "excluded is not an array"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Validate excluded array
    for (const excludedField of excluded) {
      if (!resources.getResourceFields(resource).includes(excludedField)) {
        response = {
          "statusCode": 400,
          "message": "Invalid excluded fields"
        };
        console.log(response);
        res.status(response.statusCode).json(response);
        return;
      }
    }

    return next();
  }
};

exports.validateMasked = (options) => {
  return (req, res, next) => {
    const resource = getParam({
      param: "resource",
      option: options.resource,
      obj: (options.resource.split(".")[0] === "req") ? req : res
    });
    let { masked } = req.body;
    let response;

    // Check if masked array is provided
    if (!masked) {
      response = {
        "statusCode": 400,
        "message": "No masked array provided"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Check if masked parameter is an array
    if (!Array.isArray(masked)) {
      response = {
        "statusCode": 400,
        "message": "masked is not an array"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Validate masked array
    for (const maskedField of masked) {
      if (!resources.getResourceFields(resource).includes(maskedField)) {
        response = {
          "statusCode": 400,
          "message": "Invalid masked fields"
        };
        console.log(response);
        res.status(response.statusCode).json(response);
        return;
      }
    }

    return next();
  }
};

exports.validateStatus = (req, res, next) => {
  let { status } = req.body;
  let response;

  // Check if policy status is provided
  if (!status) {
    response = {
      "statusCode": 400,
      "message": "No policy status provided"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  status = status + '';

  // Validate policy status
  if (!Object.values(policyStatus).includes(status)) {
    response = {
      "statusCode": 400,
      "message": "Invalid policy status"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  return next();
};

exports.validateId = async (req, res, next) => {
  try {
    let { policyId } = req.params;
    let response;

    // Check if policyId is provided
    if (!policyId) {
      response = {
        "statusCode": 400,
        "message": "No policyId provided"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    policyId = policyId + '';

    // Validate policyId
    // policyId should be a valid MongoDB ObjectID
    if (!validator.isMongoId(policyId)) {
      response = {
        "statusCode": 400,
        "message": "Invalid policyId format"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

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

    res.locals.policy = dbResponse.policy;
    // res.locals.resource is used for excluded and masked arrays validation above
    res.locals.resource = dbResponse.policy.resource;
    return next();
  } catch (err) {
    return next(err);
  }
};
