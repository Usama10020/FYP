const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  requestedBY: {
    type: String,
    required: [true, "Requested By Required"],
  },
  deviceType: {
    type: String,
    required: [true, "Device type Required"],
  },
  description: {
    type: String,
    required: [true, "Description Required"],
  },
  workOnId: {
    type: String,
    required: [true, "Id Required"],
  },
  deviceId: {
    type: String,
    required: [true, "Device Id Required"],
  },
  devicePort: {
    type: String,
  },
  link: {
    type: String,
    required: [true, "Link Required"],
  },
  currentStatus: {
    type: String,
    required: [true, "Status Required"],
  },
  created: {
    type: String,
    required: [true, "Created Required"],
  },
  edited: {
    type: String,
    required: [true, "Edited Required"],
  },
  deleted: {
    type: String,
    required: [true, "Deleted Required"],
  },
  version: {
    type: String,
    required: [true, "Version Required"],
  },
});

module.exports = mongoose.model("Statuss", statusSchema);
