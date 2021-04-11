'use strict';

const mongoose = require('mongoose');
const fs = require('fs').promises;

require('dotenv').config({ path: './config/.env' });
const safeameaConn = require('../connections/safeameaDb');
const { Amea } = require('../models/amea');
const { Loader } = require('../utils/loader');

const loader = new Loader();

(async () => {
  try {
    await safeameaConn;

    loader.start("---Saving amea coordinates to ameaCoords.csv");

    let amea = await Amea.find({}, 'loc.coordinates');
    // console.log(JSON.stringify(amea, null, 2));

    await fs.writeFile('ameaCoords.csv', 'latitude, longitude\n', () => {});
    for (const ameaEl of amea) {
      await fs.appendFile('ameaCoords.csv', ameaEl.loc.coordinates[0] + ', ' + ameaEl.loc.coordinates[1] + '\n', () => {});
      // console.log(ameaEl.loc.coordinates[0] + ', ' + ameaEl.loc.coordinates[1]);
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
