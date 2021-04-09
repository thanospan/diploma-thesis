'use strict';

exports.getIndex = (req, res) => {
  const response = {
    "statusCode": 200,
    "message": "SafeAmea Masked API"
  }
  console.log(response);
  res.status(response.statusCode).json(response);
};
