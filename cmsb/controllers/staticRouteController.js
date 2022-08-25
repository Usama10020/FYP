const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const StaticRoute = require("../models/staticRouteModel");
const tempStaticRoute = require("../models/tempstaticRouteModel");
const { Builder, By, Capabilities, Key, until } = require("selenium-webdriver");
const Device = require("../models/deviceModel");
const firefox = require("selenium-webdriver/firefox");

// Register a StaticRoute
exports.registerStaticRoute = catchAsyncErrors(async (req, res, next) => {
  let mes = "NILL";
  const checkStaticRoute = await StaticRoute.findOne({
    staticRouteId: req.body.staticRouteId,
  });
  const tempCheckStaticRoute = await tempStaticRoute.findOne({
    staticRouteId: req.body.staticRouteId,
  });
  var totalStaticRoute = await StaticRoute.countDocuments({
    deviceId: req.body.deviceId,
  });
  var pfId = 0;
  var pfDelId = 1;
  pfId = totalStaticRoute;
  pfDelId = totalStaticRoute + 1;
  if (req.body.isCreated !== "1") {
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
          await driver.get(`http://${device.ipAddress}/system_routes_edit.php`);
          await driver.findElement(By.xpath(`//*[@id="network"]`)).clear();
          await driver
            .findElement(By.xpath(`//*[@id="network"]`))
            .sendKeys(destinationNetwork);
          await driver
            .findElement(By.xpath(`//*[@id="network_subnet"]`))
            .sendKeys(subnet);
          if (gateway === "WAN_DHCP") {
            driver
              .findElement(By.xpath(`//*[@id="gateway"]/option[1]`))
              .click();
          } else if (gateway === "WAN_DHCP6") {
            driver
              .findElement(By.xpath(`//*[@id="gateway"]/option[2]`))
              .click();
          } else if (gateway === "Null4") {
            driver
              .findElement(By.xpath(`//*[@id="gateway"]/option[3]`))
              .click();
          } else if (gateway === "Null6") {
            driver
              .findElement(By.xpath(`//*[@id="gateway"]/option[4]`))
              .click();
          } else {
            driver
              .findElement(By.xpath(`//*[@id="gateway"]`))
              .sendKeys(gateway);
          }
          if (disabled === true) {
            await driver.findElement(By.xpath(`//*[@id="disabled"]`)).click();
          }
          await driver.findElement(By.xpath(`//*[@id="descr"]`)).clear();
          await driver
            .findElement(By.xpath(`//*[@id="descr"]`))
            .sendKeys(description);
        } finally {
          await driver.findElement(By.xpath(`//*[@id="save"]`)).click();
          mes = await driver
            .findElement(By.xpath(`//*[@id="2"]/div[1]/div`))
            .getText();
          if (mes.includes("error")) {
          } else {
            await driver.wait(
              until.elementIsVisible(
                driver.findElement(
                  By.xpath(`//*[@id="2"]/div/div[1]/form/button`)
                ),
                100000
              )
            );
            await driver
              .findElement(By.xpath(`//*[@id="2"]/div/div[1]/form/button`))
              .click();
          }
          driver.quit();
        }
      }
      if (mes.includes("Apply Changes")) {
        const staticRoute = await StaticRoute.create({
          staticRouteId,
          deviceId,
          destinationNetwork,
          subnet,
          gateway,
          disabled,
          description,
          pfsenseId: pfId,
          pfsenseDeleteId: pfDelId,
          generatedByUserId,
        });
      }
    } else {
      mes = "Error: Duplicate Static Route Id Entered";
    }
  } else {
    if (!checkStaticRoute) {
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
          await driver.get(`http://${device.ipAddress}/system_routes_edit.php`);
          await driver.findElement(By.xpath(`//*[@id="network"]`)).clear();
          await driver
            .findElement(By.xpath(`//*[@id="network"]`))
            .sendKeys(destinationNetwork);
          await driver
            .findElement(By.xpath(`//*[@id="network_subnet"]`))
            .sendKeys(subnet);
          if (gateway === "WAN_DHCP") {
            driver
              .findElement(By.xpath(`//*[@id="gateway"]/option[1]`))
              .click();
          } else if (gateway === "WAN_DHCP6") {
            driver
              .findElement(By.xpath(`//*[@id="gateway"]/option[2]`))
              .click();
          } else if (gateway === "Null4") {
            driver
              .findElement(By.xpath(`//*[@id="gateway"]/option[3]`))
              .click();
          } else if (gateway === "Null6") {
            driver
              .findElement(By.xpath(`//*[@id="gateway"]/option[4]`))
              .click();
          } else {
            driver
              .findElement(By.xpath(`//*[@id="gateway"]`))
              .sendKeys(gateway);
          }
          if (disabled === true) {
            await driver.findElement(By.xpath(`//*[@id="disabled"]`)).click();
          }
          await driver.findElement(By.xpath(`//*[@id="descr"]`)).clear();
          await driver
            .findElement(By.xpath(`//*[@id="descr"]`))
            .sendKeys(description);
        } finally {
          await driver.findElement(By.xpath(`//*[@id="save"]`)).click();
          mes = await driver
            .findElement(By.xpath(`//*[@id="2"]/div[1]/div`))
            .getText();
          if (mes.includes("error")) {
          } else {
            await driver.wait(
              until.elementIsVisible(
                driver.findElement(
                  By.xpath(`//*[@id="2"]/div/div[1]/form/button`)
                ),
                100000
              )
            );
            await driver
              .findElement(By.xpath(`//*[@id="2"]/div/div[1]/form/button`))
              .click();
          }
          driver.quit();
        }
        if (mes.includes("Apply Changes")) {
          const staticRoute = await StaticRoute.create({
            staticRouteId,
            deviceId,
            destinationNetwork,
            subnet,
            gateway,
            disabled,
            description,
            pfsenseId: pfId,
            pfsenseDeleteId: pfDelId,
            generatedByUserId,
          });
        }
      }
    } else {
      mes = "Error: Duplicate Static Rule Id Entered";
    }
  }
  res.status(200).json({
    success: true,
    message: mes,
  });
});

