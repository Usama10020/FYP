const express = require("express");
const {
  registerFrule,
  getAllFrules,
  getSingleFrule,
  updateFrule,
  deleteFrule,
  Pfsenseidupdate,
} = require("../controllers/fruleController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/registerFrule")
  .post(isAuthenticatedUser, authorizeRoles("Admin"), registerFrule);

router.route("/frules").get(isAuthenticatedUser, getAllFrules);

router
  .route("/frules/:ruleId")
  .get(isAuthenticatedUser, getSingleFrule)
  .put(isAuthenticatedUser, authorizeRoles("Admin"), updateFrule)
  .delete(isAuthenticatedUser, authorizeRoles("Admin"), deleteFrule);
router
  .route("/frulesMoveRules")
  .put(isAuthenticatedUser, authorizeRoles("Admin"), Pfsenseidupdate);

module.exports = router;
