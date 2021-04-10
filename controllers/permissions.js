'use strict';

const permissionDbUtil = require('../utils/permissionDbUtil');
const arrayUtil = require('../utils/array');
const { Permission } = require('../models/permission');

exports.getAll = async (req, res, next) => {
  try {
    let response;

    const permissions = await permissionDbUtil.getAll();

    response = {
      "statusCode": 200,
      "message": permissions
    };
    // console.log(JSON.stringify(response, null, 2));
    console.log({ statusCode: response.statusCode, message: "Retrieved all permissions successfully" });
    res.status(response.statusCode).json(response.message);
    return;
  } catch(err) {
    return next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { endpoint, role, status } = req.body;
    let { methods } = req.body;
    let response;

    // Remove duplicate methods
    methods = arrayUtil.removeDuplicates(methods);

    // Check if there is an existing permission with the same methods on the provided endpoint
    const permissions = await permissionDbUtil.getAll();

    for (const permission of permissions) {
      if ((permission.endpoint === endpoint) && arrayUtil.areEqual(permission.methods, methods)) {
        response = {
          "statusCode": 200,
          "message": `Permission already exists. (permissionId: ${permission._id})`
        };
        console.log(response);
        res.status(response.statusCode).json(response);
        return;
      }
    }

    // Create newPermission document
    const newPermission = new Permission({
      "endpoint": endpoint,
      "methods": methods,
      "status": status
    });

    // Save the newPermission document to the permissions collection of the database
    const savedPermisson = await permissionDbUtil.save(newPermission);

    // Send response
    response = {
      "statusCode": 200,
      "message": "Permission created successfully"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  } catch (err) {
    return next(err);
  }
};

exports.setMethods = async (req, res, next) => {
  try {
    const { permissionId } = req.params;
    // The permission with this permissionId is saved to res.locals.permission during permissionId validation
    let { methods } = req.body;
    let response;

    // Remove duplicate methods
    methods = arrayUtil.removeDuplicates(methods);

    // Check if there is an existing permission with the same methods on the provided endpoint
    const permissions = await permissionDbUtil.getAll();

    for (const permission of permissions) {
      if ((permission.endpoint === res.locals.permission.endpoint) && arrayUtil.areEqual(permission.methods, methods)) {
        response = {
          "statusCode": 200,
          "message": `Permission already exists. (permissionId: ${permission._id})`
        };
        console.log(response);
        res.status(response.statusCode).json(response);
        return;
      }
    }

    // Update permission's methods
    res.locals.permission.methods = methods;

    // Update the permission's document in the database
    await permissionDbUtil.save(res.locals.permission);

    // Send response
    response = {
      "statusCode": 200,
      "message": `Permission's methods set to [${res.locals.permission.methods}]`
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
    const { permissionId } = req.params;
    // The permission with this permissionId is saved to res.locals.permission during permissionId validation
    const { status } = req.body;
    let response;

    // Update permission's status
    res.locals.permission.status = status;

    // Update the permission's document in the database
    await permissionDbUtil.save(res.locals.permission);

    // Send response
    response = {
      "statusCode": 200,
      "message": `Permission's status set to ${res.locals.permission.status}`
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
    const { permissionId } = req.params;
    // The permission with this permissionId is saved to res.locals.permission during permissionId validation
    let response;

    // Delete permission with the provided permissionId
    const dbResponse = await permissionDbUtil.deleteById(permissionId);

    // Send response
    response = {
      "statusCode": 200,
      "message": "Permission deleted successfully"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  } catch (err) {
    return next(err);
  }
};
