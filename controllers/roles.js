'use strict';

const { Role } = require('../models/role');
const arrayUtil = require('../utils/array');
const roleDbUtil = require('../utils/roleDbUtil');

exports.getAll = async (req, res, next) => {
  try {
    let response;

    const roles = await roleDbUtil.getAll();

    response = {
      "statusCode": 200,
      "message": roles
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
    const { name, status } = req.body;
    let { permissions, policies } = req.body;
    let response;

    // Remove duplicate permissions
    permissions = arrayUtil.removeDuplicates(permissions);

    // Remove duplicate policies
    policies = arrayUtil.removeDuplicates(policies);

    // Check if there is an existing role with the same name
    const roles = await roleDbUtil.getAllNames();

    for (const role of roles) {
      if (role.name === name) {
        response = {
          "statusCode": 200,
          "message": `Role name already exists. (roleId: ${role._id})`
        };
        console.log(response);
        res.status(response.statusCode).json(response);
        return;
      }
    }

    // Create newRole document
    const newRole = new Role({
      "name": name,
      "permissions": permissions,
      "policies": policies,
      "status": status
    });

    // Save the newRole document to the roles collection of the database
    const savedRole = await roleDbUtil.save(newRole);

    // Send response
    response = {
      "statusCode": 200,
      "message": "Role created successfully"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  } catch (err) {
    return next(err);
  }
};

exports.setPermissions = async (req, res, next) => {
  try {
    const { roleId } = req.params;
    let { permissions } = req.body;
    let response;

    // Remove duplicate permissions
    permissions = arrayUtil.removeDuplicates(permissions);

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

    // Update role's permissions
    dbResponse.role.permissions = permissions;

    // Update role's document in the database
    await roleDbUtil.save(dbResponse.role);

    // Send response
    response = {
      "statusCode": 200,
      "message": `Role's permissions set to [${dbResponse.role.permissions}]`
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
    const { roleId } = req.params;
    const { status } = req.body;
    let response;

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

    // Update role's status
    dbResponse.role.status = status;

    // Update role's document in the database
    await roleDbUtil.save(dbResponse.role);

    // Send response
    response = {
      "statusCode": 200,
      "message": `Role's status set to ${dbResponse.role.status}`
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
    const { roleId } = req.params;
    let response;

    // Delete role with the provided roleId
    const dbResponse = await roleDbUtil.deleteById(roleId);

    // Check if roleId matches an existing role
    if (!dbResponse) {
      response = {
        "statusCode": 404,
        "message": "roleId does not match any existing role"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Send response
    response = {
      "statusCode": 200,
      "message": "Role deleted successfully"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  } catch (err) {
    return next(err);
  }
};
