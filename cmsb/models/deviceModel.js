const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: [true, "Please Enter Unique Ip Address"],
  },
  portAddress: {
    type: String,
  },
  deviceName: {
    type: String,
    required: [true, "Please Enter Device Name"],
  },
  userId: {
    type: String,
    required: [true, "Please Enter User Id For Device"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Password For Device"],
    minLength: [4, "Password should be greater than 4 characters"],
  },
  deviceType: {
    type: String,
    required: [true, "Please select device type"],
  },
});

module.exports = mongoose.model("Device", deviceSchema);
