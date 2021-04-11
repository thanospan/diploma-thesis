'use strict';

const fs = require('fs').promises;

const coordsUtil = require('../utils/coords');
const { Loader } = require('../utils/loader');

const center = { lat: 38.234809, lng: 21.748981 };
const radius = 100; // meters
let coords = [];

const loader = new Loader();

(async () => {
  try {
    loader.start("---Saving coordinates to coords.csv");

    for (let i = 0; i < 5000; i++) {
      coords.push(coordsUtil.getCoordsWithinRadius(center, radius));
      // console.log(coords[i].lat + ', ' + coords[i].lng);
    }

    await fs.writeFile('coords.csv', 'latitude, longitude\n', () => {});
    for (const coordsEl of coords) {
      await fs.appendFile('coords.csv', coordsEl.lat + ', ' + coordsEl.lng + '\n', () => {});
    }

    loader.stop()
    console.log('\n---Done');
    process.exit();
  } catch (err) {
    loader.stop()
    console.log(err);
    process.exit();
  }
})();
