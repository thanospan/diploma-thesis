'use strict';

const validator = require('validator');

exports.validateEmailTokenValue = (req, res, next) => {
  let emailToken = req.header('emailToken');
  let response;

  // Check if emailToken is provided
  if (!emailToken) {
    response = {
      "statusCode": 400,
      "message": "No emailToken provided"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  emailToken = emailToken + '';

  // Validate emailToken
  // emailToken should be a valid v4 UUID
  if (!validator.isUUID(emailToken, 4)) {
    response = {
      "statusCode": 400,
      "message": "Invalid emailToken format"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  }

  return next();
};
