const validator = require("validator");
const { body, validationResult } = require("express-validator");

// Common validation rules
const userValidationRules = () => {
  return [
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ];
};

const loginValidationRules = () => {
  return [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

const summaryValidationRules = () => {
  return [
    body("prompt")
      .notEmpty()
      .withMessage("Prompt is required")
      .isLength({ max: 500 })
      .withMessage("Prompt must be less than 500 characters"),
    body("text")
      .notEmpty()
      .withMessage("Text to summarize is required")
      .isLength({ min: 50 })
      .withMessage("Text must be at least 50 characters"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    success: false,
    errors: extractedErrors,
  });
};

module.exports = {
  userValidationRules,
  loginValidationRules,
  summaryValidationRules,
  validate,
};
