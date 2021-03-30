'use strict';

const bcrypt = require('bcrypt');

exports.generate = async (plaintext) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(plaintext, saltRounds);

  return hash;
};

exports.compare = async (plaintext, hash) => {
  const areEqual = await bcrypt.compare(plaintext, hash);

  return areEqual;
};
