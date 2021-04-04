'use strict';

const paramOptions = {
  "REQ_BODY": "req.body",
  "REQ_QUERY": "req.query",
  "REQ_PARAMS": "req.params",
  "REQ_HEADERS": "req.headers",
  "RES_LOCALS": "res.locals"
};

const getParam = ({ param, option, obj }) => {
  let reqParam;

  switch (option) {
    case paramOptions.REQ_BODY:
      reqParam = obj.body[param];
      break;
    case paramOptions.REQ_QUERY:
      reqParam = obj.query[param];
      break;
    case paramOptions.REQ_PARAMS:
      reqParam = obj.params[param];
      break;
    case paramOptions.REQ_HEADERS:
      reqParam = obj.headers[param.toLowerCase()];
      break;
    case paramOptions.RES_LOCALS:
      reqParam = obj.locals[param];
      break;
    default:
      break;
  }

  return reqParam;
};

module.exports = {
  paramOptions,
  getParam
};
