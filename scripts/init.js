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

  // Permissions
  const newPermission1 = new Permission({
    "endpoint": "/masked/users",
    "methods": [permissionMethods.GET],
    "status": permissionStatus.ACTIVE
  });
  const savedPermission1 = await newPermission1.save();
  console.log(JSON.stringify(savedPermission1, null, 2));

  const newPermission2 = new Permission({
    "endpoint": "/masked/users/:userId",
    "methods": [permissionMethods.DELETE],
    "status": permissionStatus.ACTIVE
  });
  const savedPermission2 = await newPermission2.save();
  console.log(JSON.stringify(savedPermission2, null, 2));

  const newPermission3 = new Permission({
    "endpoint": "/masked/users/:userId/roles",
    "methods": [permissionMethods.POST],
    "status": permissionStatus.ACTIVE
  });
  const savedPermission3 = await newPermission3.save();
  console.log(JSON.stringify(savedPermission3, null, 2));

  // Policies

  // Roles
  const adminRole = new Role({
    "name": "admin",
    "permissions": [savedPermission1, savedPermission2, savedPermission3],
    "policies": [],
    "status": roleStatus.ACTIVE
  });
  const savedAdminRole = await adminRole.save();
  console.log(JSON.stringify(savedAdminRole, null, 2));

  // Users
  const adminUser = new User({
    "email": {
      "value": "admin@safeamea.gr",
      "status": emailStatus.ACCEPTED
    },
    "password": await hashUtil.generate("aA1!a"),
    "token": tokenUtil.generate(),
    "roles": [adminRole]
  });
  const savedAdminUser = await adminUser.save();
  console.log(JSON.stringify(savedAdminUser, null, 2));
})();