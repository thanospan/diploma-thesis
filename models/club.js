'use strict';

const mongoose = require('mongoose');

const safeameaConn = require('../connections/safeameaDb');

const Schema = mongoose.Schema;

const clubSchema = new Schema({
  name: { type: String },
  loc: {
    type: { type: String },
    coordinates: { type: Array }
  },
  region: {
    administrative: { type: String },
    municipality: { type: String }
  },
  address: { type: String },
  phoneNumber: { type: String },
  created: { type: Date },
  updated: { type: Date },
  status: { type: String }
});

const Club = safeameaConn.model('Club', clubSchema, 'clubs');

module.exports = {
  Club
};
