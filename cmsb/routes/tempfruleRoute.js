const express = require("express");
const {
  registerFrule,
  getAllFrules,
  getSingleFrule,
  updateFrule,
  deleteFrule,
} = require("../controllers/tempfruleController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/tempregisterFrule").post(isAuthenticatedUser, registerFrule);

router.route("/tempfrules").get(isAuthenticatedUser, getAllFrules);

router
  .route("/tempfrules/:ruleId")
  .put(isAuthenticatedUser, updateFrule)
  .delete(isAuthenticatedUser, deleteFrule);
router.route("/gettempfrules").post(isAuthenticatedUser, getSingleFrule);

module.exports = router;
