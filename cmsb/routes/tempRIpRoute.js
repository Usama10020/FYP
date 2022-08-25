const express = require("express");
const {
  registerAndUpdaterIp,
  getSinglerIp,
} = require("../controllers/temprIpController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/tempregisterAndUpdaterIp")
  .post(isAuthenticatedUser, registerAndUpdaterIp);

router.route("/tempgetSinglerIp").post(isAuthenticatedUser, getSinglerIp);

module.exports = router;
