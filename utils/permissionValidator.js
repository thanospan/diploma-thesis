'use strict';

const validator = require('validator');

const { permissionMethods, permissionStatus } = require('../models/permission');
const endpoints = require('../constants/endpoints');

exports.validateEndpoint = (req, res, next) => {
  let { endpoint } = req.body;
  let response;

  // Check if endpoint is provided
  if (!endpoint) {
    response = {
      "statusCode": 400,
      "message": "No endpoint provided"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  // Validate endpoint
  if (!endpoints.includes(endpoint)) {
    response = {
      "statusCode": 400,
      "message": "Invalid endpoint"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  return next();
};

exports.validateMethods = (req, res, next) => {
  const { methods } = req.body;
  let response;

  // Check if methods is provided
  if (!methods) {
    response = {
      "statusCode": 400,
      "message": "No methods provided"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  // Check if methods parameter is an array;
  if (!Array.isArray(methods)) {
    response = {
      "statusCode": 400,
      "message": "methods is not an array"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  // Validate methods
  let isValidMethod = true;
  for (const method of methods) {
    if (!Object.values(permissionMethods).includes(method)) {
      isValidMethod = false;
      break;
    }
  }

  if (!isValidMethod) {
    response = {
      "statusCode": 400,
      "message": "Invalid methods"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  return next();
};

exports.validateStatus = (req, res, next) => {
  let { status } = req.body;
  let response;

  // Check if permission status is provided
  if (!status) {
    response = {
      "statusCode": 400,
      "message": "No permission status provided"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  status = status + '';

  // Validate permission status
  if (!Object.values(permissionStatus).includes(status)) {
    response = {
      "statusCode": 400,
      "message": "Invalid permission status"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  return next();
};

exports.validateId = (req, res, next) => {
  let { permissionId } = req.params;
  let response;

  // Check if permissionId is provided
  if (!permissionId) {
    response = {
      "statusCode": 400,
      "message": "No permissionId provided"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  permissionId = permissionId + '';

  // Validate permissionId
  // permissionId should be a valid MongoDB ObjectID
  if (!validator.isMongoId(permissionId)) {
    response = {
      "statusCode": 400,
      "message": "Invalid permissionId format"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  return next();
};
