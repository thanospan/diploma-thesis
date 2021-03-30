'use strict';

const mongoose = require('mongoose');

const { EmailToken } = require('../models/emailToken');

exports.save = async (emailToken) => {
  const savedEmailToken = await emailToken.save();

  return savedEmailToken;
};

exports.getByValue = async (value) => {
  let response;

  // Search for emailToken with the provided value
  const emailToken = await EmailToken.findOne({ "value": value }).exec();

  // Check if there is an emailToken with this value
  if (!emailToken) {
    response = {
      "emailToken": null,
      "message": "emailToken value does not match any existing emailToken"
    };
  } else {
    response = {
      "emailToken": emailToken,
      "message": "emailToken value matches an existing emailToken"
    };
  }

  return response;
};
