const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Statuss = require("../models/statusModel");
const tempFrule = require("../models/tempfRulesModel");
const tempVlans = require("../models/tempvlansModel");
const tempStaticRoute = require("../models/tempstaticRouteModel");
const tempIp = require("../models/tempipAssignmentModel");
const tempRIp = require("../models/temprIpModel");

// Register a Status
exports.registerStatus = catchAsyncErrors(async (req, res, next) => {
  if (req.body.link === "/editFloatRule" || req.body.link === "/editLwRule") {
    var totalRulesWithSpecificIdAndVersion = await tempFrule.countDocuments({
      deviceId: req.body.deviceId,
      ruleId: req.body.workOnId,
    });
  } else if (req.body.link === "/editVlans") {
    var totalRulesWithSpecificIdAndVersion = await tempVlans.countDocuments({
      deviceId: req.body.deviceId,
      vlansId: req.body.workOnId,
    });
  } else if (req.body.link === "/editStaticRoute") {
    var totalRulesWithSpecificIdAndVersion =
      await tempStaticRoute.countDocuments({
        deviceId: req.body.deviceId,
        staticRouteId: req.body.workOnId,
      });
  } else if (req.body.link === "/editWan" || req.body.link === "/editLan") {
    var totalRulesWithSpecificIdAndVersion = await tempIp.countDocuments({
      deviceId: req.body.deviceId,
      interfaceName: req.body.workOnId,
    });
  } else if (
    req.body.link === "/editInterface" ||
    req.body.link === "/editInterface1"
  ) {
    var totalRulesWithSpecificIdAndVersion = await tempRIp.countDocuments({
      deviceId: req.body.deviceId,
      interfaceName: req.body.workOnId,
      devicePort: req.body.devicePort,
    });
  }
  const {
    requestedBY,
    deviceType,
    description,
    workOnId,
    deviceId,
    devicePort,
    link,
    currentStatus,
    created,
    edited,
    deleted,
  } = req.body;

  const statuss = await Statuss.create({
    requestedBY,
    deviceType,
    description,
    workOnId,
    deviceId,
    devicePort,
    link,
    currentStatus,
    created,
    edited,
    deleted,
    version: totalRulesWithSpecificIdAndVersion - 1,
  });
  res.status(200).json({
    success: true,
    message: `Status added successfully`,
  });
});

// Get all status(admin)
exports.getAllStatuses = catchAsyncErrors(async (req, res, next) => {
  const statuses = await Statuss.find();

  res.status(200).json({
    success: true,
    message: "Statuses Data Fetched Successfully",
    statuses,
  });
});

// update Status  -- Admin
exports.updateStatusType = catchAsyncErrors(async (req, res, next) => {
  const newStatusData = {
    requestedBY: req.body.requestedBY,
    deviceType: req.body.deviceType,
    description: req.body.description,
    workOnId: req.body.workOnId,
    deviceId: req.body.deviceId,
    devicePort: req.body.deviceId,
    link: req.body.link,
    currentStatus: req.body.currentStatus,
    created: req.body.created,
    edited: req.body.edited,
    deleted: req.body.deleted,
    version: req.body.version,
  };
  const statuss = await Statuss.findOne({ _id: req.params._id });
  if (!statuss) {
    return next(
      new ErrorHander(`Status does not exist with Id: ${req.params._id}`)
    );
  }
  await Statuss.findOneAndUpdate({ _id: req.params._id }, newStatusData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Status Updated Successfully",
  });
});

// Delete Status --Admin
exports.deleteStatus = catchAsyncErrors(async (req, res, next) => {
  const statuss = await Statuss.findOne({ _id: req.params._id });

  if (!statuss) {
    return next(
      new ErrorHander(`Status does not exist with Id : ${req.params._id}`, 400)
    );
  }

  await statuss.remove();

  res.status(200).json({
    success: true,
    message: "Status Deleted Successfully",
  });
});
