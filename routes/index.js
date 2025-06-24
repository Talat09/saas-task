const authRoutes = require("./authRoutes");
const summaryRoutes = require("./summaryRoutes");
const adminRoutes = require("./adminRoutes");

module.exports = {
  auth: authRoutes,
  summaries: summaryRoutes,
  admin: adminRoutes,
};
