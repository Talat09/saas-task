const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

const checkPermission = (model, action) => {
  return async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    // Admin has full access
    if (userRole === "admin") return next();

    try {
      const document = await model.findById(id);

      if (!document) {
        return res
          .status(404)
          .json({ success: false, message: "Resource not found" });
      }

      // Editor can edit/delete any summary
      if (
        model.modelName === "Summary" &&
        userRole === "editor" &&
        ["update", "delete"].includes(action)
      ) {
        return next();
      }

      // Reviewer can only view
      if (
        model.modelName === "Summary" &&
        userRole === "reviewer" &&
        action === "read"
      ) {
        return next();
      }

      // User can only manage their own documents
      if (document.user.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: `User not authorized to ${action} this resource`,
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { checkRole, checkPermission };
