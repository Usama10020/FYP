const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Ip = require("../models/ipAssignmentModel");
const tempIp = require("../models/tempipAssignmentModel");

// Register a temp  Ip
exports.registerAndUpdateIp = catchAsyncErrors(async (req, res, next) => {
  let mes = "NILL";
  const checkIp = await Ip.findOne({
    interfaceName: req.body.interfaceName,
    deviceId: req.body.deviceId,
  });
  const tempCheckIp = await tempIp.findOne({
    interfaceName: req.body.interfaceName,
    deviceId: req.body.deviceId,
  });
  var totalRulesWithSpecificIdAndVersion = await tempIp.countDocuments({
    deviceId: req.body.deviceId,
    interfaceName: req.body.interfaceName,
  });
  if (req.user.role === "Admin") {
    if (!tempCheckIp) {
      const {
        deviceId,
        interfaceName,
        ipv4Con,
        ipv4Address,
        subnet,
        generatedByUserId,
      } = req.body;

      const tempip = await tempIp.create({
        deviceId,
        interfaceName,
        ipv4Con,
        ipv4Address,
        subnet,
        generatedByUserId,
        version: totalRulesWithSpecificIdAndVersion,
      });
      mes = "Operation Succesfull";
    } else {
      const {
        deviceId,
        interfaceName,
        ipv4Con,
        ipv4Address,
        subnet,
        generatedByUserId,
      } = req.body;
      await tempIp.create({
        deviceId,
        interfaceName,
        ipv4Con,
        ipv4Address,
        subnet,
        generatedByUserId,
        version: totalRulesWithSpecificIdAndVersion,
      });
      mes = "Operation Succesfull";
    }
  } else if (req.user.role === "Operator") {
    if (!checkIp && !tempCheckIp) {
      const {
        deviceId,
        interfaceName,
        ipv4Con,
        ipv4Address,
        subnet,
        generatedByUserId,
      } = req.body;

      const tempip = await tempIp.create({
        deviceId,
        interfaceName,
        ipv4Con,
        ipv4Address,
        subnet,
        generatedByUserId,
        version: totalRulesWithSpecificIdAndVersion,
      });
      mes = "Operation Succesfull";
    } else {
      const {
        deviceId,
        interfaceName,
        ipv4Con,
        ipv4Address,
        subnet,
        generatedByUserId,
      } = req.body;
      await tempIp.create({
        deviceId,
        interfaceName,
        ipv4Con,
        ipv4Address,
        subnet,
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

// Get single Ip (admin)
exports.getSingleIp = catchAsyncErrors(async (req, res, next) => {
  const tempip = await tempIp.findOne({
    interfaceName: req.body.interfaceName,
    deviceId: req.body.deviceId,
    version: req.body.version,
  });
  if (!tempip) {
    return next(new ErrorHander(`Interface does not exist.`));
  }
  res.status(200).json({
    success: true,
    tempip,
  });
});
