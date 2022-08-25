const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Log = require("../models/logModel");

// Register a Log
exports.registerLog = catchAsyncErrors(async (req, res, next) => {
  const { generatedByUserId, dateAndTime, description } = req.body;

  const log = await Log.create({
    generatedByUserId,
    dateAndTime,
    description,
  });
  res.status(200).json({
    success: true,
    message: `Log added successfully`,
  });
});

// Get all Logs (admin)
exports.getAllLogs = catchAsyncErrors(async (req, res, next) => {
  const logs = await Log.find();

  res.status(200).json({
    success: true,
    message: "Logs Fetched Successfully",
    logs,
  });
});
