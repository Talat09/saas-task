const User = require("../models/User");
const { addCredits } = require("../services/creditService");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user credits
// @route   PUT /api/admin/users/:id/credits
// @access  Private/Admin
const updateUserCredits = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const userId = req.params.id;

    if (isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a number",
      });
    }

    const credits = await addCredits(userId, Number(amount));

    res.status(200).json({
      success: true,
      data: {
        userId,
        credits,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!["user", "admin", "editor", "reviewer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  updateUserCredits,
  updateUserRole,
};
