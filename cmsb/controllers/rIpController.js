const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const RIp = require("../models/rIpModel");
const tempRIp = require("../models/temprIpModel");
const Device = require("../models/deviceModel");
const { Telnet } = require("telnet-client");

const myFunc = async () => {
  const connection = new Telnet();

  // these parameters are just examples and most probably won't work for your use-case.
  const params = {
    host: "localhost",
    port: 5000,
    shellPrompt: ">", // or negotiationMandatory: false
    timeout: 1500,
  };

  try {
    await connection.connect(params);
  } catch (error) {
    // handle the throw (timeout)
    console.log(`error: ${error}`);
  }
  //irs: Input record separator. A separator used to distinguish between lines of the response. Defaults to '\r\n'.
  //ors: Output record separator. A separator used to execute commands (break lines on input). Defaults to '\n'.
  const res = await connection.exec("enable", { irs: "\n" });

  //here i want to press enter key

  const res1 = await connection.exec("show running-config", {
    shellPrompt: "#",
    irs: "\n",
  });

  //here i want to press enter key
  console.log(`res1: ${res1}`);
};

// Register and update RIp
exports.registerAndUpdaterIp = catchAsyncErrors(async (req, res, next) => {
  let mes = "Nill";
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
  if (!checkIp && !tempCheckIp) {
    //create RIp

    const {
      deviceId,
      devicePort,
      interfaceName,
      ipAddress,
      subnetMask,
      generatedByUserId,
    } = req.body;

    const device = await Device.findOne({
      ipAddress: deviceId,
      devicePort: devicePort,
    });

    if (device) {
      myFunc();
      mes = "Apply Changes";
    }
    if (mes.includes("Apply Changes")) {
      const ip = await RIp.create({
        deviceId,
        devicePort,
        interfaceName,
        ipAddress,
        subnetMask,
        generatedByUserId,
      });
    }
  } else if (!checkIp) {
    //create RIp

    const {
      deviceId,
      devicePort,
      interfaceName,
      ipAddress,
      subnetMask,
      generatedByUserId,
    } = req.body;
    const device = await Device.findOne({
      ipAddress: deviceId,
      devicePort: req.body.devicePort,
    });
    if (device) {
      myFunc();

      mes = "Apply Changes";
    }
    if (mes.includes("Apply Changes")) {
      const ip = await RIp.create({
        deviceId,
        devicePort,
        interfaceName,
        ipAddress,
        subnetMask,
        generatedByUserId,
      });
    }
  } else {
    //update RIp

    const newIpData = {
      interfaceName: req.body.interfaceName,
      ipAddress: req.body.ipAddress,
      subnetMask: req.body.subnetMask,
    };
    const { interfaceName, ipAddress, subnetMask } = req.body;
    const ip = await RIp.findOne({
      interfaceName: req.body.interfaceName,
      deviceId: checkIp.deviceId,
      devicePort: checkIp.devicePort,
    });
    if (!ip) {
      return next(new ErrorHander(`Interface does not exist.`, 400));
    }
    const device = await Device.findOne({
      ipAddress: checkIp.deviceId,
      devicePort: checkIp.devicePort,
    });
    if (device) {
      myFunc();
      mes = "Apply Changes";
    }
    if (mes.includes("Apply Changes")) {
      await RIp.findOneAndUpdate(
        {
          interfaceName: req.body.interfaceName,
          deviceId: checkIp.deviceId,
          devicePort: checkIp.devicePort,
        },
        newIpData,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
    }
  }
  res.status(200).json({
    success: true,
    message: mes,
  });
});

// Get single RIp
exports.getSinglerIp = catchAsyncErrors(async (req, res, next) => {
  const ipFind = await RIp.findOne({
    interfaceName: req.body.interfaceName,
    deviceId: req.body.deviceId,
    devicePort: req.body.devicePort,
  });
  if (!ipFind) {
    return next(new ErrorHander(`Interface does not exist.`, 400));
  }
  res.status(200).json({
    success: true,
    ipFind,
  });
});
