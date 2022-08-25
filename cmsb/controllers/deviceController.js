const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Device = require("../models/deviceModel");
const { Builder, By, Capabilities, Key, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const { resetWatchers } = require("nodemon/lib/monitor/watch");

// Register a Device
exports.registerDevice = catchAsyncErrors(async (req, res, next) => {
  const { ipAddress, portAddress, deviceName, userId, password, deviceType } =
    req.body;
  if (deviceType === "firewall") {
    var driver = new Builder()
      .withCapabilities(Capabilities.firefox().set("acceptInsecureCerts", true))
      .forBrowser("firefox")
      .setFirefoxOptions(new firefox.Options().addArguments("--headless"))
      .build();
    try {
      await driver.get(`http://${ipAddress}`);
    } finally {
      driver.quit();
    }
  } else if (deviceType === "router") {
  } else if (deviceType === "switch") {
  }
  let myvarPort = portAddress;
  if (deviceType === "firewall") {
    myvarPort = "";
  }
  const device = await Device.create({
    ipAddress,
    portAddress: myvarPort,
    deviceName,
    userId,
    password,
    deviceType,
  });
  res.status(200).json({
    success: true,
    message: `Device added successfully`,
  });
});

// Get all devices(admin)
exports.getAllDevices = catchAsyncErrors(async (req, res, next) => {
  const devices = await Device.find();

  res.status(200).json({
    success: true,
    message: "Devices Data Fetched Successfully",
    devices,
  });
});

// Get single device (admin)
exports.getSingleDevice = catchAsyncErrors(async (req, res, next) => {
  const device = await Device.findOne({
    ipAddress: req.params.ipAddress,
  });

  if (!device) {
    return next(
      new ErrorHander(
        `Device does not exist with Ip Address: ${req.params.ipAddress}`
      )
    );
  }

  res.status(200).json({
    success: true,
    device,
  });
});

// update Device  -- Admin
exports.updateDeviceType = catchAsyncErrors(async (req, res, next) => {
  let myvarPort = req.body.portAddress;
  if (req.body.deviceType === "firewall") {
    myvarPort = "";
  }
  const newDeviceData = {
    ipAddress: req.body.ipAddress,
    portAddress: myvarPort,
    deviceName: req.body.deviceName,
    userId: req.body.userId,
    password: req.body.password,
    deviceType: req.body.deviceType,
  };
  const device = await Device.findOne({
    ipAddress: req.params.ipAddress,
    portAddress: req.body.findPort,
  });
  if (!device) {
    return next(
      new ErrorHander(
        `Device does not exist with Ip Address: ${req.params.ipAddress}`
      )
    );
  }
  await Device.findOneAndUpdate(
    { ipAddress: req.params.ipAddress, portAddress: req.body.findPort },
    newDeviceData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Device Updated Successfully",
    device,
  });
});

// Delete Device --Admin
exports.deleteDevice = catchAsyncErrors(async (req, res, next) => {
  const device = await Device.findOne({
    ipAddress: req.params.ipAddress,
    portAddress: req.body.portAddress,
  });

  if (!device) {
    return next(
      new ErrorHander(
        `Device does not exist with Ip Address: ${req.params.ipAddress}`,
        400
      )
    );
  }

  await device.remove();

  res.status(200).json({
    success: true,
    message: "Device Deleted Successfully",
  });
});

// Get single device post (admin)
exports.postGetSingleDevice = catchAsyncErrors(async (req, res, next) => {
  const device = await Device.findOne({
    ipAddress: req.body.ipAddress,
    portAddress: req.body.portAddress,
  });

  if (!device) {
    return next(
      new ErrorHander(
        `Device does not exist with Ip Address: ${req.body.ipAddress}`
      )
    );
  }

  res.status(200).json({
    success: true,
    device,
  });
});
