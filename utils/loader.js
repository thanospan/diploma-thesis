'use strict';

const dots = ["", ".", "..", "..."];

exports.start = (msg) => {
  let i = 0;

  return setInterval(() => {
    process.stdout.clearLine();
    process.stdout.write(`\r${msg}` + dots[i++]);
    i = i % dots.length;
  }, 250);
};
