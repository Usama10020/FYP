const express = require("express");
const {
  registerDevice,
  getAllDevices,
  getSingleDevice,
  updateDeviceType,
  deleteDevice,
  postGetSingleDevice,
} = require("../controllers/deviceController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/registerDevice").post(isAuthenticatedUser, registerDevice);
router
  .route("/postGetSingleDevice")
  .post(isAuthenticatedUser, postGetSingleDevice);

router.route("/admin/devices").get(isAuthenticatedUser, getAllDevices);

router
  .route("/admin/device/:ipAddress")
  .get(isAuthenticatedUser, authorizeRoles("Admin"), getSingleDevice)
  .put(isAuthenticatedUser, authorizeRoles("Admin"), updateDeviceType);
router
  .route("/admin/device/:ipAddress")
  .post(isAuthenticatedUser, authorizeRoles("Admin"), deleteDevice);

module.exports = router;
