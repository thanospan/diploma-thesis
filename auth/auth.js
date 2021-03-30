'use strict';

const userDbUtil = require('../utils/userDbUtil');
const hashUtil = require('../utils/hash');
const tokenUtil = require('../utils/token');
const { roleStatus } = require('../models/role');
const { permissionStatus } = require('../models/permission');

exports.authenticateEmailPass = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let response;

    // Check if password is provided
    if (!password) {
      response = {
        "statusCode": 400,
        "message": "No password provided"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Search for user with the provided email address
    const dbResponse = await userDbUtil.getByEmail(email);

    // Check if there is a user with this email address
    if (!dbResponse.user) {
      response = {
        "statusCode": 404,
        "message": dbResponse.message
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Check if the provided password is correct
    const passwordsMatch = await hashUtil.compare(password, dbResponse.user.password);

    if (!passwordsMatch) {
      response = {
        "statusCode": 401,
        "message": "Incorrect password"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Successful email, password authentication
    res.locals.authenticatedUser = dbResponse.user;

    return next();
  } catch (err) {
    return next(err);
  }
};

exports.authenticateToken = async (req, res, next) => {
  try {
    const { token } = req.headers;
    let response;

    // Check if the user is not logged in
    // Logged out users have the default token
    if (token === tokenUtil.DEFAULT_TOKEN) {
      response = {
        "statusCode": 404,
        "message": "User is not logged in"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Search for user with the provided token
    const dbResponse = await userDbUtil.getByToken(token);

    // Check if there is a user with this token
    if (!dbResponse.user) {
      response = {
        "statusCode": 404,
        "message": dbResponse.message
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Successful token authentication
    res.locals.authenticatedUser = dbResponse.user;

    return next();
  } catch (err) {
    return next(err);
  }
};

exports.authorize = async (req, res, next) => {
  try {
    const { token } = req.headers;
    let response;

    // Authenticated user
    const authenticatedUser = res.locals.authenticatedUser;
    // console.log(JSON.stringify(authenticatedUser, null, 2));

    // Request parameters
    let reqEndpoint = req.baseUrl + req.path;
    const reqMethod = req.method;

    // Check if userId parameter is passed
    if (req.params.userId) {
      // Replace userId with :userId
      reqEndpoint = reqEndpoint.replace(req.params.userId, ":userId");
    }

    // Remove trailing slash
    if (reqEndpoint.endsWith("/")) {
      reqEndpoint = reqEndpoint.slice(0, -1);
    }

    // console.log(reqEndpoint);
    // console.log(reqMethod);

    // Check if the user is authorized
    let isAuthorized = false;
    let authorizedRoles = [];

    authenticatedUser.roles.forEach(role => {
      if (role.status === roleStatus.ACTIVE) {
        role.permissions.forEach(permission => {
          if ((permission.status === permissionStatus.ACTIVE) &&
              permission.endpoint === reqEndpoint &&
              permission.methods.includes(reqMethod))
          {
            isAuthorized = true;
            authorizedRoles.push(role);
          }
        });
      }
    });

    // console.log(isAuthorized);
    // console.log(JSON.stringify(authorizedRoles, null, 2));

    if (!isAuthorized) {
      response = {
        "statusCode": 403,
        "message": "Unauthorized user"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Successful authorization
    res.locals.authorizedUser = authenticatedUser;
    res.locals.authorizedRoles = authorizedRoles;
    return next();
  } catch (err) {
    return next(err);
  }
};
