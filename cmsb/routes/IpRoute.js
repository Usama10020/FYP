const express = require("express");
const {
  registerAndUpdateIp,
  getSingleIp,
} = require("../controllers/ipController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/RegisterAndUpdateIp")
  .post(isAuthenticatedUser, authorizeRoles("Admin"), registerAndUpdateIp);

router.route("/GetSingleIp").post(isAuthenticatedUser, getSingleIp);

module.exports = router;
