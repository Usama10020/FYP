const express = require("express");
const {
  registerStaticRoute,
  getAllStaticRoute,
  getSingleStaticRoute,
  updateStaticRoute,
  deleteStaticRoute,
} = require("../controllers/staticRouteController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/registerStaticRoute")
  .post(isAuthenticatedUser, authorizeRoles("Admin"), registerStaticRoute);

router.route("/StaticRoutes").get(isAuthenticatedUser, getAllStaticRoute);

router
  .route("/staticRoutes/:staticRouteId")
  .get(isAuthenticatedUser, getSingleStaticRoute)
  .put(isAuthenticatedUser, authorizeRoles("Admin"), updateStaticRoute)
  .delete(isAuthenticatedUser, authorizeRoles("Admin"), deleteStaticRoute);

module.exports = router;
