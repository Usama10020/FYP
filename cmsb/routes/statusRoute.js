const express = require("express");
const {
  registerStatus,
  getAllStatuses,
  updateStatusType,
  deleteStatus,
} = require("../controllers/statusController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/registerStatuss").post(isAuthenticatedUser, registerStatus);

router.route("/statuss").get(isAuthenticatedUser, getAllStatuses);

router
  .route("/admin/statuss/:_id")
  .put(isAuthenticatedUser, authorizeRoles("Admin"), updateStatusType)
  .delete(isAuthenticatedUser, authorizeRoles("Admin"), deleteStatus);

module.exports = router;
