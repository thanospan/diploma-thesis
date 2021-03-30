'use strict';

const userDbUtil = require('../utils/userDbUtil');
const hashUtil = require('../utils/hash');

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
