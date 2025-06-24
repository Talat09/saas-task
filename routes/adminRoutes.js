const express = require("express");
const { protect } = require("../middleware/auth");
const { checkRole } = require("../middleware/roles");
const {
  getUsers,
  updateUserCredits,
  updateUserRole,
} = require("../controllers/adminController");

const router = express.Router();

// Admin protected routes
router.use(protect);
router.use(checkRole(["admin"]));

router.route("/users").get(getUsers);

router.route("/users/:id/credits").put(updateUserCredits);

router.route("/users/:id/role").put(updateUserRole);

module.exports = router;
