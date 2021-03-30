'use strict';

require('dotenv').config({ path: './config/.env' });

const safeameaMaskedConn = require('../connections/safeameaMaskedDb');
const safeameaConn = require('../connections/safeameaDb');
const hashUtil = require('../utils/hash');
const tokenUtil = require('../utils/token');
const { policyStatus, Policy } = require('../models/policy');
const { permissionStatus, permissionMethods, Permission } = require('../models/permission');
const { roleStatus, Role } = require('../models/role');
const { emailStatus, User } = require('../models/user');
const { EmailToken } = require('../models/emailToken');
const { Club } = require('../models/club');
const { Amea } = require('../models/amea');

(async () => {
  await safeameaMaskedConn;
  await safeameaConn;

  const newPolicy = new Policy({
    "resource": "amea",
    "excluded": ["owner", "surname"],
    "masked": ["name", "loc"],
    "status": policyStatus.ACTIVE
  });
  const savedPolicy = await newPolicy.save();
  console.log("Policy:");
  console.log(JSON.stringify(savedPolicy, null, 2));

  const newPermission = new Permission({
    "endpoint": "/masked/amea",
    "methods": [permissionMethods.GET],
    "status": permissionStatus.ACTIVE
  });
  const savedPermission = await newPermission.save();
  console.log("Permission:");
  console.log(JSON.stringify(savedPermission, null, 2));

  const newRole = new Role({
    "name": "cityPlanner",
    "permissions": [savedPermission],
    "policies": [savedPolicy],
    "status": roleStatus.ACTIVE
  });
  const savedRole = await newRole.save();
  console.log("Role:");
  console.log(JSON.stringify(savedRole, null, 2));

  const newUser = new User({
    "email": {
      "value": "newUser@gmail.com",
      "status": emailStatus.ACCEPTED
    },
    "password": await hashUtil.generate("aA1!a"),
    "token": tokenUtil.generate(),
    "roles": [savedRole]
  });
  const savedUser = await newUser.save();
  console.log("User:");
  console.log(JSON.stringify(savedUser, null, 2));

  const newEmailToken = new EmailToken({
    "owner": savedUser,
    "value": tokenUtil.generate()
  });
  const savedEmailToken = await newEmailToken.save();
  console.log("Email token:");
  console.log(JSON.stringify(savedEmailToken, null, 2));

  const amea = await Amea.find().populate('club').exec();
  console.log("Amea:");
  console.log(JSON.stringify(amea, null, 2));
})();
