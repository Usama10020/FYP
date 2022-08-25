const express = require("express");
const { registerLog, getAllLogs } = require("../controllers/logController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/registerLog").post(isAuthenticatedUser, registerLog);

router
  .route("/admin/logs")
  .get(isAuthenticatedUser, authorizeRoles("Admin"), getAllLogs);

module.exports = router;
