'use strict';

const mongoose = require('mongoose');
const fs = require('fs').promises;

require('dotenv').config({ path: './config/.env' });
const safeameaConn = require('../connections/safeameaDb');
const { Club } = require('../models/club');
const { Loader } = require('../utils/loader');

const loader = new Loader();

(async () => {
  try {
    await safeameaConn;

    loader.start("---Saving clubs coordinates to clubsCoords.csv");

    let clubs = await Club.find({}, 'loc.coordinates');
    // console.log(JSON.stringify(clubs, null, 2));

    await fs.writeFile('clubsCoords.csv', 'latitude, longitude\n', () => {});
    for (const club of clubs) {
      await fs.appendFile('clubsCoords.csv', club.loc.coordinates[0] + ', ' + club.loc.coordinates[1] + '\n', () => {});
      // console.log(club.loc.coordinates[0] + ', ' + club.loc.coordinates[1]);
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
