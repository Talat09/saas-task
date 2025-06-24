const express = require("express");
const {
  createSummary,
  getSummaries,
  regenerateSummary,
  updateSummary,
  deleteSummary,
} = require("../controllers/summaryController");
const { protect } = require("../middleware/auth");
const { checkPermission } = require("../middleware/roles");
const Summary = require("../models/Summary");

const router = express.Router();

router.use(protect);

router.route("/").post(createSummary).get(getSummaries);

router.route("/:id/regenerate").post(regenerateSummary);

router
  .route("/:id")
  .put(checkPermission(Summary, "update"), updateSummary)
  .delete(checkPermission(Summary, "delete"), deleteSummary);

module.exports = router;
