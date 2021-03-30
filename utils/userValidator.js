'use strict';

const validator = require('validator');

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
