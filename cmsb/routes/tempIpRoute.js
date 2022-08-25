const express = require("express");
const {
  registerAndUpdateIp,
  getSingleIp,
} = require("../controllers/tempipController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/tempregisterAndUpdateIp")
  .post(isAuthenticatedUser, registerAndUpdateIp);

router.route("/tempgetSingleIp").post(isAuthenticatedUser, getSingleIp);

module.exports = router;
