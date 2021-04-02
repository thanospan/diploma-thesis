const endpoints = [
  "/masked/users",
  "/masked/users/:userId",
  "/masked/users/:userId/roles",
  "/masked/permissions",
  "/masked/permissions/:permissionId",
  "/masked/permissions/:permissionId/methods",
  "/masked/permissions/:permissionId/status",
  "/masked/policies",
  "/masked/policies/:policyId",
  "/masked/policies/:policyId/excluded",
  "/masked/policies/:policyId/masked",
  "/masked/policies/:policyId/status",
  "/masked/roles"
];

module.exports = endpoints;
