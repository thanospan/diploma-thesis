'use strict';

const userDbUtil = require('../utils/userDbUtil');
const hashUtil = require('../utils/hash');
const tokenUtil = require('../utils/token');

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
