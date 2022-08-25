const express = require("express");
const {
  registerAndUpdaterIp,
  getSinglerIp,
} = require("../controllers/rIpController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/RegisterAndUpdaterIp")
  .post(isAuthenticatedUser, authorizeRoles("Admin"), registerAndUpdaterIp);

router.route("/GetSinglerIp").post(isAuthenticatedUser, getSinglerIp);

module.exports = router;
