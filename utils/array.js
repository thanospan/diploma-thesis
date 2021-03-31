'use strict';

exports.removeDuplicates = (array) => {
  return [...new Set(array)];
};

exports.areEqual = (x, y) => {
  if (x.length !== y.length) {
    return false;
  }

  for (let i = 0; i < x.length; i++) {
    if (!y.includes(x[i])) {
      return false;
    }
  }

  return true;
};
