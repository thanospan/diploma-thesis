'use strict';

const { Role } = require('../models/role');

exports.create = (req, res, next) => {
  console.log('Create Role');
  res.send('Create Role');
};
