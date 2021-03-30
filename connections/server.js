'use strict';

const express = require('express');

const app = express();

const setup = () => {
  const usersRouter = require('../routes/users');
  const permissionsRouter = require('../routes/permissions');
  // const rolesRouter = require('../routes/roles');
  // const policiesRouter = require('../routes/policies');
  // const ameaRouter = require('../routes/amea');

  // Middleware
  app.use(express.json());

  // Routes
  app.use('/masked/users', usersRouter);
  app.use('/masked/permissions', permissionsRouter);
  // app.use('/masked/roles', rolesRouter);
  // app.use('/masked/policies', policiesRouter);
  // app.use('/masked/amea', ameaRouter);

  app.use((req, res, next) => {
    const response = {
      "statusCode": 404,
      "message": "Not Found"
    }
    console.log(response);
    res.status(response.statusCode).json(response);
  });

  // Error-handling middleware
  app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ "message": "Internal Server Error" });
  });
};

const start = () => {
  const {
    SAFEAMEA_MASKED_API_HOST,
    SAFEAMEA_MASKED_API_PORT
  } = process.env;

  app.listen(SAFEAMEA_MASKED_API_PORT, SAFEAMEA_MASKED_API_HOST, () => {
    console.log(`---SafeAmea Masked API listening at http://${SAFEAMEA_MASKED_API_HOST}:${SAFEAMEA_MASKED_API_PORT}`);
  });
};

module.exports = {
  setup,
  start
};
