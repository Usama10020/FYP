const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Vlans = require("../models/vlansModel");
const tempVlans = require("../models/tempvlansModel");
const { Builder, By, Capabilities, Key, until } = require("selenium-webdriver");
const Device = require("../models/deviceModel");
const firefox = require("selenium-webdriver/firefox");

// Register a Vlans
exports.registerVlans = catchAsyncErrors(async (req, res, next) => {
  let mes = "Apply Changes";
  const checkVlans = await Vlans.findOne({
    vlansId: req.body.vlansId,
  });
  const tempCheckVlans = await tempVlans.findOne({
    vlansId: req.body.vlansId,
  });
  var totalVlans = await Vlans.countDocuments({
    deviceId: req.body.deviceId,
  });
  var pfId = 0;
  var pfDelId = 0;
  pfId = totalVlans;
  pfDelId = totalVlans;
  if (req.body.isCreated !== "1") {
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
          await driver.get(`http://${device.ipAddress}/interfaces_vlan.php`);
          await driver
            .findElement(By.xpath(`//*[@id="2"]/div/form/nav/a`))
            .click();
          if (parentInterface === "em0") {
            await driver
              .findElement(By.xpath(`//*[@id="if"]/option[1]`))
              .click();
          } else if (parentInterface === "em1") {
            await driver
              .findElement(By.xpath(`//*[@id="if"]/option[2]`))
              .click();
          } else {
            await driver
              .findElement(By.xpath(`//*[@id="if"]`))
              .sendKeys(parentInterface);
          }
          await driver.findElement(By.xpath(`//*[@id="tag"]`)).clear();
          await driver
            .findElement(By.xpath(`//*[@id="tag"]`))
            .sendKeys(vlanTag);
          await driver.findElement(By.xpath(`//*[@id="pcp"]`)).clear();
          await driver
            .findElement(By.xpath(`//*[@id="pcp"]`))
            .sendKeys(vlanPriority);
          await driver.findElement(By.xpath(`//*[@id="descr"]`)).clear();
          await driver
            .findElement(By.xpath(`//*[@id="descr"]`))
            .sendKeys(description);
        } finally {
          await driver.findElement(By.xpath(`//*[@id="save"]`)).click();
          mes = await driver
            .findElement(By.xpath(`//*[@id="2"]/div/div`))
            .getText();
          if (mes.includes("error")) {
          } else {
            mes = "Apply Changes";
          }
          driver.quit();
        }
      }
      if (mes.includes("Apply Changes")) {
        const vlans = await Vlans.create({
          vlansId,
          deviceId,
          parentInterface,
          vlanTag,
          vlanPriority,
          description,
          pfsenseId: pfId,
          pfsenseDeleteId: pfDelId,
          generatedByUserId,
        });
      }
    } else {
      mes = "Error: Duplicate Id Entered";
    }
  } else {
    if (!checkVlans) {
      const {
        vlansId,
        deviceId,
        parentInterface,
        vlanTag,
        vlanPriority,
        description,
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
          await driver.get(`http://${device.ipAddress}/interfaces_vlan.php`);
          await driver
            .findElement(By.xpath(`//*[@id="2"]/div/form/nav/a`))
            .click();
          if (parentInterface === "em0") {
            await driver
              .findElement(By.xpath(`//*[@id="if"]/option[1]`))
              .click();
          } else if (parentInterface === "em1") {
            await driver
              .findElement(By.xpath(`//*[@id="if"]/option[2]`))
              .click();
          } else {
            await driver
              .findElement(By.xpath(`//*[@id="if"]`))
              .sendKeys(parentInterface);
          }
          await driver.findElement(By.xpath(`//*[@id="tag"]`)).clear();
          await driver
            .findElement(By.xpath(`//*[@id="tag"]`))
            .sendKeys(vlanTag);
          await driver.findElement(By.xpath(`//*[@id="pcp"]`)).clear();
          await driver
            .findElement(By.xpath(`//*[@id="pcp"]`))
            .sendKeys(vlanPriority);
          await driver.findElement(By.xpath(`//*[@id="descr"]`)).clear();
          await driver
            .findElement(By.xpath(`//*[@id="descr"]`))
            .sendKeys(description);
        } finally {
          await driver.findElement(By.xpath(`//*[@id="save"]`)).click();
          mes = await driver
            .findElement(By.xpath(`//*[@id="2"]/div/div`))
            .getText();
          if (mes.includes("error")) {
          } else {
            mes = "Apply Changes";
          }
          driver.quit();
        }
        if (mes.includes("Apply Changes")) {
          const vlans = await Vlans.create({
            vlansId,
            deviceId,
            parentInterface,
            vlanTag,
            vlanPriority,
            description,
            pfsenseId: pfId,
            pfsenseDeleteId: pfDelId,
            generatedByUserId,
          });
        }
      }
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
  const vlans = await Vlans.find().sort({ pfsenseId: 1 });

  res.status(200).json({
    success: true,
    message: "Vlans fetched successfully",
    vlans,
  });
});

// Get single Vlan (admin)
exports.getSingleVlans = catchAsyncErrors(async (req, res, next) => {
  const vlans = await Vlans.findOne({
    vlansId: req.params.vlansId,
  });
  if (!vlans) {
    return next(
      new ErrorHander(
        `Vlan does not exist with Id : ${req.params.vlansId}`,
        400
      )
    );
  }
  res.status(200).json({
    success: true,
    vlans,
  });
});

