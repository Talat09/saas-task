const mongoose = require("mongoose");

const SummarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  originalText: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  wordCount: {
    type: Number,
    required: true,
  },
  modelUsed: {
    type: String,
    default: "gpt-3.5-turbo",
  },
  cached: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp before saving
SummarySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Summary", SummarySchema);
