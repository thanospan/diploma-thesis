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

  const newPermission4 = new Permission({
    "endpoint": "/masked/permissions",
    "methods": [permissionMethods.GET, permissionMethods.POST],
    "status": permissionStatus.ACTIVE
  });
  const savedPermission4 = await newPermission4.save();
  console.log(JSON.stringify(savedPermission4, null, 2));

  const newPermission5 = new Permission({
    "endpoint": "/masked/permissions/:permissionId",
    "methods": [permissionMethods.DELETE],
    "status": permissionStatus.ACTIVE
  });
  const savedPermission5 = await newPermission5.save();
  console.log(JSON.stringify(savedPermission5, null, 2));

  const newPermission6 = new Permission({
    "endpoint": "/masked/permissions/:permissionId/status",
    "methods": [permissionMethods.POST],
    "status": permissionStatus.ACTIVE
  });
  const savedPermission6 = await newPermission6.save();
  console.log(JSON.stringify(savedPermission6, null, 2));

  const newPermission7 = new Permission({
    "endpoint": "/masked/permissions/:permissionId/methods",
    "methods": [permissionMethods.POST],
    "status": permissionStatus.ACTIVE
  });
  const savedPermission7 = await newPermission7.save();
  console.log(JSON.stringify(savedPermission7, null, 2));

  const newPermission8 = new Permission({
    "endpoint": "/masked/policies",
    "methods": [permissionMethods.GET, permissionMethods.POST],
    "status": permissionStatus.ACTIVE
  });
  const savedPermission8 = await newPermission8.save();
  console.log(JSON.stringify(savedPermission8, null, 2));

  const newPermission9 = new Permission({
    "endpoint": "/masked/policies/:policyId",
    "methods": [permissionMethods.DELETE],
    "status": permissionStatus.ACTIVE
  });
  const savedPermission9 = await newPermission9.save();
  console.log(JSON.stringify(savedPermission9, null, 2));

  const newPermission10 = new Permission({
    "endpoint": "/masked/policies/:policyId/status",
    "methods": [permissionMethods.POST],
    "status": permissionStatus.ACTIVE
  });
  const savedPermission10 = await newPermission10.save();
  console.log(JSON.stringify(savedPermission10, null, 2));

  const newPermission11 = new Permission({
    "endpoint": "/masked/policies/:policyId/excluded",
    "methods": [permissionMethods.POST],
    "status": permissionStatus.ACTIVE
  });
  const savedPermission11 = await newPermission11.save();
  console.log(JSON.stringify(savedPermission11, null, 2));

  const newPermission12 = new Permission({
    "endpoint": "/masked/policies/:policyId/masked",
    "methods": [permissionMethods.POST],
    "status": permissionStatus.ACTIVE
  });
  const savedPermission12 = await newPermission12.save();
  console.log(JSON.stringify(savedPermission12, null, 2));

  const newPermission13 = new Permission({
    "endpoint": "/masked/roles",
    "methods": [permissionMethods.GET, permissionMethods.POST],
    "status": permissionStatus.ACTIVE
  });
  const savedPermission13 = await newPermission13.save();
  console.log(JSON.stringify(savedPermission13, null, 2));

  const newPermission14 = new Permission({
    "endpoint": "/masked/roles/:roleId",
    "methods": [permissionMethods.DELETE],
    "status": permissionStatus.ACTIVE
  });
  const savedPermission14 = await newPermission14.save();
  console.log(JSON.stringify(savedPermission14, null, 2));

  // Policies
  const newPolicy1 = new Policy({
    "resource": "amea",
    "excluded": ["owner"],
    "masked": ["name", "email", "phoneNumber"],
    "status": policyStatus.ACTIVE
  })
  const savedPolicy1 = await newPolicy1.save();
  console.log(JSON.stringify(savedPolicy1, null, 2));

  // Roles
  const adminRole = new Role({
    "name": "admin",
    "permissions": [savedPermission1, savedPermission2, savedPermission3,
      savedPermission4, savedPermission5, savedPermission6, savedPermission7,
      savedPermission8, savedPermission9, savedPermission10, savedPermission11,
      savedPermission12, savedPermission13, savedPermission14],
    "policies": [savedPolicy1],
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
    "roles": [savedAdminRole]
  });
  const savedAdminUser = await adminUser.save();
  console.log(JSON.stringify(savedAdminUser, null, 2));
})();
