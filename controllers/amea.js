'use strict';

const ameaDbUtil = require('../utils/ameaDbUtil');

exports.getAll = async (req, res, next) => {
  try {
    const roles = res.locals.authorizedRoles;
    let response;

    // Keep first role - This should be replaced with role priorities or policy merging
    const role = roles[0];

    // Search for amea
    const amea = await ameaDbUtil.getAll(role.policies);

    // Send response
    response = {
      "statusCode": 200,
      "message": amea
    };
    // console.log(JSON.stringify(response, null, 2));
    console.log({ statusCode: response.statusCode, message: "Retrieved all amea successfully" });
    res.status(response.statusCode).json(response.message);
    return;
  } catch(err) {
    return next(err);
  }
};
