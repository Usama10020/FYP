const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Vlans = require("../models/vlansModel");
const tempVlans = require("../models/tempvlansModel");

// Register a temp  Vlan
exports.registerVlans = catchAsyncErrors(async (req, res, next) => {
  let mes = `Vlan added successfully.`;
  const checkVlans = await Vlans.findOne({
    vlansId: req.body.vlansId,
  });
  const tempCheckVlans = await tempVlans.findOne({
    vlansId: req.body.vlansId,
  });
  var totalRulesWithSpecificIdAndVersion = await tempVlans.countDocuments({
    deviceId: req.body.deviceId,
    vlansId: req.body.vlansId,
  });
  if (req.user.role === "Admin") {
    if (!tempCheckVlans) {
      const {
        vlansId,
        deviceId,
        parentInterface,
        vlanTag,
        vlanPriority,
        description,
        generatedByUserId,
      } = req.body;

      const tempvlans = await tempVlans.create({
        vlansId,
        deviceId,
        parentInterface,
        vlanTag,
        vlanPriority,
        description,
        generatedByUserId,
        version: totalRulesWithSpecificIdAndVersion,
      });
    } else {
      mes = "Error: Duplicate Id Entered";
    }
  } else if (req.user.role === "Operator") {
    if (!checkVlans && !tempCheckVlans) {
      const {
        vlansId,
        deviceId,
        parentInterface,
        vlanTag,
        vlanPriority,
        description,
        generatedByUserId,
      } = req.body;

      const tempvlans = await tempVlans.create({
        vlansId,
        deviceId,
        parentInterface,
        vlanTag,
        vlanPriority,
        description,
        generatedByUserId,
        version: totalRulesWithSpecificIdAndVersion,
      });
    } else {
      mes = "Error: Duplicate Id Entered";
    }
  }
  res.status(200).json({
    success: true,
    message: mes,
  });
});

// Get all Vlans (admin)
exports.getAllVlans = catchAsyncErrors(async (req, res, next) => {
  const tempvlans = await tempVlans.find();

  res.status(200).json({
    success: true,
    message: "Vlans fetched successfully",
    tempvlans,
  });
});

// Get single Vlan (admin)
exports.getSingleVlans = catchAsyncErrors(async (req, res, next) => {
  const tempvlans = await tempVlans.findOne({
    vlansId: req.body.vlansId,
    version: req.body.version,
  });
  if (!tempvlans) {
    return next(
      new ErrorHander(`Vlan does not exist with Id : ${req.params.vlansId}`)
    );
  }
  res.status(200).json({
    success: true,
    tempvlans,
  });
});

// update Vlan  -- Admin
exports.updateVlans = catchAsyncErrors(async (req, res, next) => {
  var totalRulesWithSpecificIdAndVersion = await tempVlans.countDocuments({
    deviceId: req.body.deviceId,
    vlansId: req.body.vlansId,
  });
  const {
    vlansId,
    deviceId,
    parentInterface,
    vlanTag,
    vlanPriority,
    description,
    generatedByUserId,
  } = req.body;

  const tempvlans = await tempVlans.findOne({
    vlansId: req.body.vlansId,
  });
  if (!tempvlans) {
    return next(
      new ErrorHander(`Vlan does not exist with Id : ${req.params.vlansId}`)
    );
  }
  await tempVlans.create({
    vlansId,
    deviceId,
    parentInterface,
    vlanTag,
    vlanPriority,
    description,
    generatedByUserId,
    version: totalRulesWithSpecificIdAndVersion,
  });

  res.status(200).json({
    success: true,
    message: "Vlan updated Successfully and is waiting for Admin approval.",
  });
});

// Delete tempVlans--Admin
exports.deleteVlans = catchAsyncErrors(async (req, res, next) => {
  const tempvlans = await tempVlans.findOne({
    vlansId: req.params.vlansId,
  });

  if (!tempvlans) {
    return next(
      new ErrorHander(
        `Vlan does not exist with Id : ${req.params.vlansId}`,
        400
      )
    );
  }
  await tempVlans.deleteMany({ vlansId: req.params.vlansId });

  res.status(200).json({
    success: true,
    message: "Vlan deleted Successfully and is waiting for Admin approval.",
  });
});