// Get all Static Routes(admin)
exports.getAllStaticRoute = catchAsyncErrors(async (req, res, next) => {
  const staticRoutes = await StaticRoute.find().sort({ pfsenseId: 1 });

  res.status(200).json({
    success: true,
    message: "Static Routes fetched successfully",
    staticRoutes,
  });
});

// Get single Static Route (admin)
exports.getSingleStaticRoute = catchAsyncErrors(async (req, res, next) => {
  const staticRoute = await StaticRoute.findOne({
    staticRouteId: req.params.staticRouteId,
  });
  if (!staticRoute) {
    return next(
      new ErrorHander(
        `Static Route does not exist with Static Route Id : ${req.params.staticRouteId}`,
        400
      )
    );
  }
  res.status(200).json({
    success: true,
    staticRoute,
  });
});

// update StaticRoute -- Admin
exports.updateStaticRoute = catchAsyncErrors(async (req, res, next) => {
  let mes = "NILL";
  const newStaticRouteData = {
    destinationNetwork: req.body.destinationNetwork,
    subnet: req.body.subnet,
    gateway: req.body.gateway,
    disabled: req.body.disabled,
    description: req.body.description,
  };
  const { destinationNetwork, subnet, gateway, disabled, description } =
    req.body;
  const staticRoute = await StaticRoute.findOne({
    staticRouteId: req.params.staticRouteId,
  });
  if (!staticRoute) {
    return next(
      new ErrorHander(
        `Static Route does not exist with Static Route Id : ${req.params.staticRouteId}`,
        400
      )
    );
  }
  const device = await Device.findOne({ ipAddress: staticRoute.deviceId });
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
        `http://${device.ipAddress}/system_routes_edit.php?id=${staticRoute.pfsenseId}`
      );
      await driver.findElement(By.xpath(`//*[@id="network"]`)).clear();
      await driver
        .findElement(By.xpath(`//*[@id="network"]`))
        .sendKeys(destinationNetwork);
      await driver
        .findElement(By.xpath(`//*[@id="network_subnet"]`))
        .sendKeys(subnet);
      if (gateway === "WAN_DHCP") {
        driver.findElement(By.xpath(`//*[@id="gateway"]/option[1]`)).click();
      } else if (gateway === "WAN_DHCP6") {
        driver.findElement(By.xpath(`//*[@id="gateway"]/option[2]`)).click();
      } else if (gateway === "Null4") {
        driver.findElement(By.xpath(`//*[@id="gateway"]/option[3]`)).click();
      } else if (gateway === "Null6") {
        driver.findElement(By.xpath(`//*[@id="gateway"]/option[4]`)).click();
      } else {
        driver.findElement(By.xpath(`//*[@id="gateway"]`)).sendKeys(gateway);
      }
      if (
        disabled === true &&
        (await driver
          .findElement(By.xpath(`//*[@id="disabled"]`))
          .isSelected()) == false
      ) {
        await driver.findElement(By.xpath(`//*[@id="disabled"]`)).click();
      } else if (
        disabled === false &&
        (await driver
          .findElement(By.xpath(`//*[@id="disabled"]`))
          .isSelected()) == true
      ) {
        await driver.findElement(By.xpath(`//*[@id="disabled"]`)).click();
      }
      await driver.findElement(By.xpath(`//*[@id="descr"]`)).clear();
      await driver
        .findElement(By.xpath(`//*[@id="descr"]`))
        .sendKeys(description);
    } finally {
      await driver.findElement(By.xpath(`//*[@id="save"]`)).click();
      mes = await driver
        .findElement(By.xpath(`//*[@id="2"]/div[1]/div`))
        .getText();
      if (mes.includes("error")) {
      } else {
        await driver.wait(
          until.elementIsVisible(
            driver.findElement(By.xpath(`//*[@id="2"]/div/div[1]/form/button`)),
            100000
          )
        );
        await driver
          .findElement(By.xpath(`//*[@id="2"]/div/div[1]/form/button`))
          .click();
      }
      driver.quit();
    }
  }
  if (mes.includes("Apply Changes")) {
    await StaticRoute.findOneAndUpdate(
      { staticRouteId: req.params.staticRouteId },
      newStaticRouteData,
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

// Delete StaticRoute --Admin
exports.deleteStaticRoute = catchAsyncErrors(async (req, res, next) => {
  var mes = "Error";
  const staticRoute = await StaticRoute.findOne({
    staticRouteId: req.params.staticRouteId,
  });

  if (!staticRoute) {
    return next(
      new ErrorHander(
        `Static Route does not exist with Static Route Id : ${req.params.staticRouteId}`,
        400
      )
    );
  }

  const device = await Device.findOne({ ipAddress: staticRoute.deviceId });
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
      await driver.get(`http://${device.ipAddress}/system_routes.php`);
      await driver.wait(
        until.elementLocated(
          By.xpath(
            `//*[@id="2"]/div/div[1]/div[2]/div/table/tbody/tr[${staticRoute.pfsenseDeleteId}]/td[6]/a[4]`
          ),
          100000
        )
      );
      driver
        .findElement(
          By.xpath(
            `//*[@id="2"]/div/div[1]/div[2]/div/table/tbody/tr[${staticRoute.pfsenseDeleteId}]/td[6]/a[4]`
          )
        )
        .click();
      await driver.wait(until.alertIsPresent());
      let alert = await driver.switchTo().alert();
      let alertText = await alert.getText();
      if (alertText === "Are you sure you wish to delete route?") {
        await alert.accept();
      } else {
        await alert.dismiss();
      }
    } finally {
      mes = "Static Route Deleted Successfully.";
      driver.quit();
    }
  }
  //code to change pfsense id

  const indexChanger1 = await StaticRoute.find({
    deviceId: staticRoute.deviceId,
  });
  indexChanger1.map(async (test) => {
    if (test.pfsenseId > staticRoute.pfsenseId) {
      let prevId = Number(test.pfsenseId);
      prevId = prevId - 1;
      const pfData = {
        pfsenseId: prevId,
      };
      await StaticRoute.findOneAndUpdate(
        { staticRouteId: test.staticRouteId },
        pfData,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
    }
  });
  const indexChanger = await StaticRoute.find({
    deviceId: staticRoute.deviceId,
  });
  indexChanger.map(async (test) => {
    if (test.pfsenseDeleteId > staticRoute.pfsenseDeleteId) {
      let prevId = Number(test.pfsenseDeleteId);
      prevId = prevId - 1;
      const pfDataa = {
        pfsenseDeleteId: prevId,
      };
      await StaticRoute.findOneAndUpdate(
        { staticRouteId: test.staticRouteId },
        pfDataa,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
    }
  });

  await staticRoute.remove();
  res.status(200).json({
    success: true,
    message: mes,
  });
});
