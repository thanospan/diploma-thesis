'use strict';

const userDbUtil = require('../utils/userDbUtil');
const emailTokenDbUtil = require('../utils/emailTokenDbUtil');
const hashUtil = require('../utils/hash');
const tokenUtil = require('../utils/token');
const emailUtil = require('../utils/email');
const { User } = require('../models/user');
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
