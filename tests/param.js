'use strict'

const { paramOptions, getParam } = require('../utils/param');

console.log(paramOptions.REQ_BODY);
console.log(paramOptions.REQ_QUERY);
console.log(paramOptions.REQ_PARAMS);
console.log(paramOptions.REQ_HEADERS);
console.log(paramOptions.RES_LOCALS);

const req = {
  "body": {
    "name": "George"
  },
  "query": {
    "surname": "Papadopoulos"
  },
  "params": {
    "email": "gpapado@gmail.com"
  },
  "headers": {
    "token": "aAa98dfya87sdf"
  }
};
console.log(req);

const res = {
  "locals": {
    "roles": ["cityPlanner"]
  }
};
console.log(res);

console.log(getParam({
  "param": "surname",
  "option": paramOptions.REQ_QUERY,
  "obj": req
}));

console.log(getParam({
  "param": "roles",
  "option": paramOptions.RES_LOCALS,
  "obj": res
}));
