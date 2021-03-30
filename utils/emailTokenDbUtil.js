'use strict';

const mongoose = require('mongoose');

const { EmailToken } = require('../models/emailToken');

exports.save = async (emailToken) => {
  const savedEmailToken = await emailToken.save();

  return savedEmailToken;
};
