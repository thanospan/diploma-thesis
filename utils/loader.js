'use strict';

class Loader {
  loaderId;

  start(msg) {
    const dots = ["", ".", "..", "..."];
    let i = 0;
    this.loaderId = setInterval(() => {
      process.stdout.clearLine();
      process.stdout.write(`\r${msg}` + dots[i++]);
      i = i % dots.length;
    }, 250);
    return this.loaderId;
  }

  stop() {
    clearInterval(this.loaderId);
    return;
  }
}

module.exports = {
  Loader
};
