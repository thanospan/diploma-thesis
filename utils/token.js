'use strict';

const uuid = require('uuid');

exports.DEFAULT_TOKEN = uuid.NIL;

exports.generate = () => {
  return uuid.v4();
};
