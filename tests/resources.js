'use strict';

require('dotenv').config({ path: './config/.env' });

const resources = require('../constants/resources');

console.log(JSON.stringify(resources.getAll(), null, 2));
console.log(JSON.stringify(resources.getAllNames(), null, 2));
console.log(JSON.stringify(resources.getAllFields(), null, 2));
console.log(JSON.stringify(resources.getResourceFields("club"), null, 2));
