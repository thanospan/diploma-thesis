'use strict';

require('dotenv').config({ path: './config/.env' });

const server = require('./connections/server');
const safeameaMaskedConn = require('./connections/safeameaMaskedDb');
const safeameaConn = require('./connections/safeameaDb');

(async () => {
  await safeameaMaskedConn;
  await safeameaConn;
  server.setup();
  server.start();
})();
