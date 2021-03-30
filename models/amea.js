'use strict';

const mongoose = require('mongoose');

const safeameaConn = require('../connections/safeameaDb');

const Schema = mongoose.Schema;

const ameaSchema = new Schema({
  name: { type: String },
  surname: { type: String },
  email: {
    value: { type: String },
    active: { type: Number }
  },
  phoneNumber: {
    value: { type: String },
    active: { type: Number }
  },
  loc: {
    type: { type: String },
    coordinates: { type: Array }
  },
  region: {
    administrative: { type: String },
    municipality: { type: String }
  },
  disabilities: { type: Array },
  disabilitiesDesc: { type: String },
  floor: { type: Number },
  club: [{ type: Schema.Types.ObjectId, ref: 'Club' }],
  birthday: { type: Date },
  created: { type: Date },
  updated: { type: Date },
  address: { type: String },
  caretaker: {
    carename: { type: String },
    caresurname: { type: String },
    careemail: { type: String },
    carephone: { type: String },
    caredescription: { type: String }
  },
  status: { type: String }
});

const Amea = safeameaConn.model('Amea', ameaSchema, 'amea');

module.exports = {
  Amea
};
