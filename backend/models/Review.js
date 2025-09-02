const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  reviewer: String,
  rating: Number,
  source: String,
  company: String,
});

module.exports = mongoose.model("Review", reviewSchema);
