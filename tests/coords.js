'use strict';

const fs = require('fs');

const coordsUtil = require('../utils/coords');

const center = { lat: 38.234809, lng: 21.748981 };
const radius = 100; // meters
let coords = [];

try {
  for (let i = 0; i < 5000; i++) {
    coords.push(coordsUtil.getCoordsWithinRadius(center, radius));
    // console.log(coords[i].lat + ', ' + coords[i].lng);
  }

  fs.writeFile('coords.csv', 'latitude, longitude\n', () => {});
  for (const coordsEl of coords) {
    fs.appendFile('coords.csv', coordsEl.lat + ', ' + coordsEl.lng + '\n', () => {});
  }

  console.log("---Coordinates saved to coords.csv");
} catch (err) {
  console.log(err);
}
