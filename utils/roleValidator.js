'use strict';

const validator = require('validator');

const { roleStatus } = require('../models/role');
const permissionDbUtil = require('./permissionDbUtil');
const policyDbUtil = require('./policyDbUtil');
const roleDbUtil = require('./roleDbUtil');
const arrayUtil = require('./array');

exports.validateName = (req, res, next) => {
  let { name } = req.body;
  let response;

  // Check if role name is provided
  if (!name) {
    response = {
      "statusCode": 400,
      "message": "No role name provided"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  name = name + '';

  // Check if name is alphanumeric
  if (!validator.isAlphanumeric(name)) {
    response = {
      "statusCode": 400,
      "message": "Invalid role name"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  return next();
};

exports.validatePermissions = async (req, res, next) => {
  try {
    let reqPermissions = req.body.permissions;
    let response;

    // Check if permissions array is provided
    if (!reqPermissions) {
      response = {
        "statusCode": 400,
        "message": "No permissions array provided"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Check if permissions is an array
    if (!Array.isArray(reqPermissions)) {
      response = {
        "statusCode": 400,
        "message": "permissions is not an array"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Get all existing permissions from the database
    const permissions = await permissionDbUtil.getAll();

    // Validate the provided permissions' ObjectIDs
    const permissionsIds = permissions.map(permission => permission._id.toString());
    for (const reqPermission of reqPermissions) {
      if (!permissionsIds.includes(reqPermission)) {
        response = {
          "statusCode": 400,
          "message": "Invalid permissions"
        };
        console.log(response);
        res.status(response.statusCode).json(response);
        return;
      }
    }

    // Check if the provided permissions array contains multiple permissions for the same endpoint
    reqPermissions = arrayUtil.removeDuplicates(reqPermissions);
    const endpoints = reqPermissions.map(reqPermission => {
      return permissions.find(permission => (permission._id.toString() === reqPermission)).endpoint;
    });

    if (endpoints.length !== arrayUtil.removeDuplicates(endpoints).length) {
      response = {
        "statusCode": 400,
        "message": "permissions array should not contain multiple permissions for the same endpoint"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    return next();
  } catch (err) {
    return next(err);
  }
};

exports.validatePolicies = async (req, res, next) => {
  try {
    let reqPolicies = req.body.policies;
    let response;

    // Check if policies array is provided
    if (!reqPolicies) {
      response = {
        "statusCode": 400,
        "message": "No policies array provided"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Check if policies is an array
    if (!Array.isArray(reqPolicies)) {
      response = {
        "statusCode": 400,
        "message": "policies is not an array"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Get all existing policies ObjectIDs from the database
    let policies = await policyDbUtil.getAllIds();
    policies = policies.map(policy => policy._id.toString());

    // Validate the provided policies
    let isValidPolicy = true;
    for (const reqPolicy of reqPolicies) {
      if (!policies.includes(reqPolicy)) {
        isValidPolicy = false;
        break;
      }
    }

    if (!isValidPolicy) {
      response = {
        "statusCode": 400,
        "message": "Invalid policies"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    return next();
  } catch (err) {
    return next(err);
  }
};

exports.validateStatus = (req, res, next) => {
  let { status } = req.body;
  let response;

  // Check if role status is provided
  if (!status) {
    response = {
      "statusCode": 400,
      "message": "No role status provided"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  status = status + '';

  // Validate role status
  if (!Object.values(roleStatus).includes(status)) {
    response = {
      "statusCode": 400,
      "message": "Invalid role status"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  return next();
};

exports.validateId = async (req, res, next) => {
  try {
    let { roleId } = req.params;
    let response;

    // Check if roleId is provided
    if (!roleId) {
      response = {
        "statusCode": 400,
        "message": "No roleId provided"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    roleId = roleId + '';

    // Validate roleId
    // roleId should be a valid MongoDB ObjectID
    if (!validator.isMongoId(roleId)) {
      response = {
        "statusCode": 400,
        "message": "Invalid roleId format"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Search for role with the provided roleId
    const dbResponse = await roleDbUtil.getById(roleId);

    // Check if there is a role with this roleId
    if (!dbResponse.role) {
      response = {
        "statusCode": 404,
        "message": dbResponse.message
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    res.locals.role = dbResponse.role;
    return next();
  } catch (err) {
    return next(err);
  }
};
