'use strict';

const mongoose = require('mongoose');

const {
  MONGO_USER,
  MONGO_PASS,
  MONGO_AUTH_DB,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_SAFEAMEA_DB
} = process.env;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

const uri = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_SAFEAMEA_DB}?authSource=${MONGO_AUTH_DB}`;

// Create safeamea db connection
const safeameaConn = mongoose.createConnection(uri, options);
safeameaConn.catch(err => { console.log(err) });

// Connection Events
safeameaConn.on('connecting', () => console.log(`---Connecting to safeamea database`));
safeameaConn.on('connected', () => console.log(`---Connected to safeamea database`));
safeameaConn.on('disconnecting', () => console.log(`---Disconnecting from safeamea database`));
safeameaConn.on('disconnected', () => console.log(`---Disconnected from safeamea database`));
safeameaConn.on('close', () => console.log(`---Closed safeamea database connection`));
safeameaConn.on('reconnected', () => console.log(`---Reconnected to safeamea database`));
safeameaConn.on('reconnectFailed', () => console.log(`---Failed to reconnect to safeamea database`));
safeameaConn.on('error', (err) => console.log(err));

module.exports = safeameaConn;
