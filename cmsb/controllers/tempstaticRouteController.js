const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const StaticRoute = require("../models/staticRouteModel");
const tempStaticRoute = require("../models/tempstaticRouteModel");

// Register a temp  Static Route
exports.registerStaticRoute = catchAsyncErrors(async (req, res, next) => {
  let mes = `Static Route added successfully.`;
  const checkStaticRoute = await StaticRoute.findOne({
    staticRouteId: req.body.staticRouteId,
  });
  const tempCheckStaticRoute = await tempStaticRoute.findOne({
    staticRouteId: req.body.staticRouteId,
  });
  var totalRulesWithSpecificIdAndVersion = await tempStaticRoute.countDocuments(
    {
      deviceId: req.body.deviceId,
      staticRouteId: req.body.staticRouteId,
    }
  );
  if (req.user.role === "Admin") {
    if (!tempCheckStaticRoute) {
      const {
        staticRouteId,
        deviceId,
        destinationNetwork,
        subnet,
        gateway,
        disabled,
        description,
        generatedByUserId,
      } = req.body;

      const tempstaticRoute = await tempStaticRoute.create({
        staticRouteId,
        deviceId,
        destinationNetwork,
        subnet,
        gateway,
        disabled,
        description,
        generatedByUserId,
        version: totalRulesWithSpecificIdAndVersion,
      });
    } else {
      mes = "Error: Duplicate Static Route Id Entered";
    }
  } else if (req.user.role === "Operator") {
    if (!checkStaticRoute && !tempCheckStaticRoute) {
      const {
        staticRouteId,
        deviceId,
        destinationNetwork,
        subnet,
        gateway,
        disabled,
        description,
        generatedByUserId,
      } = req.body;

      const tempstaticRoute = await tempStaticRoute.create({
        staticRouteId,
        deviceId,
        destinationNetwork,
        subnet,
        gateway,
        disabled,
        description,
        generatedByUserId,
        version: totalRulesWithSpecificIdAndVersion,
      });
    } else {
      mes = "Error: Duplicate Static Route Id Entered";
    }
  }
  res.status(200).json({
    success: true,
    message: mes,
  });
});

// Get all Static Route (admin)
exports.getAllStaticRoute = catchAsyncErrors(async (req, res, next) => {
  const tempstaticRoutes = await tempStaticRoute.find();

  res.status(200).json({
    success: true,
    message: "Static Route fetched successfully",
    tempstaticRoutes,
  });
});

// Get single Static Route (admin)
exports.getSingleStaticRoute = catchAsyncErrors(async (req, res, next) => {
  const tempstaticRoute = await tempStaticRoute.findOne({
    staticRouteId: req.body.staticRouteId,
    version: req.body.version,
  });
  if (!tempstaticRoute) {
    return next(
      new ErrorHander(
        `Static Route does not exist with Static Route Id : ${req.params.staticRouteId}`
      )
    );
  }
  res.status(200).json({
    success: true,
    tempstaticRoute,
  });
});

// update StaticRoute  -- Admin
exports.updateStaticRoute = catchAsyncErrors(async (req, res, next) => {
  var totalRulesWithSpecificIdAndVersion = await tempStaticRoute.countDocuments(
    {
      staticRouteId: req.body.staticRouteId,
      deviceId: req.body.deviceId,
    }
  );
  const {
    staticRouteId,
    deviceId,
    destinationNetwork,
    subnet,
    gateway,
    disabled,
    description,
    generatedByUserId,
  } = req.body;

  const tempstaticRoute = await tempStaticRoute.findOne({
    staticRouteId: req.body.staticRouteId,
  });
  if (!tempstaticRoute) {
    return next(
      new ErrorHander(
        `Static Route does not exist with Static Route Id : ${req.params.staticRouteId}`
      )
    );
  }
  await tempStaticRoute.create({
    staticRouteId,
    deviceId,
    destinationNetwork,
    subnet,
    gateway,
    disabled,
    description,
    generatedByUserId,
    version: totalRulesWithSpecificIdAndVersion,
  });

  res.status(200).json({
    success: true,
    message:
      "Static Route Updated Successfully and is waiting for Admin approval.",
  });
});

// Delete tempStaticRoute--Admin
exports.deleteStaticRoute = catchAsyncErrors(async (req, res, next) => {
  const tempstaticRoute = await tempStaticRoute.findOne({
    staticRouteId: req.params.staticRouteId,
  });

  if (!tempstaticRoute) {
    return next(
      new ErrorHander(
        `Static Route does not exist with Static Route Id : ${req.params.staticRouteId}`,
        400
      )
    );
  }

  await tempStaticRoute.deleteMany({ staticRouteId: req.params.staticRouteId });

  res.status(200).json({
    success: true,
    message:
      "Static Route Deleted Successfully and is waiting for Admin approval.",
  });
});
