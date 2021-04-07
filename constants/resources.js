'use strict';

const { Amea } = require('../models/amea');
const { Club } = require('../models/club');

const ameaFields = [...new Set([
  ...Object.keys(Amea.schema.paths),
  ...Object.keys(Amea.schema.nested),
  ...["__enc_surname"]
])];

const clubFields = [...new Set([
  ...Object.keys(Club.schema.paths),
  ...Object.keys(Club.schema.nested)
])];

const resources = [
  {
    "name": "amea",
    "fields": ameaFields
  },
  {
    "name": "club",
    "fields": clubFields
  }
];

exports.getAll = () => {
  return resources;
};

exports.getAllNames = () => {
  return resources.map(resource => resource.name);
};

exports.getAllFields = () => {
  return [...new Set([].concat(...resources.map(resource => resource.fields)))];
};

exports.getResourceFields = (resourceName) => {
  return resources.find(resource => resource.name === resourceName).fields;
};
