'use strict';

const userDbUtil = require('../utils/userDbUtil');
const emailTokenDbUtil = require('../utils/emailTokenDbUtil');
const hashUtil = require('../utils/hash');
const tokenUtil = require('../utils/token');
const emailUtil = require('../utils/email');
const arrayUtil = require('../utils/array');
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
    const user = res.locals.user;
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

    // Check if the email address is already verified
    if (user.email.status === emailStatus.ACCEPTED) {
      response = {
        "statusCode": 200,
        "message": `Email address is already verified`
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Verify email address
    user.email.status = emailStatus.ACCEPTED;

    // Update the user's document in the database
    await userDbUtil.save(user);

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
};

exports.login = async (req, res, next) => {
  try {
    let response;

    // Authenticated user
    const user = res.locals.authenticatedUser;

    // Check if the user's email address is verified
    if (user.email.status !== emailStatus.ACCEPTED) {
      response = {
        "statusCode": 403,
        "message": "Verify email address in order to login"
      };
      console.log(response);
      res.status(response.statusCode).json(response);
      return;
    }

    // Check if the user is already logged in
    // Logged out users have the default token
    if (user.token !== tokenUtil.DEFAULT_TOKEN) {
      response = {
        "statusCode": 200,
        "message": "User is already logged in"
      };
      console.log(response);
      res.set('token', user.token).status(response.statusCode).json(response);
      return;
    }

    // Generate token and update user's document - Log in
    user.token = tokenUtil.generate();

    // Update the user's document in the database
    await userDbUtil.save(user);

    // Send response
    response = {
      "statusCode": 200,
      "message": "User is now logged in"
    };
    console.log(response);
    res.set('token', user.token).status(response.statusCode).json(response);
    return;
  } catch (err) {
    return next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    let response;

    // Authenticated user
    const user = res.locals.authenticatedUser;

    // Set user's token to the default token - Log out
    user.token = tokenUtil.DEFAULT_TOKEN;

    // Update the user's document in the database
    await userDbUtil.save(user);

    // Send response
    response = {
      "statusCode": 200,
      "message": "User has been logged out"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  } catch (err) {
    return next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    let response;

    // Search for registered users
    const users = await userDbUtil.getAll();

    // Send response
    response = {
      "statusCode": 200,
      "message": users
    };
    console.log(JSON.stringify(response, null, 2));
    res.status(response.statusCode).json(response.message);
    return;
  } catch (err) {
    return next(err);
  }
};

exports.setRoles = async (req, res, next) => {
  try {
    const { userId } = req.params;
    let { roles } = req.body;
    const user = res.locals.user;
    let response;

    // Remove duplicate roles
    roles = arrayUtil.removeDuplicates(roles);

    // Set user's roles
    user.roles = roles;

    // Update the user's document in the database
    await userDbUtil.save(user);

    // Send response
    response = {
      "statusCode": 200,
      "message": `User's roles set to [${user.roles}]`
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
    const { userId } = req.params;
    let response;

    // Delete user with the provided userId
    const dbResponse = await userDbUtil.deleteById(userId);

    // Send response
    response = {
      "statusCode": 200,
      "message": "User deleted successfully"
    };
    console.log(response);
    res.status(response.statusCode).json(response);
    return;
  } catch (err) {
    return next(err);
  }
};
