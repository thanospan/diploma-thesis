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

// Fisher–Yates shuffle
exports.shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};