// update Vlan -- Admin
exports.updateVlans = catchAsyncErrors(async (req, res, next) => {
  let mes = "Apply Changes";
  const newVlansData = {
    parentInterface: req.body.parentInterface,
    vlanTag: req.body.vlanTag,
    vlanPriority: req.body.vlanPriority,
    description: req.body.description,
  };
  const { parentInterface, vlanTag, vlanPriority, description } = req.body;
  const vlans = await Vlans.findOne({
    vlansId: req.params.vlansId,
  });
  if (!vlans) {
    return next(
      new ErrorHander(
        `Vlan does not exist with Id : ${req.params.vlansId}`,
        400
      )
    );
  }
  const device = await Device.findOne({ ipAddress: vlans.deviceId });
  if (device) {
    var driver = new Builder()
      .withCapabilities(Capabilities.firefox().set("acceptInsecureCerts", true))
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
        .findElement(By.xpath(`//*[@id="total"]/div/div[2]/div/form/input[4]`))
        .click();
      await driver.get(
        `http://${device.ipAddress}/interfaces_vlan_edit.php?id=${vlans.pfsenseId}`
      );
      if (parentInterface === "em0") {
        await driver.findElement(By.xpath(`//*[@id="if"]/option[1]`)).click();
      } else if (parentInterface === "em1") {
        await driver.findElement(By.xpath(`//*[@id="if"]/option[2]`)).click();
      } else {
        await driver
          .findElement(By.xpath(`//*[@id="if"]`))
          .sendKeys(parentInterface);
      }
      await driver.findElement(By.xpath(`//*[@id="tag"]`)).clear();
      await driver.findElement(By.xpath(`//*[@id="tag"]`)).sendKeys(vlanTag);
      await driver.findElement(By.xpath(`//*[@id="pcp"]`)).clear();
      await driver
        .findElement(By.xpath(`//*[@id="pcp"]`))
        .sendKeys(vlanPriority);
      await driver.findElement(By.xpath(`//*[@id="descr"]`)).clear();
      await driver
        .findElement(By.xpath(`//*[@id="descr"]`))
        .sendKeys(description);
    } finally {
      await driver.findElement(By.xpath(`//*[@id="save"]`)).click();
      mes = await driver
        .findElement(By.xpath(`//*[@id="2"]/div/div`))
        .getText();
      if (mes.includes("error")) {
      } else {
        mes = "Apply Changes";
      }
      driver.quit();
    }
  }
  if (mes.includes("Apply Changes")) {
    await Vlans.findOneAndUpdate(
      { vlansId: req.params.vlansId },
      newVlansData,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  }

  res.status(200).json({
    success: true,
    message: mes,
  });
});

// Delete Vlan --Admin
exports.deleteVlans = catchAsyncErrors(async (req, res, next) => {
  var mes = "Error";
  const vlans = await Vlans.findOne({
    vlansId: req.params.vlansId,
  });

  if (!vlans) {
    return next(
      new ErrorHander(
        `Vlan does not exist with Id : ${req.params.vlansId}`,
        400
      )
    );
  }

  const device = await Device.findOne({ ipAddress: vlans.deviceId });
  if (device) {
    var driver = new Builder()
      .withCapabilities(Capabilities.firefox().set("acceptInsecureCerts", true))
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
        .findElement(By.xpath(`//*[@id="total"]/div/div[2]/div/form/input[4]`))
        .click();
      await driver.get(`http://${device.ipAddress}/interfaces_vlan.php`);
      if (
        await driver.wait(
          until.elementLocated(
            By.xpath(`//*[@id="del-${vlans.pfsenseDeleteId}"]`),
            4000
          )
        )
      ) {
        if (
          await driver.wait(
            until.elementIsVisible(
              driver.findElement(
                By.xpath(`//*[@id="del-${vlans.pfsenseDeleteId}"]`)
              ),
              10000
            )
          )
        ) {
          await driver
            .findElement(By.xpath(`//*[@id="del-${vlans.pfsenseDeleteId}"]`))
            .click();
          await driver.wait(until.alertIsPresent());
          let alert = await driver.switchTo().alert();
          let alertText = await alert.getText();
          if (alertText === "Are you sure you want to delete this VLAN?") {
            await alert.accept();
          } else {
            await alert.dismiss();
          }
        }
      }
    } finally {
      mes = "Vlan Deleted Successfully.";
      driver.quit();
    }
  }
  //code to change pfsense id

  const indexChanger1 = await Vlans.find({
    deviceId: vlans.deviceId,
  });
  indexChanger1.map(async (test) => {
    if (test.pfsenseId > vlans.pfsenseId) {
      let prevId = Number(test.pfsenseId);
      prevId = prevId - 1;
      const pfData = {
        pfsenseId: prevId,
      };
      await Vlans.findOneAndUpdate({ vlansId: test.vlansId }, pfData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
    }
  });
  const indexChanger = await Vlans.find({
    deviceId: vlans.deviceId,
  });
  indexChanger.map(async (test) => {
    if (test.pfsenseDeleteId > vlans.pfsenseDeleteId) {
      let prevId = Number(test.pfsenseDeleteId);
      prevId = prevId - 1;
      const pfDataa = {
        pfsenseDeleteId: prevId,
      };
      await Vlans.findOneAndUpdate({ vlansId: test.vlansId }, pfDataa, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
    }
  });

  await vlans.remove();
  res.status(200).json({
    success: true,
    message: mes,
  });
});
