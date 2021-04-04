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
    const role = res.locals.role;
    let { permissions } = req.body;
    let response;

    // Remove duplicate permissions
    permissions = arrayUtil.removeDuplicates(permissions);

    // Update role's permissions
    role.permissions = permissions;

    // Update role's document in the database
    await roleDbUtil.save(role);

    // Send response
    response = {
      "statusCode": 200,
      "message": `Role's permissions set to [${role.permissions}]`
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  } catch (err) {
    return next(err);
  }
};

exports.setPolicies = async (req, res, next) => {
  try {
    const { roleId } = req.params;
    const role = res.locals.role;
    let { policies } = req.body;
    let response;

    // Remove duplicate policies
    policies = arrayUtil.removeDuplicates(policies);

    // Update role's policies
    role.policies = policies;

    // Update role's document in the database
    await roleDbUtil.save(role);

    // Send response
    response = {
      "statusCode": 200,
      "message": `Role's policies set to [${role.policies}]`
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
    const role = res.locals.role;
    const { status } = req.body;
    let response;

    // Update role's status
    role.status = status;

    // Update role's document in the database
    await roleDbUtil.save(role);

    // Send response
    response = {
      "statusCode": 200,
      "message": `Role's status set to ${role.status}`
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
