const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const RIp = require("../models/rIpModel");
const tempRIp = require("../models/temprIpModel");

// Register a temp  RIp
exports.registerAndUpdaterIp = catchAsyncErrors(async (req, res, next) => {
  let mes = "NILL";
  const checkIp = await RIp.findOne({
    interfaceName: req.body.interfaceName,
    deviceId: req.body.deviceId,
    devicePort: req.body.devicePort,
  });
  const tempCheckIp = await tempRIp.findOne({
    interfaceName: req.body.interfaceName,
    deviceId: req.body.deviceId,
    devicePort: req.body.devicePort,
  });
  var totalRulesWithSpecificIdAndVersion = await tempRIp.countDocuments({
    deviceId: req.body.deviceId,
    interfaceName: req.body.interfaceName,
    devicePort: req.body.devicePort,
  });
  if (req.user.role === "Admin") {
    if (!tempCheckIp) {
      const {
        deviceId,
        devicePort,
        interfaceName,
        ipAddress,
        subnetMask,
        generatedByUserId,
      } = req.body;

      const temprip = await tempRIp.create({
        deviceId,
        devicePort,
        interfaceName,
        ipAddress,
        subnetMask,
        generatedByUserId,
        version: totalRulesWithSpecificIdAndVersion,
      });
      mes = "Operation Succesfull";
    } else {
      const {
        deviceId,
        devicePort,
        interfaceName,
        ipAddress,
        subnetMask,
        generatedByUserId,
      } = req.body;
      await tempRIp.create({
        deviceId,
        devicePort,
        interfaceName,
        ipAddress,
        subnetMask,
        generatedByUserId,
        version: totalRulesWithSpecificIdAndVersion,
      });
      mes = "Operation Succesfull";
    }
  } else if (req.user.role === "Operator") {
    if (!checkIp && !tempCheckIp) {
      const {
        deviceId,
        devicePort,
        interfaceName,
        ipAddress,
        subnetMask,
        generatedByUserId,
      } = req.body;

      const temprip = await tempRIp.create({
        deviceId,
        devicePort,
        interfaceName,
        ipAddress,
        subnetMask,
        generatedByUserId,
        version: totalRulesWithSpecificIdAndVersion,
      });
      mes = "Operation Succesfull";
    } else {
      const {
        deviceId,
        devicePort,
        interfaceName,
        ipAddress,
        subnetMask,
        generatedByUserId,
      } = req.body;
      await tempRIp.create({
        deviceId,
        devicePort,
        interfaceName,
        ipAddress,
        subnetMask,
        generatedByUserId,
        version: totalRulesWithSpecificIdAndVersion,
      });
      mes = "Operation Succesfull";
    }
  }
  res.status(200).json({
    success: true,
    message: mes,
  });
});

// Get single RIp (admin)
exports.getSinglerIp = catchAsyncErrors(async (req, res, next) => {
  const temprip = await tempRIp.findOne({
    interfaceName: req.body.interfaceName,
    deviceId: req.body.deviceId,
    devicePort: req.body.devicePort,
    version: req.body.version,
  });
  if (!temprip) {
    return next(new ErrorHander(`Interface does not exist.`));
  }
  res.status(200).json({
    success: true,
    temprip,
  });
});
