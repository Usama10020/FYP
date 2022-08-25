const express = require("express");
const {
  registerVlans,
  getAllVlans,
  getSingleVlans,
  updateVlans,
  deleteVlans,
} = require("../controllers/tempvlansController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/tempregisterVlans").post(isAuthenticatedUser, registerVlans);

router.route("/tempVlans").get(isAuthenticatedUser, getAllVlans);

router
  .route("/tempVlans/:vlansId")
  .put(isAuthenticatedUser, updateVlans)
  .delete(isAuthenticatedUser, deleteVlans);
router.route("/gettempVlans").post(isAuthenticatedUser, getSingleVlans);

module.exports = router;
