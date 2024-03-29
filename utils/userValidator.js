'use strict';

const validator = require('validator');

const { getParam } = require('./param');
const tokenUtil = require('../utils/token');
const userDbUtil = require('../utils/userDbUtil');
const roleDbUtil = require('../utils/roleDbUtil');
const arrayUtil = require('../utils/array');

exports.validateEmailValue = (req, res, next) => {
  let { email } = req.body;
  let response;

  // Check if email address is provided
  if (!email) {
    response = {
      "statusCode": 400,
      "message": "No email address provided"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  email = email + '';

  // Validate email address
  if (!validator.isEmail(email)) {
    response = {
      "statusCode": 400,
      "message": "Invalid email address format"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  return next();
};

exports.validatePassword = (req, res, next) => {
  let { password } = req.body;
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

  password = password + '';

  // Validate password
  const passwordOptions = {
    minLength: 5,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1
  };

  if (!validator.isStrongPassword(password, passwordOptions)) {
    response = {
      "statusCode": 400,
      "message": "The password should be at least 5 characters long " +
                 "containing at least 1 number, 1 lowercase letter, " +
                 "1 uppercase letter and 1 special character"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  return next();
};

exports.validateId = (options) => {
  return async (req, res, next) => {
    try {
      let userId = getParam({
        param: "userId",
        option: options.userId,
        obj: (options.userId.split(".")[0] === "req") ? req : res
      });
      let response;

      // Check if userId is provided
      if (!userId) {
        response = {
          "statusCode": 400,
          "message": "No userId provided"
        };
        console.log(response);
        res.status(response.statusCode).json(response);
        return;
      }

      userId = userId + '';

      // Validate userId
      // userId should be a valid MongoDB ObjectID
      if (!validator.isMongoId(userId)) {
        response = {
          "statusCode": 400,
          "message": "Invalid userId format"
        };
        console.log(response);
        res.status(response.statusCode).json(response);
        return;
      }

      // Search for registered user with the provided userId
      const dbResponse = await userDbUtil.getById(userId);

      // Check if there is a user with this userId
      if (!dbResponse.user) {
        response = {
          "statusCode": 404,
          "message": dbResponse.message
        };
        console.log(response);
        res.status(response.statusCode).json(response);
        return;
      }

      res.locals.user = dbResponse.user;
      return next();
    } catch (err) {
      return next(err);
    }
  }
};

exports.validateToken = (req, res, next) => {
  let { token } = req.headers;
  let response;

  // Check if token is provided
  if (!token) {
    response = {
      "statusCode": 400,
      "message": "No token provided"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  token = token + '';

  // Check if token is the default token
  if (token === tokenUtil.DEFAULT_TOKEN) {
    return next();
  }

  // Validate token
  // token should be a valid v4 UUID
  if (!validator.isUUID(token, 4)) {
    response = {
      "statusCode": 400,
      "message": "Invalid token format"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  return next();
};

exports.validateRoles = async (req, res, next) => {
  try {
    let reqRoles = req.body.roles;
    let response;

    // Check if roles array is provided
    if (!reqRoles) {
      response = {
        "statusCode": 400,
        "message": "No roles array provided"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Check if roles is an array
    if (!Array.isArray(reqRoles)) {
      response = {
        "statusCode": 400,
        "message": "roles is not an array"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Get all existing roles ObjectIDs from the database
    let roles = await roleDbUtil.getAllIds();
    roles = roles.map(role => role._id.toString());

    // Validate the provided roles
    for (const reqRole of reqRoles) {
      if (!roles.includes(reqRole)) {
        response = {
          "statusCode": 400,
          "message": "Invalid roles"
        };
        console.log(response);
        res.status(response.statusCode).json(response);
        return;
      }
    }

    return next();
  } catch (err) {
    return next(err);
  }
};
