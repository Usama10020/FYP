const express = require("express");
const {
  registerStaticRoute,
  getAllStaticRoute,
  getSingleStaticRoute,
  updateStaticRoute,
  deleteStaticRoute,
} = require("../controllers/tempstaticRouteController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/tempregisterStaticRoute")
  .post(isAuthenticatedUser, registerStaticRoute);

router.route("/tempStaticRoutes").get(isAuthenticatedUser, getAllStaticRoute);

router
  .route("/tempStaticRoute/:staticRouteId")
  .put(isAuthenticatedUser, updateStaticRoute)
  .delete(isAuthenticatedUser, deleteStaticRoute);
router
  .route("/gettempStaticRoute")
  .post(isAuthenticatedUser, getSingleStaticRoute);

module.exports = router;
