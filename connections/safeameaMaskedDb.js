'use strict';

const mongoose = require('mongoose');

const {
  MONGO_USER,
  MONGO_PASS,
  MONGO_AUTH_DB,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_SAFEAMEA_MASKED_DB
} = process.env;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

const uri = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_SAFEAMEA_MASKED_DB}?authSource=${MONGO_AUTH_DB}`;

// Create safeameaMasked db connection
const safeameaMaskedConn = mongoose.createConnection(uri, options);
safeameaMaskedConn.catch(err => { console.log(err) });

// Connection Events
safeameaMaskedConn.on('connecting', () => console.log(`---Connecting to safeameaMasked database`));
safeameaMaskedConn.on('connected', () => console.log(`---Connected to safeameaMasked database`));
safeameaMaskedConn.on('disconnecting', () => console.log(`---Disconnecting from safeameaMasked database`));
safeameaMaskedConn.on('disconnected', () => console.log(`---Disconnected from safeameaMasked database`));
safeameaMaskedConn.on('close', () => console.log(`---Closed safeameaMasked database connection`));
safeameaMaskedConn.on('reconnected', () => console.log(`---Reconnected to safeameaMasked database`));
safeameaMaskedConn.on('reconnectFailed', () => console.log(`---Failed to reconnect to safeameaMasked database`));
safeameaMaskedConn.on('error', (err) => console.log(err));

module.exports = safeameaMaskedConn;
