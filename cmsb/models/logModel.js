const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  generatedByUserId: {
    type: String,
    required: [true, "UserId Required"],
  },
  dateAndTime: {
    type: String,
    required: [true, "Date & Time Required"],
  },
  description: {
    type: String,
    required: [true, "Description Required"],
  },
});

module.exports = mongoose.model("Log", logSchema);
