const express = require("express");
const {
  registerVlans,
  getAllVlans,
  getSingleVlans,
  updateVlans,
  deleteVlans,
} = require("../controllers/vlansController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/registerVlans")
  .post(isAuthenticatedUser, authorizeRoles("Admin"), registerVlans);

router.route("/Vlans").get(isAuthenticatedUser, getAllVlans);

router
  .route("/vlans/:vlansId")
  .get(isAuthenticatedUser, getSingleVlans)
  .put(isAuthenticatedUser, authorizeRoles("Admin"), updateVlans)
  .delete(isAuthenticatedUser, authorizeRoles("Admin"), deleteVlans);

module.exports = router;
