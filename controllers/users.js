'use strict';

const userDbUtil = require('../utils/userDbUtil');
const emailTokenDbUtil = require('../utils/emailTokenDbUtil');
const hashUtil = require('../utils/hash');
const tokenUtil = require('../utils/token');
const emailUtil = require('../utils/email');
const { emailStatus, User } = require('../models/user');
const { EmailToken } = require('../models/emailToken');

exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let response;

    // Search for already registered user with the provided email address
    const dbResponse = await userDbUtil.getByEmail(email);

    // Check if there is another registered user with this email address
    if (dbResponse.user) {
      response = {
        "statusCode": 200,
        "message": dbResponse.message
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Hash password
    const hashedPassword = await hashUtil.generate(password);

    // Create a newUser document
    const newUser = new User({
      "email.value": email,
      "password": hashedPassword
    });

    // Save the newUser to the users collection of the database
    const savedUser = await userDbUtil.save(newUser);

    // Create a newEmailToken document
    const newEmailToken = new EmailToken({
      "owner": savedUser,
      "value": tokenUtil.generate()
    });

    // Save the newEmailToken document to the emailTokens collection of the database
    const savedEmailToken = await emailTokenDbUtil.save(newEmailToken);

    // Send verification email
    const emailResponse = await emailUtil.sendVerificationEmail(savedUser._id, savedEmailToken.value, email);

    // Send response
    response = {
      "statusCode": 200,
      "message": "User created successfully. Verification email sent."
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  } catch (err) {
    return next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const emailToken = req.header('emailToken');
    let response;
    let dbResponse;

    // Search for emailToken with the provided value
    dbResponse = await emailTokenDbUtil.getByValue(emailToken);

    // Check if there is an emailToken with this value
    if (!dbResponse.emailToken) {
      response = {
        "statusCode": 404,
        "message": dbResponse.message
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Check if emailToken owner id is the same as the provided userId
    if (dbResponse.emailToken.owner._id.toString() !== userId) {
      response = {
        "statusCode": 400,
        "message": "The provided emailToken and userId do not match"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Search for registered user with the provided userIdd
    dbResponse = await userDbUtil.getById(userId);

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

    // Check if the email address is already verified
    if (dbResponse.user.email.status === emailStatus.ACCEPTED) {
      response = {
        "statusCode": 200,
        "message": `Email address is already verified`
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Verify email address
    dbResponse.user.email.status = emailStatus.ACCEPTED;

    // Update the user's document in the database
    await userDbUtil.save(dbResponse.user);

    // Send response
    response = {
      "statusCode": 200,
      "message": "Email address is now verified"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  } catch (err) {
    return next(err);
  }
  console.log('Verify Email');
  res.send('Verify Email');
};
