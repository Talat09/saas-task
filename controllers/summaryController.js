const Summary = require("../models/Summary");
const { generateSummary } = require("../services/aiService");
const { deductCredit } = require("../services/creditService");

// @desc    Create new summary
// @route   POST /api/summaries
// @access  Private
const createSummary = async (req, res, next) => {
  const { prompt, text } = req.body;

  try {
    // Deduct credit first
    const remainingCredits = await deductCredit(req.user.id);

    // Generate summary
    const result = await generateSummary(req.user.id, prompt, text);

    res.status(201).json({
      success: true,
      data: {
        ...result,
        remainingCredits,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all summaries
// @route   GET /api/summaries
// @access  Private
const getSummaries = async (req, res, next) => {
  try {
    let query = { user: req.user.id };

    // Admin, editor, and reviewer can see all summaries
    if (["admin", "editor", "reviewer"].includes(req.user.role)) {
      query = {};
    }

    const summaries = await Summary.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "username");

    res.status(200).json({
      success: true,
      count: summaries.length,
      data: summaries,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Regenerate summary
// @route   POST /api/summaries/:id/regenerate
// @access  Private
const regenerateSummary = async (req, res, next) => {
  try {
    const summary = await Summary.findById(req.params.id);
    if (!summary) {
      return res.status(404).json({
        success: false,
        message: "Summary not found",
      });
    }

    // Deduct credit
    const remainingCredits = await deductCredit(req.user.id);

    // Regenerate summary
    const result = await generateSummary(
      req.user.id,
      req.body.prompt || summary.prompt,
      summary.originalText
    );

    res.status(200).json({
      success: true,
      data: {
        ...result,
        remainingCredits,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update summary
// @route   PUT /api/summaries/:id
// @access  Private
const updateSummary = async (req, res, next) => {
  try {
    const summary = await Summary.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!summary) {
      return res.status(404).json({
        success: false,
        message: "Summary not found",
      });
    }

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete summary
// @route   DELETE /api/summaries/:id
// @access  Private
const deleteSummary = async (req, res, next) => {
  try {
    const summary = await Summary.findByIdAndDelete(req.params.id);

    if (!summary) {
      return res.status(404).json({
        success: false,
        message: "Summary not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createSummary,
  getSummaries,
  regenerateSummary,
  updateSummary,
  deleteSummary,
};
