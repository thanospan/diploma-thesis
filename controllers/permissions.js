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
    console.log(JSON.stringify(response, null, 2));
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

exports.setStatus = async (req, res, next) => {
  try {
    const { permissionId } = req.params;
    const { status } = req.body;
    let response;

    // Search for permission with the provided permissionId
    const dbResponse = await permissionDbUtil.getById(permissionId);

    // Check if there is a permission with this permissionId
    if (!dbResponse.permission) {
      response = {
        "statusCode": 404,
        "message": dbResponse.message
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Update permission's status
    dbResponse.permission.status = status;

    // Update the permission's document in the database
    await permissionDbUtil.save(dbResponse.permission);

    // Send response
    response = {
      "statusCode": 200,
      "message": `Permission's status set to ${dbResponse.permission.status}`
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
    let { methods } = req.body;
    let response;

    // Remove duplicate methods
    methods = arrayUtil.removeDuplicates(methods);

    // Search for permission with the provided permissionId
    const dbResponse = await permissionDbUtil.getById(permissionId);

    // Check if there is a permission with this permissionId
    if (!dbResponse.permission) {
      response = {
        "statusCode": 404,
        "message": dbResponse.message
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Check if there is an existing permission with the same methods on the provided endpoint
    const permissions = await permissionDbUtil.getAll();

    for (const permission of permissions) {
      if ((permission.endpoint === dbResponse.permission.endpoint) && arrayUtil.areEqual(permission.methods, methods)) {
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
    dbResponse.permission.methods = methods;

    // Update the permission's document in the database
    await permissionDbUtil.save(dbResponse.permission);

    // Send response
    response = {
      "statusCode": 200,
      "message": `Permission's methods set to [${dbResponse.permission.methods}]`
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
    let response;

    // Delete permission with the provided permissionId
    const dbResponse = await permissionDbUtil.deleteById(permissionId);

    // Check if permissionId matches an existing permission
    if (!dbResponse) {
      response = {
        "statusCode": 404,
        "message": "permissionId does not match any existing permission"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

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