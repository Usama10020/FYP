const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Ip = require("../models/ipAssignmentModel");
const tempIp = require("../models/tempipAssignmentModel");
const Frule = require("../models/fRulesModel");
const tempFrule = require("../models/tempfRulesModel");
const StaticRoute = require("../models/staticRouteModel");
const tempStaticRoute = require("../models/tempstaticRouteModel");
const Vlans = require("../models/vlansModel");
const tempVlans = require("../models/tempvlansModel");
const Device = require("../models/deviceModel");
const { Builder, By, Capabilities, Key, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");

// Register and update Ip
exports.registerAndUpdateIp = catchAsyncErrors(async (req, res, next) => {
  let mes = "Nill";
  const checkIp = await Ip.findOne({
    interfaceName: req.body.interfaceName,
    deviceId: req.body.deviceId,
  });
  const tempCheckIp = await tempIp.findOne({
    interfaceName: req.body.interfaceName,
    deviceId: req.body.deviceId,
  });
  if (!checkIp && !tempCheckIp) {
    //create Ip

    const {
      deviceId,
      interfaceName,
      ipv4Con,
      ipv4Address,
      subnet,
      generatedByUserId,
    } = req.body;

    const device = await Device.findOne({ ipAddress: deviceId });

    if (device) {
      var driver = new Builder()
        .withCapabilities(
          Capabilities.firefox().set("acceptInsecureCerts", true)
        )
        .forBrowser("firefox")
        .setFirefoxOptions(new firefox.Options().addArguments("--headless"))
        .build();
      try {
        await driver.get(`http://${device.ipAddress}`);
        await driver
          .findElement(By.xpath(`//*[@id="usernamefld"]`))
          .sendKeys(device.userId);
        await driver
          .findElement(By.xpath(`//*[@id="passwordfld"]`))
          .sendKeys(device.password);
        await driver
          .findElement(
            By.xpath(`//*[@id="total"]/div/div[2]/div/form/input[4]`)
          )
          .click();
        if (interfaceName === "WAN") {
          await driver.get(`http://${device.ipAddress}/interfaces.php?if=wan`);
        } else if (interfaceName === "LAN") {
          await driver.get(`http://${device.ipAddress}/interfaces.php?if=lan`);
        }
        await driver
          .findElement(By.xpath(`//*[@id="type"]/option[text()='${ipv4Con}']`))
          .click();
        if (ipv4Con === "Static IPv4") {
          await driver.findElement(By.xpath(`//*[@id="ipaddr"]`)).clear();
          await driver
            .findElement(By.xpath(`//*[@id="ipaddr"]`))
            .sendKeys(ipv4Address);
          await driver
            .findElement(
              By.xpath(`//*[@id="subnet"]/option[text()='${subnet}']`)
            )
            .click();
        }
      } finally {
        await driver.findElement(By.xpath(`//*[@id="save"]`)).click();
        mes = await driver
          .findElement(By.xpath(`//*[@id="2"]/div[1]/div`))
          .getText();
        if (mes.includes("error")) {
        } else if (mes.includes("Apply Changes")) {
          const pfData = {
            ipAddress: req.body.ipv4Address,
          };
          await Device.updateMany({ ipAddress: req.body.deviceId }, pfData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });

          const pfData1 = {
            deviceId: req.body.ipv4Address,
          };
          await Frule.updateMany({ deviceId: req.body.deviceId }, pfData1, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });

          const pfData2 = {
            deviceId: req.body.ipv4Address,
          };
          await tempFrule.updateMany({ deviceId: req.body.deviceId }, pfData2, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });

          const pfData3 = {
            deviceId: req.body.ipv4Address,
          };
          await StaticRoute.updateMany(
            { deviceId: req.body.deviceId },
            pfData3,
            {
              new: true,
              runValidators: true,
              useFindAndModify: false,
            }
          );

          const pfData4 = {
            deviceId: req.body.ipv4Address,
          };
          await tempStaticRoute.updateMany(
            { deviceId: req.body.deviceId },
            pfData4,
            {
              new: true,
              runValidators: true,
              useFindAndModify: false,
            }
          );

          const pfData5 = {
            deviceId: req.body.ipv4Address,
          };
          await Vlans.updateMany({ deviceId: req.body.deviceId }, pfData5, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });
          const pfData6 = {
            deviceId: req.body.ipv4Address,
          };
          await tempVlans.updateMany({ deviceId: req.body.deviceId }, pfData6, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });
          const pfData7 = {
            deviceId: req.body.ipv4Address,
          };
          await tempIp.updateMany({ deviceId: req.body.deviceId }, pfData7, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });
          const ip = await Ip.create({
            deviceId,
            interfaceName,
            ipv4Con,
            ipv4Address,
            subnet,
            generatedByUserId,
          });
          await driver.wait(
            until.elementIsVisible(
              driver.findElement(
                By.xpath(`//*[@id="2"]/div[1]/div/form/button`)
              ),
              100000
            )
          );
          await driver
            .findElement(By.xpath(`//*[@id="2"]/div[1]/div/form/button`))
            .click();
          mes = "Apply Changes";
        }
        driver.quit();
      }
    }
    /*if (mes.includes("Apply Changes")) {
      myUpdater();
      const ip = await Ip.create({
        deviceId,
        interfaceName,
        ipv4Con,
        ipv4Address,
        subnet,
        generatedByUserId,
      });
    }*/
  } else if (!checkIp) {
    //create Ip

    const {
      deviceId,
      interfaceName,
      ipv4Con,
      ipv4Address,
      subnet,
      generatedByUserId,
    } = req.body;
    const device = await Device.findOne({ ipAddress: deviceId });
    if (device) {
      var driver = new Builder()
        .withCapabilities(
          Capabilities.firefox().set("acceptInsecureCerts", true)
        )
        .forBrowser("firefox")
        .setFirefoxOptions(new firefox.Options().addArguments("--headless"))
        .build();
      try {
        await driver.get(`http://${device.ipAddress}`);
        await driver
          .findElement(By.xpath(`//*[@id="usernamefld"]`))
          .sendKeys(device.userId);
        await driver
          .findElement(By.xpath(`//*[@id="passwordfld"]`))
          .sendKeys(device.password);
        await driver
          .findElement(
            By.xpath(`//*[@id="total"]/div/div[2]/div/form/input[4]`)
          )
          .click();
        if (interfaceName === "WAN") {
          await driver.get(`http://${device.ipAddress}/interfaces.php?if=wan`);
        } else if (interfaceName === "LAN") {
          await driver.get(`http://${device.ipAddress}/interfaces.php?if=lan`);
        }
        await driver
          .findElement(By.xpath(`//*[@id="type"]/option[text()='${ipv4Con}']`))
          .click();
        if (ipv4Con === "Static IPv4") {
          await driver.findElement(By.xpath(`//*[@id="ipaddr"]`)).clear();
          await driver
            .findElement(By.xpath(`//*[@id="ipaddr"]`))
            .sendKeys(ipv4Address);
          await driver
            .findElement(
              By.xpath(`//*[@id="subnet"]/option[text()='${subnet}']`)
            )
            .click();
        }
      } finally {
        await driver.findElement(By.xpath(`//*[@id="save"]`)).click();
        mes = await driver
          .findElement(By.xpath(`//*[@id="2"]/div[1]/div`))
          .getText();
        if (mes.includes("error")) {
        } else if (mes.includes("Apply Changes")) {
          const pfData = {
            ipAddress: req.body.ipv4Address,
          };
          await Device.updateMany({ ipAddress: req.body.deviceId }, pfData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });

          const pfData1 = {
            deviceId: req.body.ipv4Address,
          };
          await Frule.updateMany({ deviceId: req.body.deviceId }, pfData1, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });

          const pfData2 = {
            deviceId: req.body.ipv4Address,
          };
          await tempFrule.updateMany({ deviceId: req.body.deviceId }, pfData2, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });

          const pfData3 = {
            deviceId: req.body.ipv4Address,
          };
          await StaticRoute.updateMany(
            { deviceId: req.body.deviceId },
            pfData3,
            {
              new: true,
              runValidators: true,
              useFindAndModify: false,
            }
          );

          const pfData4 = {
            deviceId: req.body.ipv4Address,
          };
          await tempStaticRoute.updateMany(
            { deviceId: req.body.deviceId },
            pfData4,
            {
              new: true,
              runValidators: true,
              useFindAndModify: false,
            }
          );

          const pfData5 = {
            deviceId: req.body.ipv4Address,
          };
          await Vlans.updateMany({ deviceId: req.body.deviceId }, pfData5, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });
          const pfData6 = {
            deviceId: req.body.ipv4Address,
          };
          await tempVlans.updateMany({ deviceId: req.body.deviceId }, pfData6, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });
          const pfData7 = {
            deviceId: req.body.ipv4Address,
          };
          await tempIp.updateMany({ deviceId: req.body.deviceId }, pfData7, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });
          const ip = await Ip.create({
            deviceId,
            interfaceName,
            ipv4Con,
            ipv4Address,
            subnet,
            generatedByUserId,
          });
          await driver.wait(
            until.elementIsVisible(
              driver.findElement(
                By.xpath(`//*[@id="2"]/div[1]/div/form/button`)
              ),
              100000
            )
          );
          await driver
            .findElement(By.xpath(`//*[@id="2"]/div[1]/div/form/button`))
            .click();
          mes = "Apply Changes";
        }
        driver.quit();
      }
    }
    /*if (mes.includes("Apply Changes")) {
      myUpdater();
      const ip = await Ip.create({
        deviceId,
        interfaceName,
        ipv4Con,
        ipv4Address,
        subnet,
        generatedByUserId,
      });
    }*/
  } else {
    //update Ip

    const newIpData = {
      deviceId: req.body.ipv4Address,
      interfaceName: req.body.interfaceName,
      ipv4Con: req.body.ipv4Con,
      ipv4Address: req.body.ipv4Address,
      subnet: req.body.subnet,
    };
    const { interfaceName, ipv4Con, ipv4Address, subnet } = req.body;
    const ip = await Ip.findOne({
      interfaceName: req.body.interfaceName,
      deviceId: checkIp.deviceId,
    });
    if (!ip) {
      return next(new ErrorHander(`Interface does not exist.`, 400));
    }
    const device = await Device.findOne({ ipAddress: checkIp.deviceId });
    if (device) {
      var driver = new Builder()
        .withCapabilities(
          Capabilities.firefox().set("acceptInsecureCerts", true)
        )
        .forBrowser("firefox")
        .setFirefoxOptions(new firefox.Options().addArguments("--headless"))
        .build();
      try {
        await driver.get(`http://${device.ipAddress}`);
        await driver
          .findElement(By.xpath(`//*[@id="usernamefld"]`))
          .sendKeys(device.userId);
        await driver
          .findElement(By.xpath(`//*[@id="passwordfld"]`))
          .sendKeys(device.password);
        await driver
          .findElement(
            By.xpath(`//*[@id="total"]/div/div[2]/div/form/input[4]`)
          )
          .click();
        if (interfaceName === "WAN") {
          await driver.get(`http://${device.ipAddress}/interfaces.php?if=wan`);
        } else if (interfaceName === "LAN") {
          await driver.get(`http://${device.ipAddress}/interfaces.php?if=lan`);
        }
        await driver
          .findElement(By.xpath(`//*[@id="type"]/option[text()='${ipv4Con}']`))
          .click();
        if (ipv4Con === "Static IPv4") {
          await driver.findElement(By.xpath(`//*[@id="ipaddr"]`)).clear();
          await driver
            .findElement(By.xpath(`//*[@id="ipaddr"]`))
            .sendKeys(ipv4Address);
          await driver
            .findElement(
              By.xpath(`//*[@id="subnet"]/option[text()='${subnet}']`)
            )
            .click();
        }
      } finally {
        await driver.findElement(By.xpath(`//*[@id="save"]`)).click();
        mes = await driver
          .findElement(By.xpath(`//*[@id="2"]/div[1]/div`))
          .getText();
        if (mes.includes("error")) {
        } else if (mes.includes("Apply Changes")) {
          const pfData = {
            ipAddress: req.body.ipv4Address,
          };
          await Device.updateMany({ ipAddress: req.body.deviceId }, pfData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });

          const pfData1 = {
            deviceId: req.body.ipv4Address,
          };
          await Frule.updateMany({ deviceId: req.body.deviceId }, pfData1, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });

          const pfData2 = {
            deviceId: req.body.ipv4Address,
          };
          await tempFrule.updateMany({ deviceId: req.body.deviceId }, pfData2, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });

          const pfData3 = {
            deviceId: req.body.ipv4Address,
          };
          await StaticRoute.updateMany(
            { deviceId: req.body.deviceId },
            pfData3,
            {
              new: true,
              runValidators: true,
              useFindAndModify: false,
            }
          );

          const pfData4 = {
            deviceId: req.body.ipv4Address,
          };
          await tempStaticRoute.updateMany(
            { deviceId: req.body.deviceId },
            pfData4,
            {
              new: true,
              runValidators: true,
              useFindAndModify: false,
            }
          );

          const pfData5 = {
            deviceId: req.body.ipv4Address,
          };
          await Vlans.updateMany({ deviceId: req.body.deviceId }, pfData5, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });
          const pfData6 = {
            deviceId: req.body.ipv4Address,
          };
          await tempVlans.updateMany({ deviceId: req.body.deviceId }, pfData6, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });
          const pfData7 = {
            deviceId: req.body.ipv4Address,
          };
          await tempIp.updateMany({ deviceId: req.body.deviceId }, pfData7, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });
          await Ip.findOneAndUpdate(
            {
              interfaceName: req.body.interfaceName,
              deviceId: checkIp.deviceId,
            },
            newIpData,
            {
              new: true,
              runValidators: true,
              useFindAndModify: false,
            }
          );
          await driver.wait(
            until.elementIsVisible(
              driver.findElement(
                By.xpath(`//*[@id="2"]/div[1]/div/form/button`)
              ),
              100000
            )
          );
          await driver
            .findElement(By.xpath(`//*[@id="2"]/div[1]/div/form/button`))
            .click();
          mes = "Apply Changes";
        }
        driver.quit();
      }
    }
    /*if (mes.includes("Apply Changes")) {
      myUpdater();
      await Ip.findOneAndUpdate(
        { interfaceName: req.body.interfaceName, deviceId: checkIp.deviceId },
        newIpData,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
    }*/
  }
  res.status(200).json({
    success: true,
    message: mes,
  });
});

// Get single Ip
exports.getSingleIp = catchAsyncErrors(async (req, res, next) => {
  const ipFind = await Ip.findOne({
    interfaceName: req.body.interfaceName,
    deviceId: req.body.deviceId,
  });
  if (!ipFind) {
    return next(new ErrorHander(`Interface does not exist.`, 400));
  }
  res.status(200).json({
    success: true,
    ipFind,
  });
});
