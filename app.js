const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middleware/error");
const routes = require("./routes");

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(limiter);

// Routes
app.use("/api/auth", routes.auth);
app.use("/api/summaries", routes.summaries);
app.use("/api/admin", routes.admin);
// app.get("/", (req, res) => {
//   res.send("Welcome to the API");
// });

// Error handler
app.use(errorHandler);

module.exports = app;
