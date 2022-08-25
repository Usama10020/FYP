const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Frule = require("../models/fRulesModel");
const tempFrule = require("../models/tempfRulesModel");
const { Builder, By, Capabilities, Key, until } = require("selenium-webdriver");
const Device = require("../models/deviceModel");
const firefox = require("selenium-webdriver/firefox");

// Register a Frule
exports.registerFrule = catchAsyncErrors(async (req, res, next) => {
  let mes = "NILL";
  const checkFrule = await Frule.findOne({ ruleId: req.body.ruleId });
  const tempCheckFrule = await tempFrule.findOne({ ruleId: req.body.ruleId });
  var totalRules = await Frule.countDocuments({ deviceId: req.body.deviceId });
  var floatRules = await Frule.countDocuments({
    deviceId: req.body.deviceId,
    rtype: "FLOATING",
  });
  var wanRules = await Frule.countDocuments({
    deviceId: req.body.deviceId,
    rtype: "WAN",
  });
  var lanRules = await Frule.countDocuments({
    deviceId: req.body.deviceId,
    rtype: "LAN",
  });
  var pfId = 0;
  var pfDelId = 0;
  if (req.body.rtype === "FLOATING") {
    pfId = floatRules;
    pfDelId = floatRules;
  } else if (req.body.rtype === "WAN") {
    pfId = floatRules + wanRules;
    pfDelId = wanRules;
  } else if (req.body.rtype === "LAN") {
    pfId = totalRules;
    pfDelId = lanRules;
  }
  if (req.body.isCreated !== "1") {
    if (!checkFrule && !tempCheckFrule) {
      const {
        ruleId,
        deviceId,
        rtype,
        action,
        disabled,
        quick,
        interface,
        direction,
        addressFamily,
        protocol,
        icmpSubtypes,
        sInvertMatch,
        sAny,
        sAddress,
        sPort,
        sprFrom,
        sprFromCustom,
        sprTo,
        sprToCustom,
        dInvertMatch,
        dAny,
        dAddress,
        dPort,
        dptFrom,
        dptFromCustom,
        dptTo,
        dptToCustom,
        log,
        description,
        sourceOs,
        diffservCodePoint,
        allowIpOptions,
        disableReplyTo,
        tag,
        tInvert,
        tagged,
        maxState,
        maxSrcNodes,
        maxConnections,
        maxSrcStates,
        maxSrcConnRate,
        maxSrcConnRateS,
        stateTimeout,
        setFin,
        setSyn,
        setRst,
        setPsh,
        setAck,
        setUrg,
        setEce,
        setCwr,
        outofFin,
        outofSyn,
        outofRst,
        outofPsh,
        outofAck,
        outofUrg,
        outofEce,
        outofCwr,
        tcpAnyFlag,
        noPfsync,
        stateType,
        noXmlrpcSync,
        vlanPrio,
        vlanPrioSet,
        gateway,
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
          if (rtype === "FLOATING") {
            await driver.get(
              `http://${device.ipAddress}/firewall_rules_edit.php?if=FloatingRules`
            );
            driver
              .findElement(
                By.xpath(`//*[@id="type"]/option[text()='${action}']`)
              )
              .click();
            if (disabled === true) {
              await driver.findElement(By.xpath(`//*[@id="disabled"]`)).click();
            }
            if (quick === true) {
              await driver.findElement(By.xpath(`//*[@id="quick"]`)).click();
            }
            await interface.map((test) => {
              var elementInterface = driver.findElement(
                By.xpath(`//*[@id="interface[]"]/option[text()='${test}']`)
              );
              driver.executeScript(
                "arguments[0].scrollIntoView(true);",
                elementInterface
              );
              driver
                .actions()
                .keyDown(Key.CONTROL)
                .click(elementInterface)
                .keyUp(Key.CONTROL)
                .perform();
            });
            driver
              .findElement(
                By.xpath(`//*[@id="direction"]/option[text()='${direction}']`)
              )
              .click();
            driver
              .findElement(
                By.xpath(
                  `//*[@id="ipprotocol"]/option[text()='${addressFamily}']`
                )
              )
              .click();
            driver
              .findElement(
                By.xpath(`//*[@id="proto"]/option[text()='${protocol}']`)
              )
              .click();
            if (protocol === "ICMP") {
              await driver.wait(
                until.elementLocated(By.xpath(`//*[@id="icmptype[]"]`), 100000)
              );
              await driver.wait(
                until.elementIsVisible(
                  driver.findElement(By.xpath(`//*[@id="icmptype[]"]`)),
                  100000
                )
              );
              var copyOfIcmp = [...icmpSubtypes];
              if (copyOfIcmp.includes("any") === false) {
                var elementIcmp = driver.findElement(
                  By.xpath(`//*[@id="icmptype[]"]/option[text()='any']`)
                );
                await driver.executeScript(
                  "arguments[0].scrollIntoView(true);",
                  elementIcmp
                );
                await driver
                  .actions()
                  .keyDown(Key.CONTROL)
                  .click(elementIcmp)
                  .keyUp(Key.CONTROL)
                  .perform();
              }
              await icmpSubtypes.map((test) => {
                if (test === "any") {
                } else {
                  var elementIcmp2 = driver.findElement(
                    By.xpath(`//*[@id="icmptype[]"]/option[text()='${test}']`)
                  );
                  driver.executeScript(
                    "arguments[0].scrollIntoView(true);",
                    elementIcmp2
                  );
                  driver
                    .actions()
                    .keyDown(Key.CONTROL)
                    .click(elementIcmp2)
                    .keyUp(Key.CONTROL)
                    .perform();
                }
              });
            }

            if (sInvertMatch === true) {
              await driver.findElement(By.xpath(`//*[@id="srcnot"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="srctype"]/option[text()='${sAny}']`)
              )
              .click();
            if (sAny === "Single host or alias" || sAny === "Network") {
              await driver.findElement(By.xpath(`//*[@id="src"]`)).clear();
              await driver
                .findElement(By.xpath(`//*[@id="src"]`))
                .sendKeys(sAddress);
            }
            if (sAny === "Network") {
              driver
                .findElement(
                  By.xpath(`//*[@id="srcmask"]/option[text()='${sPort}']`)
                )
                .click();
            }
            if (
              protocol === "TCP" ||
              protocol === "UDP" ||
              protocol === "TCP/UDP"
            ) {
              if (
                !(await driver
                  .findElement(By.xpath(`//*[@id="srcbeginport"]`))
                  .isDisplayed())
              ) {
                await driver
                  .findElement(By.xpath(`//*[@id="btnsrctoggle"]`))
                  .click();
              }
              driver
                .findElement(
                  By.xpath(
                    `//*[@id="srcbeginport"]/option[text()='${sprFrom}']`
                  )
                )
                .click();
              if (sprFrom === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="srcbeginport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="srcbeginport_cust"]`))
                  .sendKeys(sprFromCustom);
              }
              driver
                .findElement(
                  By.xpath(`//*[@id="srcendport"]/option[text()='${sprTo}']`)
                )
                .click();
              if (sprTo === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="srcendport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="srcendport_cust"]`))
                  .sendKeys(sprToCustom);
              }
            }

            if (dInvertMatch === true) {
              await driver.findElement(By.xpath(`//*[@id="dstnot"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="dsttype"]/option[text()='${dAny}']`)
              )
              .click();
            if (dAny === "Single host or alias" || dAny === "Network") {
              await driver.findElement(By.xpath(`//*[@id="dst"]`)).clear();
              await driver
                .findElement(By.xpath(`//*[@id="dst"]`))
                .sendKeys(dAddress);
            }
            if (dAny === "Network") {
              driver
                .findElement(
                  By.xpath(`//*[@id="dstmask"]/option[text()='${dPort}']`)
                )
                .click();
            }

            if (
              protocol === "TCP" ||
              protocol === "UDP" ||
              protocol === "TCP/UDP"
            ) {
              driver
                .findElement(
                  By.xpath(
                    `//*[@id="dstbeginport"]/option[text()='${dptFrom}']`
                  )
                )
                .click();
              if (dptFrom === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="dstbeginport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="dstbeginport_cust"]`))
                  .sendKeys(dptFromCustom);
              }
              driver
                .findElement(
                  By.xpath(`//*[@id="dstendport"]/option[text()='${dptTo}']`)
                )
                .click();
              if (dptTo === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="dstendport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="dstendport_cust"]`))
                  .sendKeys(dptToCustom);
              }
            }
            if (log === true) {
              await driver.findElement(By.xpath(`//*[@id="log"]`)).click();
            }
            await driver.findElement(By.xpath(`//*[@id="descr"]`)).clear();
            await driver
              .findElement(By.xpath(`//*[@id="descr"]`))
              .sendKeys(description);
            await driver.wait(
              until.elementIsVisible(
                driver.findElement(By.xpath(`//*[@id="btnadvopts"]`)),
                100000
              )
            );
            if (
              !(await driver
                .findElement(
                  By.xpath(`//*[@id="2"]/div[1]/form/div[5]/div[1]/h2`)
                )
                .isDisplayed())
            ) {
              await driver
                .findElement(By.xpath(`//*[@id="btnadvopts"]`))
                .click();
            }
            if (protocol === "TCP") {
              driver
                .findElement(
                  By.xpath(`//*[@id="os"]/option[text()='${sourceOs}']`)
                )
                .click();
            }
            if (diffservCodePoint === "") {
              driver.findElement(By.xpath(`//*[@id="dscp"]/option[1]`)).click();
            } else {
              driver
                .findElement(
                  By.xpath(
                    `//*[@id="dscp"]/option[text()='${diffservCodePoint}']`
                  )
                )
                .click();
            }
            if (allowIpOptions === true) {
              await driver
                .findElement(By.xpath(`//*[@id="allowopts"]`))
                .click();
            }
            if (disableReplyTo === true) {
              await driver
                .findElement(By.xpath(`//*[@id="disablereplyto"]`))
                .click();
            }
            await driver.wait(
              until.elementIsVisible(
                driver.findElement(By.xpath(`//*[@id="tag"]`)),
                100000
              )
            );
            await driver.findElement(By.xpath(`//*[@id="tag"]`)).clear();
            await driver.findElement(By.xpath(`//*[@id="tag"]`)).sendKeys(tag);
            if (tInvert === true) {
              await driver
                .findElement(By.xpath(`//*[@id="nottagged"]`))
                .click();
            }
            await driver.findElement(By.xpath(`//*[@id="tagged"]`)).clear();
            await driver
              .findElement(By.xpath(`//*[@id="tagged"]`))
              .sendKeys(tagged);
            await driver.findElement(By.xpath(`//*[@id="max"]`)).clear();
            await driver
              .findElement(By.xpath(`//*[@id="max"]`))
              .sendKeys(maxState);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-nodes"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-nodes"]`))
              .sendKeys(maxSrcNodes);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn"]`))
              .sendKeys(maxConnections);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-states"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-states"]`))
              .sendKeys(maxSrcStates);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rate"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rate"]`))
              .sendKeys(maxSrcConnRate);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rates"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rates"]`))
              .sendKeys(maxSrcConnRateS);
            await driver
              .findElement(By.xpath(`//*[@id="statetimeout"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="statetimeout"]`))
              .sendKeys(stateTimeout);
            if (tcpAnyFlag === true) {
              await driver
                .findElement(By.xpath(`//*[@id="tcpflags_any"]`))
                .click();
            } else {
              if (setFin === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[2]/input`))
                  .click();
              }
              if (setSyn === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[3]/input`))
                  .click();
              }
              if (setRst === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[4]/input`))
                  .click();
              }
              if (setPsh === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[5]/input`))
                  .click();
              }
              if (setAck === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[6]/input`))
                  .click();
              }
              if (setUrg === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[7]/input`))
                  .click();
              }
              if (setEce === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[8]/input`))
                  .click();
              }
              if (setCwr === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[9]/input`))
                  .click();
              }
              if (outofFin === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[2]/input`))
                  .click();
              }
              if (outofSyn === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[3]/input`))
                  .click();
              }
              if (outofRst === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[4]/input`))
                  .click();
              }
              if (outofPsh === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[5]/input`))
                  .click();
              }
              if (outofAck === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[6]/input`))
                  .click();
              }
              if (outofUrg === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[7]/input`))
                  .click();
              }
              if (outofEce === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[8]/input`))
                  .click();
              }
              if (outofCwr === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[9]/input`))
                  .click();
              }
            }
            if (noPfsync === true) {
              await driver.findElement(By.xpath(`//*[@id="nopfsync"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="statetype"]/option[text()='${stateType}']`)
              )
              .click();
            if (noXmlrpcSync === true) {
              await driver.findElement(By.xpath(`//*[@id="nosync"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="vlanprio"]/option[text()='${vlanPrio}']`)
              )
              .click();
            driver
              .findElement(
                By.xpath(
                  `//*[@id="vlanprioset"]/option[text()='${vlanPrioSet}']`
                )
              )
              .click();
            driver
              .findElement(By.xpath(`//*[@id="gateway"]/option[1]`))
              .click();
          } else if (rtype === "WAN") {
            await driver.get(
              `http://${device.ipAddress}/firewall_rules_edit.php?if=wan`
            );
            driver
              .findElement(
                By.xpath(`//*[@id="type"]/option[text()='${action}']`)
              )
              .click();
            if (disabled === true) {
              await driver.findElement(By.xpath(`//*[@id="disabled"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="interface"]/option[text()='${interface}']`)
              )
              .click();
            driver
              .findElement(
                By.xpath(
                  `//*[@id="ipprotocol"]/option[text()='${addressFamily}']`
                )
              )
              .click();
            driver
              .findElement(
                By.xpath(`//*[@id="proto"]/option[text()='${protocol}']`)
              )
              .click();
            if (protocol === "ICMP") {
              await driver.wait(
                until.elementLocated(By.xpath(`//*[@id="icmptype[]"]`), 100000)
              );
              await driver.wait(
                until.elementIsVisible(
                  driver.findElement(By.xpath(`//*[@id="icmptype[]"]`)),
                  100000
                )
              );
              var copyOfIcmp = [...icmpSubtypes];
              if (copyOfIcmp.includes("any") === false) {
                var elementIcmp = driver.findElement(
                  By.xpath(`//*[@id="icmptype[]"]/option[text()='any']`)
                );
                await driver.executeScript(
                  "arguments[0].scrollIntoView(true);",
                  elementIcmp
                );
                await driver
                  .actions()
                  .keyDown(Key.CONTROL)
                  .click(elementIcmp)
                  .keyUp(Key.CONTROL)
                  .perform();
              }
              await icmpSubtypes.map((test) => {
                if (test === "any") {
                } else {
                  var elementIcmp2 = driver.findElement(
                    By.xpath(`//*[@id="icmptype[]"]/option[text()='${test}']`)
                  );
                  driver.executeScript(
                    "arguments[0].scrollIntoView(true);",
                    elementIcmp2
                  );
                  driver
                    .actions()
                    .keyDown(Key.CONTROL)
                    .click(elementIcmp2)
                    .keyUp(Key.CONTROL)
                    .perform();
                }
              });
            }

            if (sInvertMatch === true) {
              await driver.findElement(By.xpath(`//*[@id="srcnot"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="srctype"]/option[text()='${sAny}']`)
              )
              .click();
            if (sAny === "Single host or alias" || sAny === "Network") {
              await driver.findElement(By.xpath(`//*[@id="src"]`)).clear();
              await driver
                .findElement(By.xpath(`//*[@id="src"]`))
                .sendKeys(sAddress);
            }
            if (sAny === "Network") {
              driver
                .findElement(
                  By.xpath(`//*[@id="srcmask"]/option[text()='${sPort}']`)
                )
                .click();
            }
            if (
              protocol === "TCP" ||
              protocol === "UDP" ||
              protocol === "TCP/UDP"
            ) {
              if (
                !(await driver
                  .findElement(By.xpath(`//*[@id="srcbeginport"]`))
                  .isDisplayed())
              ) {
                await driver
                  .findElement(By.xpath(`//*[@id="btnsrctoggle"]`))
                  .click();
              }
              driver
                .findElement(
                  By.xpath(
                    `//*[@id="srcbeginport"]/option[text()='${sprFrom}']`
                  )
                )
                .click();
              if (sprFrom === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="srcbeginport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="srcbeginport_cust"]`))
                  .sendKeys(sprFromCustom);
              }
              driver
                .findElement(
                  By.xpath(`//*[@id="srcendport"]/option[text()='${sprTo}']`)
                )
                .click();
              if (sprTo === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="srcendport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="srcendport_cust"]`))
                  .sendKeys(sprToCustom);
              }
            }

            if (dInvertMatch === true) {
              await driver.findElement(By.xpath(`//*[@id="dstnot"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="dsttype"]/option[text()='${dAny}']`)
              )
              .click();
            if (dAny === "Single host or alias" || dAny === "Network") {
              await driver.findElement(By.xpath(`//*[@id="dst"]`)).clear();
              await driver
                .findElement(By.xpath(`//*[@id="dst"]`))
                .sendKeys(dAddress);
            }
            if (dAny === "Network") {
              driver
                .findElement(
                  By.xpath(`//*[@id="dstmask"]/option[text()='${dPort}']`)
                )
                .click();
            }

            if (
              protocol === "TCP" ||
              protocol === "UDP" ||
              protocol === "TCP/UDP"
            ) {
              driver
                .findElement(
                  By.xpath(
                    `//*[@id="dstbeginport"]/option[text()='${dptFrom}']`
                  )
                )
                .click();
              if (dptFrom === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="dstbeginport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="dstbeginport_cust"]`))
                  .sendKeys(dptFromCustom);
              }
              driver
                .findElement(
                  By.xpath(`//*[@id="dstendport"]/option[text()='${dptTo}']`)
                )
                .click();
              if (dptTo === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="dstendport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="dstendport_cust"]`))
                  .sendKeys(dptToCustom);
              }
            }
            if (log === true) {
              await driver.findElement(By.xpath(`//*[@id="log"]`)).click();
            }
            await driver.findElement(By.xpath(`//*[@id="descr"]`)).clear();
            await driver
              .findElement(By.xpath(`//*[@id="descr"]`))
              .sendKeys(description);
            await driver.wait(
              until.elementIsVisible(
                driver.findElement(By.xpath(`//*[@id="btnadvopts"]`)),
                100000
              )
            );
            if (
              !(await driver
                .findElement(
                  By.xpath(`//*[@id="2"]/div[1]/form/div[5]/div[1]/h2`)
                )
                .isDisplayed())
            ) {
              await driver
                .findElement(By.xpath(`//*[@id="btnadvopts"]`))
                .click();
            }
            if (protocol === "TCP") {
              driver
                .findElement(
                  By.xpath(`//*[@id="os"]/option[text()='${sourceOs}']`)
                )
                .click();
            }
            if (diffservCodePoint === "") {
              driver.findElement(By.xpath(`//*[@id="dscp"]/option[1]`)).click();
            } else {
              driver
                .findElement(
                  By.xpath(
                    `//*[@id="dscp"]/option[text()='${diffservCodePoint}']`
                  )
                )
                .click();
            }
            if (allowIpOptions === true) {
              await driver
                .findElement(By.xpath(`//*[@id="allowopts"]`))
                .click();
            }
            if (disableReplyTo === true) {
              await driver
                .findElement(By.xpath(`//*[@id="disablereplyto"]`))
                .click();
            }
            await driver.wait(
              until.elementIsVisible(
                driver.findElement(By.xpath(`//*[@id="tag"]`)),
                100000
              )
            );
            await driver.findElement(By.xpath(`//*[@id="tag"]`)).clear();
            await driver.findElement(By.xpath(`//*[@id="tag"]`)).sendKeys(tag);
            if (tInvert === true) {
              await driver
                .findElement(By.xpath(`//*[@id="nottagged"]`))
                .click();
            }
            await driver.findElement(By.xpath(`//*[@id="tagged"]`)).clear();
            await driver
              .findElement(By.xpath(`//*[@id="tagged"]`))
              .sendKeys(tagged);
            await driver.findElement(By.xpath(`//*[@id="max"]`)).clear();
            await driver
              .findElement(By.xpath(`//*[@id="max"]`))
              .sendKeys(maxState);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-nodes"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-nodes"]`))
              .sendKeys(maxSrcNodes);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn"]`))
              .sendKeys(maxConnections);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-states"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-states"]`))
              .sendKeys(maxSrcStates);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rate"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rate"]`))
              .sendKeys(maxSrcConnRate);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rates"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rates"]`))
              .sendKeys(maxSrcConnRateS);
            await driver
              .findElement(By.xpath(`//*[@id="statetimeout"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="statetimeout"]`))
              .sendKeys(stateTimeout);
            if (tcpAnyFlag === true) {
              await driver
                .findElement(By.xpath(`//*[@id="tcpflags_any"]`))
                .click();
            } else {
              if (setFin === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[2]/input`))
                  .click();
              }
              if (setSyn === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[3]/input`))
                  .click();
              }
              if (setRst === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[4]/input`))
                  .click();
              }
              if (setPsh === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[5]/input`))
                  .click();
              }
              if (setAck === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[6]/input`))
                  .click();
              }
              if (setUrg === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[7]/input`))
                  .click();
              }
              if (setEce === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[8]/input`))
                  .click();
              }
              if (setCwr === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[9]/input`))
                  .click();
              }
              if (outofFin === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[2]/input`))
                  .click();
              }
              if (outofSyn === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[3]/input`))
                  .click();
              }
              if (outofRst === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[4]/input`))
                  .click();
              }
              if (outofPsh === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[5]/input`))
                  .click();
              }
              if (outofAck === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[6]/input`))
                  .click();
              }
              if (outofUrg === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[7]/input`))
                  .click();
              }
              if (outofEce === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[8]/input`))
                  .click();
              }
              if (outofCwr === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[9]/input`))
                  .click();
              }
            }
            if (noPfsync === true) {
              await driver.findElement(By.xpath(`//*[@id="nopfsync"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="statetype"]/option[text()='${stateType}']`)
              )
              .click();
            if (noXmlrpcSync === true) {
              await driver.findElement(By.xpath(`//*[@id="nosync"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="vlanprio"]/option[text()='${vlanPrio}']`)
              )
              .click();
            driver
              .findElement(
                By.xpath(
                  `//*[@id="vlanprioset"]/option[text()='${vlanPrioSet}']`
                )
              )
              .click();
            driver
              .findElement(By.xpath(`//*[@id="gateway"]/option[1]`))
              .click();
          } else if (rtype === "LAN") {
            await driver.get(
              `http://${device.ipAddress}/firewall_rules_edit.php?if=lan`
            );
            driver
              .findElement(
                By.xpath(`//*[@id="type"]/option[text()='${action}']`)
              )
              .click();
            if (disabled === true) {
              await driver.findElement(By.xpath(`//*[@id="disabled"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="interface"]/option[text()='${interface}']`)
              )
              .click();
            driver
              .findElement(
                By.xpath(
                  `//*[@id="ipprotocol"]/option[text()='${addressFamily}']`
                )
              )
              .click();
            driver
              .findElement(
                By.xpath(`//*[@id="proto"]/option[text()='${protocol}']`)
              )
              .click();
            if (protocol === "ICMP") {
              await driver.wait(
                until.elementLocated(By.xpath(`//*[@id="icmptype[]"]`), 100000)
              );
              await driver.wait(
                until.elementIsVisible(
                  driver.findElement(By.xpath(`//*[@id="icmptype[]"]`)),
                  100000
                )
              );
              var copyOfIcmp = [...icmpSubtypes];
              if (copyOfIcmp.includes("any") === false) {
                var elementIcmp = driver.findElement(
                  By.xpath(`//*[@id="icmptype[]"]/option[text()='any']`)
                );
                await driver.executeScript(
                  "arguments[0].scrollIntoView(true);",
                  elementIcmp
                );
                await driver
                  .actions()
                  .keyDown(Key.CONTROL)
                  .click(elementIcmp)
                  .keyUp(Key.CONTROL)
                  .perform();
              }
              await icmpSubtypes.map((test) => {
                if (test === "any") {
                } else {
                  var elementIcmp2 = driver.findElement(
                    By.xpath(`//*[@id="icmptype[]"]/option[text()='${test}']`)
                  );
                  driver.executeScript(
                    "arguments[0].scrollIntoView(true);",
                    elementIcmp2
                  );
                  driver
                    .actions()
                    .keyDown(Key.CONTROL)
                    .click(elementIcmp2)
                    .keyUp(Key.CONTROL)
                    .perform();
                }
              });
            }

            if (sInvertMatch === true) {
              await driver.findElement(By.xpath(`//*[@id="srcnot"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="srctype"]/option[text()='${sAny}']`)
              )
              .click();
            if (sAny === "Single host or alias" || sAny === "Network") {
              await driver.findElement(By.xpath(`//*[@id="src"]`)).clear();
              await driver
                .findElement(By.xpath(`//*[@id="src"]`))
                .sendKeys(sAddress);
            }
            if (sAny === "Network") {
              driver
                .findElement(
                  By.xpath(`//*[@id="srcmask"]/option[text()='${sPort}']`)
                )
                .click();
            }
            if (
              protocol === "TCP" ||
              protocol === "UDP" ||
              protocol === "TCP/UDP"
            ) {
              if (
                !(await driver
                  .findElement(By.xpath(`//*[@id="srcbeginport"]`))
                  .isDisplayed())
              ) {
                await driver
                  .findElement(By.xpath(`//*[@id="btnsrctoggle"]`))
                  .click();
              }
              driver
                .findElement(
                  By.xpath(
                    `//*[@id="srcbeginport"]/option[text()='${sprFrom}']`
                  )
                )
                .click();
              if (sprFrom === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="srcbeginport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="srcbeginport_cust"]`))
                  .sendKeys(sprFromCustom);
              }
              driver
                .findElement(
                  By.xpath(`//*[@id="srcendport"]/option[text()='${sprTo}']`)
                )
                .click();
              if (sprTo === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="srcendport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="srcendport_cust"]`))
                  .sendKeys(sprToCustom);
              }
            }

            if (dInvertMatch === true) {
              await driver.findElement(By.xpath(`//*[@id="dstnot"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="dsttype"]/option[text()='${dAny}']`)
              )
              .click();
            if (dAny === "Single host or alias" || dAny === "Network") {
              await driver.findElement(By.xpath(`//*[@id="dst"]`)).clear();
              await driver
                .findElement(By.xpath(`//*[@id="dst"]`))
                .sendKeys(dAddress);
            }
            if (dAny === "Network") {
              driver
                .findElement(
                  By.xpath(`//*[@id="dstmask"]/option[text()='${dPort}']`)
                )
                .click();
            }

            if (
              protocol === "TCP" ||
              protocol === "UDP" ||
              protocol === "TCP/UDP"
            ) {
              driver
                .findElement(
                  By.xpath(
                    `//*[@id="dstbeginport"]/option[text()='${dptFrom}']`
                  )
                )
                .click();
              if (dptFrom === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="dstbeginport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="dstbeginport_cust"]`))
                  .sendKeys(dptFromCustom);
              }
              driver
                .findElement(
                  By.xpath(`//*[@id="dstendport"]/option[text()='${dptTo}']`)
                )
                .click();
              if (dptTo === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="dstendport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="dstendport_cust"]`))
                  .sendKeys(dptToCustom);
              }
            }
            if (log === true) {
              await driver.findElement(By.xpath(`//*[@id="log"]`)).click();
            }
            await driver.findElement(By.xpath(`//*[@id="descr"]`)).clear();
            await driver
              .findElement(By.xpath(`//*[@id="descr"]`))
              .sendKeys(description);
            await driver.wait(
              until.elementIsVisible(
                driver.findElement(By.xpath(`//*[@id="btnadvopts"]`)),
                100000
              )
            );
            if (
              !(await driver
                .findElement(
                  By.xpath(`//*[@id="2"]/div[1]/form/div[5]/div[1]/h2`)
                )
                .isDisplayed())
            ) {
              await driver
                .findElement(By.xpath(`//*[@id="btnadvopts"]`))
                .click();
            }
            if (protocol === "TCP") {
              driver
                .findElement(
                  By.xpath(`//*[@id="os"]/option[text()='${sourceOs}']`)
                )
                .click();
            }
            if (diffservCodePoint === "") {
              driver.findElement(By.xpath(`//*[@id="dscp"]/option[1]`)).click();
            } else {
              driver
                .findElement(
                  By.xpath(
                    `//*[@id="dscp"]/option[text()='${diffservCodePoint}']`
                  )
                )
                .click();
            }
            if (allowIpOptions === true) {
              await driver
                .findElement(By.xpath(`//*[@id="allowopts"]`))
                .click();
            }
            if (disableReplyTo === true) {
              await driver
                .findElement(By.xpath(`//*[@id="disablereplyto"]`))
                .click();
            }
            await driver.wait(
              until.elementIsVisible(
                driver.findElement(By.xpath(`//*[@id="tag"]`)),
                100000
              )
            );
            await driver.findElement(By.xpath(`//*[@id="tag"]`)).clear();
            await driver.findElement(By.xpath(`//*[@id="tag"]`)).sendKeys(tag);
            if (tInvert === true) {
              await driver
                .findElement(By.xpath(`//*[@id="nottagged"]`))
                .click();
            }
            await driver.findElement(By.xpath(`//*[@id="tagged"]`)).clear();
            await driver
              .findElement(By.xpath(`//*[@id="tagged"]`))
              .sendKeys(tagged);
            await driver.findElement(By.xpath(`//*[@id="max"]`)).clear();
            await driver
              .findElement(By.xpath(`//*[@id="max"]`))
              .sendKeys(maxState);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-nodes"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-nodes"]`))
              .sendKeys(maxSrcNodes);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn"]`))
              .sendKeys(maxConnections);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-states"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-states"]`))
              .sendKeys(maxSrcStates);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rate"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rate"]`))
              .sendKeys(maxSrcConnRate);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rates"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rates"]`))
              .sendKeys(maxSrcConnRateS);
            await driver
              .findElement(By.xpath(`//*[@id="statetimeout"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="statetimeout"]`))
              .sendKeys(stateTimeout);
            if (tcpAnyFlag === true) {
              await driver
                .findElement(By.xpath(`//*[@id="tcpflags_any"]`))
                .click();
            } else {
              if (setFin === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[2]/input`))
                  .click();
              }
              if (setSyn === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[3]/input`))
                  .click();
              }
              if (setRst === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[4]/input`))
                  .click();
              }
              if (setPsh === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[5]/input`))
                  .click();
              }
              if (setAck === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[6]/input`))
                  .click();
              }
              if (setUrg === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[7]/input`))
                  .click();
              }
              if (setEce === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[8]/input`))
                  .click();
              }
              if (setCwr === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[9]/input`))
                  .click();
              }
              if (outofFin === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[2]/input`))
                  .click();
              }
              if (outofSyn === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[3]/input`))
                  .click();
              }
              if (outofRst === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[4]/input`))
                  .click();
              }
              if (outofPsh === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[5]/input`))
                  .click();
              }
              if (outofAck === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[6]/input`))
                  .click();
              }
              if (outofUrg === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[7]/input`))
                  .click();
              }
              if (outofEce === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[8]/input`))
                  .click();
              }
              if (outofCwr === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[9]/input`))
                  .click();
              }
            }
            if (noPfsync === true) {
              await driver.findElement(By.xpath(`//*[@id="nopfsync"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="statetype"]/option[text()='${stateType}']`)
              )
              .click();
            if (noXmlrpcSync === true) {
              await driver.findElement(By.xpath(`//*[@id="nosync"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="vlanprio"]/option[text()='${vlanPrio}']`)
              )
              .click();
            driver
              .findElement(
                By.xpath(
                  `//*[@id="vlanprioset"]/option[text()='${vlanPrioSet}']`
                )
              )
              .click();
            driver
              .findElement(By.xpath(`//*[@id="gateway"]/option[1]`))
              .click();
          }
        } finally {
          await driver.findElement(By.xpath(`//*[@id="save"]`)).click();
          mes = await driver
            .findElement(By.xpath(`/html/body/div[1]/div`))
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
      if (
        mes ===
        `The firewall rule configuration has been changed.
The changes must be applied for them to take effect.
Apply Changes`
      ) {
        const frule = await Frule.create({
          ruleId,
          deviceId,
          rtype,
          action,
          disabled,
          quick,
          interface,
          direction,
          addressFamily,
          protocol,
          icmpSubtypes,
          sInvertMatch,
          sAny,
          sAddress,
          sPort,
          sprFrom,
          sprFromCustom,
          sprTo,
          sprToCustom,
          dInvertMatch,
          dAny,
          dAddress,
          dPort,
          dptFrom,
          dptFromCustom,
          dptTo,
          dptToCustom,
          log,
          description,
          sourceOs,
          diffservCodePoint,
          allowIpOptions,
          disableReplyTo,
          tag,
          tInvert,
          tagged,
          maxState,
          maxSrcNodes,
          maxConnections,
          maxSrcStates,
          maxSrcConnRate,
          maxSrcConnRateS,
          stateTimeout,
          setFin,
          setSyn,
          setRst,
          setPsh,
          setAck,
          setUrg,
          setEce,
          setCwr,
          outofFin,
          outofSyn,
          outofRst,
          outofPsh,
          outofAck,
          outofUrg,
          outofEce,
          outofCwr,
          tcpAnyFlag,
          noPfsync,
          stateType,
          noXmlrpcSync,
          vlanPrio,
          vlanPrioSet,
          gateway,
          pfsenseId: pfId,
          pfsenseDeleteId: pfDelId,
          generatedByUserId,
        });
        totalRules = await Frule.countDocuments({
          deviceId: req.body.deviceId,
        });
        floatRules = await Frule.countDocuments({
          deviceId: req.body.deviceId,
          rtype: "FLOATING",
        });
        wanRules = await Frule.countDocuments({
          deviceId: req.body.deviceId,
          rtype: "WAN",
        });
        if (rtype === "FLOATING") {
          //loop after float
          const updPfWan = await Frule.find({
            deviceId: req.body.deviceId,
            rtype: "WAN",
          });
          updPfWan.map(async (test) => {
            const pfData = {
              pfsenseId: test.pfsenseId + 1,
            };
            await Frule.findOneAndUpdate({ ruleId: test.ruleId }, pfData, {
              new: true,
              runValidators: true,
              useFindAndModify: false,
            });
          });
          const updPfLan = await Frule.find({
            deviceId: req.body.deviceId,
            rtype: "LAN",
          });
          updPfLan.map(async (test) => {
            const pfData = {
              pfsenseId: test.pfsenseId + 1,
            };
            await Frule.findOneAndUpdate({ ruleId: test.ruleId }, pfData, {
              new: true,
              runValidators: true,
              useFindAndModify: false,
            });
          });
        } else if (rtype === "WAN") {
          //loop after wan
          const updPfLan = await Frule.find({
            deviceId: req.body.deviceId,
            rtype: "LAN",
          });
          updPfLan.map(async (test) => {
            const pfData = {
              pfsenseId: test.pfsenseId + 1,
            };
            await Frule.findOneAndUpdate({ ruleId: test.ruleId }, pfData, {
              new: true,
              runValidators: true,
              useFindAndModify: false,
            });
          });
        }
      }
    } else {
      mes = "Error: Duplicate Rule Id Entered";
    }
  } else {
    if (!checkFrule) {
      const {
        ruleId,
        deviceId,
        rtype,
        action,
        disabled,
        quick,
        interface,
        direction,
        addressFamily,
        protocol,
        icmpSubtypes,
        sInvertMatch,
        sAny,
        sAddress,
        sPort,
        sprFrom,
        sprFromCustom,
        sprTo,
        sprToCustom,
        dInvertMatch,
        dAny,
        dAddress,
        dPort,
        dptFrom,
        dptFromCustom,
        dptTo,
        dptToCustom,
        log,
        description,
        sourceOs,
        diffservCodePoint,
        allowIpOptions,
        disableReplyTo,
        tag,
        tInvert,
        tagged,
        maxState,
        maxSrcNodes,
        maxConnections,
        maxSrcStates,
        maxSrcConnRate,
        maxSrcConnRateS,
        stateTimeout,
        setFin,
        setSyn,
        setRst,
        setPsh,
        setAck,
        setUrg,
        setEce,
        setCwr,
        outofFin,
        outofSyn,
        outofRst,
        outofPsh,
        outofAck,
        outofUrg,
        outofEce,
        outofCwr,
        tcpAnyFlag,
        noPfsync,
        stateType,
        noXmlrpcSync,
        vlanPrio,
        vlanPrioSet,
        gateway,
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
          if (rtype === "FLOATING") {
            await driver.get(
              `http://${device.ipAddress}/firewall_rules_edit.php?if=FloatingRules`
            );
            driver
              .findElement(
                By.xpath(`//*[@id="type"]/option[text()='${action}']`)
              )
              .click();
            if (disabled === true) {
              await driver.findElement(By.xpath(`//*[@id="disabled"]`)).click();
            }
            if (quick === true) {
              await driver.findElement(By.xpath(`//*[@id="quick"]`)).click();
            }
            await interface.map((test) => {
              var elementInterface = driver.findElement(
                By.xpath(`//*[@id="interface[]"]/option[text()='${test}']`)
              );
              driver.executeScript(
                "arguments[0].scrollIntoView(true);",
                elementInterface
              );
              driver
                .actions()
                .keyDown(Key.CONTROL)
                .click(elementInterface)
                .keyUp(Key.CONTROL)
                .perform();
            });
            driver
              .findElement(
                By.xpath(`//*[@id="direction"]/option[text()='${direction}']`)
              )
              .click();
            driver
              .findElement(
                By.xpath(
                  `//*[@id="ipprotocol"]/option[text()='${addressFamily}']`
                )
              )
              .click();
            driver
              .findElement(
                By.xpath(`//*[@id="proto"]/option[text()='${protocol}']`)
              )
              .click();
            if (protocol === "ICMP") {
              await driver.wait(
                until.elementLocated(By.xpath(`//*[@id="icmptype[]"]`), 100000)
              );
              await driver.wait(
                until.elementIsVisible(
                  driver.findElement(By.xpath(`//*[@id="icmptype[]"]`)),
                  100000
                )
              );
              var copyOfIcmp = [...icmpSubtypes];
              if (copyOfIcmp.includes("any") === false) {
                var elementIcmp = driver.findElement(
                  By.xpath(`//*[@id="icmptype[]"]/option[text()='any']`)
                );
                await driver.executeScript(
                  "arguments[0].scrollIntoView(true);",
                  elementIcmp
                );
                await driver
                  .actions()
                  .keyDown(Key.CONTROL)
                  .click(elementIcmp)
                  .keyUp(Key.CONTROL)
                  .perform();
              }
              await icmpSubtypes.map((test) => {
                if (test === "any") {
                } else {
                  var elementIcmp2 = driver.findElement(
                    By.xpath(`//*[@id="icmptype[]"]/option[text()='${test}']`)
                  );
                  driver.executeScript(
                    "arguments[0].scrollIntoView(true);",
                    elementIcmp2
                  );
                  driver
                    .actions()
                    .keyDown(Key.CONTROL)
                    .click(elementIcmp2)
                    .keyUp(Key.CONTROL)
                    .perform();
                }
              });
            }

            if (sInvertMatch === true) {
              await driver.findElement(By.xpath(`//*[@id="srcnot"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="srctype"]/option[text()='${sAny}']`)
              )
              .click();
            if (sAny === "Single host or alias" || sAny === "Network") {
              await driver.findElement(By.xpath(`//*[@id="src"]`)).clear();
              await driver
                .findElement(By.xpath(`//*[@id="src"]`))
                .sendKeys(sAddress);
            }
            if (sAny === "Network") {
              driver
                .findElement(
                  By.xpath(`//*[@id="srcmask"]/option[text()='${sPort}']`)
                )
                .click();
            }
            if (
              protocol === "TCP" ||
              protocol === "UDP" ||
              protocol === "TCP/UDP"
            ) {
              if (
                !(await driver
                  .findElement(By.xpath(`//*[@id="srcbeginport"]`))
                  .isDisplayed())
              ) {
                await driver
                  .findElement(By.xpath(`//*[@id="btnsrctoggle"]`))
                  .click();
              }
              driver
                .findElement(
                  By.xpath(
                    `//*[@id="srcbeginport"]/option[text()='${sprFrom}']`
                  )
                )
                .click();
              if (sprFrom === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="srcbeginport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="srcbeginport_cust"]`))
                  .sendKeys(sprFromCustom);
              }
              driver
                .findElement(
                  By.xpath(`//*[@id="srcendport"]/option[text()='${sprTo}']`)
                )
                .click();
              if (sprTo === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="srcendport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="srcendport_cust"]`))
                  .sendKeys(sprToCustom);
              }
            }

            if (dInvertMatch === true) {
              await driver.findElement(By.xpath(`//*[@id="dstnot"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="dsttype"]/option[text()='${dAny}']`)
              )
              .click();
            if (dAny === "Single host or alias" || dAny === "Network") {
              await driver.findElement(By.xpath(`//*[@id="dst"]`)).clear();
              await driver
                .findElement(By.xpath(`//*[@id="dst"]`))
                .sendKeys(dAddress);
            }
            if (dAny === "Network") {
              driver
                .findElement(
                  By.xpath(`//*[@id="dstmask"]/option[text()='${dPort}']`)
                )
                .click();
            }

            if (
              protocol === "TCP" ||
              protocol === "UDP" ||
              protocol === "TCP/UDP"
            ) {
              driver
                .findElement(
                  By.xpath(
                    `//*[@id="dstbeginport"]/option[text()='${dptFrom}']`
                  )
                )
                .click();
              if (dptFrom === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="dstbeginport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="dstbeginport_cust"]`))
                  .sendKeys(dptFromCustom);
              }
              driver
                .findElement(
                  By.xpath(`//*[@id="dstendport"]/option[text()='${dptTo}']`)
                )
                .click();
              if (dptTo === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="dstendport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="dstendport_cust"]`))
                  .sendKeys(dptToCustom);
              }
            }
            if (log === true) {
              await driver.findElement(By.xpath(`//*[@id="log"]`)).click();
            }
            await driver.findElement(By.xpath(`//*[@id="descr"]`)).clear();
            await driver
              .findElement(By.xpath(`//*[@id="descr"]`))
              .sendKeys(description);
            await driver.wait(
              until.elementIsVisible(
                driver.findElement(By.xpath(`//*[@id="btnadvopts"]`)),
                100000
              )
            );
            if (
              !(await driver
                .findElement(
                  By.xpath(`//*[@id="2"]/div[1]/form/div[5]/div[1]/h2`)
                )
                .isDisplayed())
            ) {
              await driver
                .findElement(By.xpath(`//*[@id="btnadvopts"]`))
                .click();
            }
            if (protocol === "TCP") {
              driver
                .findElement(
                  By.xpath(`//*[@id="os"]/option[text()='${sourceOs}']`)
                )
                .click();
            }
            if (diffservCodePoint === "") {
              driver.findElement(By.xpath(`//*[@id="dscp"]/option[1]`)).click();
            } else {
              driver
                .findElement(
                  By.xpath(
                    `//*[@id="dscp"]/option[text()='${diffservCodePoint}']`
                  )
                )
                .click();
            }
            if (allowIpOptions === true) {
              await driver
                .findElement(By.xpath(`//*[@id="allowopts"]`))
                .click();
            }
            if (disableReplyTo === true) {
              await driver
                .findElement(By.xpath(`//*[@id="disablereplyto"]`))
                .click();
            }
            await driver.wait(
              until.elementIsVisible(
                driver.findElement(By.xpath(`//*[@id="tag"]`)),
                100000
              )
            );
            await driver.findElement(By.xpath(`//*[@id="tag"]`)).clear();
            await driver.findElement(By.xpath(`//*[@id="tag"]`)).sendKeys(tag);
            if (tInvert === true) {
              await driver
                .findElement(By.xpath(`//*[@id="nottagged"]`))
                .click();
            }
            await driver.findElement(By.xpath(`//*[@id="tagged"]`)).clear();
            await driver
              .findElement(By.xpath(`//*[@id="tagged"]`))
              .sendKeys(tagged);
            await driver.findElement(By.xpath(`//*[@id="max"]`)).clear();
            await driver
              .findElement(By.xpath(`//*[@id="max"]`))
              .sendKeys(maxState);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-nodes"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-nodes"]`))
              .sendKeys(maxSrcNodes);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn"]`))
              .sendKeys(maxConnections);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-states"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-states"]`))
              .sendKeys(maxSrcStates);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rate"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rate"]`))
              .sendKeys(maxSrcConnRate);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rates"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rates"]`))
              .sendKeys(maxSrcConnRateS);
            await driver
              .findElement(By.xpath(`//*[@id="statetimeout"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="statetimeout"]`))
              .sendKeys(stateTimeout);
            if (tcpAnyFlag === true) {
              await driver
                .findElement(By.xpath(`//*[@id="tcpflags_any"]`))
                .click();
            } else {
              if (setFin === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[2]/input`))
                  .click();
              }
              if (setSyn === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[3]/input`))
                  .click();
              }
              if (setRst === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[4]/input`))
                  .click();
              }
              if (setPsh === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[5]/input`))
                  .click();
              }
              if (setAck === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[6]/input`))
                  .click();
              }
              if (setUrg === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[7]/input`))
                  .click();
              }
              if (setEce === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[8]/input`))
                  .click();
              }
              if (setCwr === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[9]/input`))
                  .click();
              }
              if (outofFin === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[2]/input`))
                  .click();
              }
              if (outofSyn === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[3]/input`))
                  .click();
              }
              if (outofRst === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[4]/input`))
                  .click();
              }
              if (outofPsh === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[5]/input`))
                  .click();
              }
              if (outofAck === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[6]/input`))
                  .click();
              }
              if (outofUrg === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[7]/input`))
                  .click();
              }
              if (outofEce === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[8]/input`))
                  .click();
              }
              if (outofCwr === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[9]/input`))
                  .click();
              }
            }
            if (noPfsync === true) {
              await driver.findElement(By.xpath(`//*[@id="nopfsync"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="statetype"]/option[text()='${stateType}']`)
              )
              .click();
            if (noXmlrpcSync === true) {
              await driver.findElement(By.xpath(`//*[@id="nosync"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="vlanprio"]/option[text()='${vlanPrio}']`)
              )
              .click();
            driver
              .findElement(
                By.xpath(
                  `//*[@id="vlanprioset"]/option[text()='${vlanPrioSet}']`
                )
              )
              .click();
            driver
              .findElement(By.xpath(`//*[@id="gateway"]/option[1]`))
              .click();
          } else if (rtype === "WAN") {
            await driver.get(
              `http://${device.ipAddress}/firewall_rules_edit.php?if=wan`
            );
            driver
              .findElement(
                By.xpath(`//*[@id="type"]/option[text()='${action}']`)
              )
              .click();
            if (disabled === true) {
              await driver.findElement(By.xpath(`//*[@id="disabled"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="interface"]/option[text()='${interface}']`)
              )
              .click();
            driver
              .findElement(
                By.xpath(
                  `//*[@id="ipprotocol"]/option[text()='${addressFamily}']`
                )
              )
              .click();
            driver
              .findElement(
                By.xpath(`//*[@id="proto"]/option[text()='${protocol}']`)
              )
              .click();
            if (protocol === "ICMP") {
              await driver.wait(
                until.elementLocated(By.xpath(`//*[@id="icmptype[]"]`), 100000)
              );
              await driver.wait(
                until.elementIsVisible(
                  driver.findElement(By.xpath(`//*[@id="icmptype[]"]`)),
                  100000
                )
              );
              var copyOfIcmp = [...icmpSubtypes];
              if (copyOfIcmp.includes("any") === false) {
                var elementIcmp = driver.findElement(
                  By.xpath(`//*[@id="icmptype[]"]/option[text()='any']`)
                );
                await driver.executeScript(
                  "arguments[0].scrollIntoView(true);",
                  elementIcmp
                );
                await driver
                  .actions()
                  .keyDown(Key.CONTROL)
                  .click(elementIcmp)
                  .keyUp(Key.CONTROL)
                  .perform();
              }
              await icmpSubtypes.map((test) => {
                if (test === "any") {
                } else {
                  var elementIcmp2 = driver.findElement(
                    By.xpath(`//*[@id="icmptype[]"]/option[text()='${test}']`)
                  );
                  driver.executeScript(
                    "arguments[0].scrollIntoView(true);",
                    elementIcmp2
                  );
                  driver
                    .actions()
                    .keyDown(Key.CONTROL)
                    .click(elementIcmp2)
                    .keyUp(Key.CONTROL)
                    .perform();
                }
              });
            }

            if (sInvertMatch === true) {
              await driver.findElement(By.xpath(`//*[@id="srcnot"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="srctype"]/option[text()='${sAny}']`)
              )
              .click();
            if (sAny === "Single host or alias" || sAny === "Network") {
              await driver.findElement(By.xpath(`//*[@id="src"]`)).clear();
              await driver
                .findElement(By.xpath(`//*[@id="src"]`))
                .sendKeys(sAddress);
            }
            if (sAny === "Network") {
              driver
                .findElement(
                  By.xpath(`//*[@id="srcmask"]/option[text()='${sPort}']`)
                )
                .click();
            }
            if (
              protocol === "TCP" ||
              protocol === "UDP" ||
              protocol === "TCP/UDP"
            ) {
              if (
                !(await driver
                  .findElement(By.xpath(`//*[@id="srcbeginport"]`))
                  .isDisplayed())
              ) {
                await driver
                  .findElement(By.xpath(`//*[@id="btnsrctoggle"]`))
                  .click();
              }
              driver
                .findElement(
                  By.xpath(
                    `//*[@id="srcbeginport"]/option[text()='${sprFrom}']`
                  )
                )
                .click();
              if (sprFrom === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="srcbeginport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="srcbeginport_cust"]`))
                  .sendKeys(sprFromCustom);
              }
              driver
                .findElement(
                  By.xpath(`//*[@id="srcendport"]/option[text()='${sprTo}']`)
                )
                .click();
              if (sprTo === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="srcendport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="srcendport_cust"]`))
                  .sendKeys(sprToCustom);
              }
            }

            if (dInvertMatch === true) {
              await driver.findElement(By.xpath(`//*[@id="dstnot"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="dsttype"]/option[text()='${dAny}']`)
              )
              .click();
            if (dAny === "Single host or alias" || dAny === "Network") {
              await driver.findElement(By.xpath(`//*[@id="dst"]`)).clear();
              await driver
                .findElement(By.xpath(`//*[@id="dst"]`))
                .sendKeys(dAddress);
            }
            if (dAny === "Network") {
              driver
                .findElement(
                  By.xpath(`//*[@id="dstmask"]/option[text()='${dPort}']`)
                )
                .click();
            }

            if (
              protocol === "TCP" ||
              protocol === "UDP" ||
              protocol === "TCP/UDP"
            ) {
              driver
                .findElement(
                  By.xpath(
                    `//*[@id="dstbeginport"]/option[text()='${dptFrom}']`
                  )
                )
                .click();
              if (dptFrom === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="dstbeginport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="dstbeginport_cust"]`))
                  .sendKeys(dptFromCustom);
              }
              driver
                .findElement(
                  By.xpath(`//*[@id="dstendport"]/option[text()='${dptTo}']`)
                )
                .click();
              if (dptTo === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="dstendport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="dstendport_cust"]`))
                  .sendKeys(dptToCustom);
              }
            }
            if (log === true) {
              await driver.findElement(By.xpath(`//*[@id="log"]`)).click();
            }
            await driver.findElement(By.xpath(`//*[@id="descr"]`)).clear();
            await driver
              .findElement(By.xpath(`//*[@id="descr"]`))
              .sendKeys(description);
            await driver.wait(
              until.elementIsVisible(
                driver.findElement(By.xpath(`//*[@id="btnadvopts"]`)),
                100000
              )
            );
            if (
              !(await driver
                .findElement(
                  By.xpath(`//*[@id="2"]/div[1]/form/div[5]/div[1]/h2`)
                )
                .isDisplayed())
            ) {
              await driver
                .findElement(By.xpath(`//*[@id="btnadvopts"]`))
                .click();
            }
            if (protocol === "TCP") {
              driver
                .findElement(
                  By.xpath(`//*[@id="os"]/option[text()='${sourceOs}']`)
                )
                .click();
            }
            if (diffservCodePoint === "") {
              driver.findElement(By.xpath(`//*[@id="dscp"]/option[1]`)).click();
            } else {
              driver
                .findElement(
                  By.xpath(
                    `//*[@id="dscp"]/option[text()='${diffservCodePoint}']`
                  )
                )
                .click();
            }
            if (allowIpOptions === true) {
              await driver
                .findElement(By.xpath(`//*[@id="allowopts"]`))
                .click();
            }
            if (disableReplyTo === true) {
              await driver
                .findElement(By.xpath(`//*[@id="disablereplyto"]`))
                .click();
            }
            await driver.wait(
              until.elementIsVisible(
                driver.findElement(By.xpath(`//*[@id="tag"]`)),
                100000
              )
            );
            await driver.findElement(By.xpath(`//*[@id="tag"]`)).clear();
            await driver.findElement(By.xpath(`//*[@id="tag"]`)).sendKeys(tag);
            if (tInvert === true) {
              await driver
                .findElement(By.xpath(`//*[@id="nottagged"]`))
                .click();
            }
            await driver.findElement(By.xpath(`//*[@id="tagged"]`)).clear();
            await driver
              .findElement(By.xpath(`//*[@id="tagged"]`))
              .sendKeys(tagged);
            await driver.findElement(By.xpath(`//*[@id="max"]`)).clear();
            await driver
              .findElement(By.xpath(`//*[@id="max"]`))
              .sendKeys(maxState);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-nodes"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-nodes"]`))
              .sendKeys(maxSrcNodes);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn"]`))
              .sendKeys(maxConnections);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-states"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-states"]`))
              .sendKeys(maxSrcStates);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rate"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rate"]`))
              .sendKeys(maxSrcConnRate);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rates"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rates"]`))
              .sendKeys(maxSrcConnRateS);
            await driver
              .findElement(By.xpath(`//*[@id="statetimeout"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="statetimeout"]`))
              .sendKeys(stateTimeout);
            if (tcpAnyFlag === true) {
              await driver
                .findElement(By.xpath(`//*[@id="tcpflags_any"]`))
                .click();
            } else {
              if (setFin === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[2]/input`))
                  .click();
              }
              if (setSyn === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[3]/input`))
                  .click();
              }
              if (setRst === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[4]/input`))
                  .click();
              }
              if (setPsh === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[5]/input`))
                  .click();
              }
              if (setAck === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[6]/input`))
                  .click();
              }
              if (setUrg === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[7]/input`))
                  .click();
              }
              if (setEce === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[8]/input`))
                  .click();
              }
              if (setCwr === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[9]/input`))
                  .click();
              }
              if (outofFin === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[2]/input`))
                  .click();
              }
              if (outofSyn === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[3]/input`))
                  .click();
              }
              if (outofRst === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[4]/input`))
                  .click();
              }
              if (outofPsh === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[5]/input`))
                  .click();
              }
              if (outofAck === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[6]/input`))
                  .click();
              }
              if (outofUrg === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[7]/input`))
                  .click();
              }
              if (outofEce === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[8]/input`))
                  .click();
              }
              if (outofCwr === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[9]/input`))
                  .click();
              }
            }
            if (noPfsync === true) {
              await driver.findElement(By.xpath(`//*[@id="nopfsync"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="statetype"]/option[text()='${stateType}']`)
              )
              .click();
            if (noXmlrpcSync === true) {
              await driver.findElement(By.xpath(`//*[@id="nosync"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="vlanprio"]/option[text()='${vlanPrio}']`)
              )
              .click();
            driver
              .findElement(
                By.xpath(
                  `//*[@id="vlanprioset"]/option[text()='${vlanPrioSet}']`
                )
              )
              .click();
            driver
              .findElement(By.xpath(`//*[@id="gateway"]/option[1]`))
              .click();
          } else if (rtype === "LAN") {
            await driver.get(
              `http://${device.ipAddress}/firewall_rules_edit.php?if=lan`
            );
            driver
              .findElement(
                By.xpath(`//*[@id="type"]/option[text()='${action}']`)
              )
              .click();
            if (disabled === true) {
              await driver.findElement(By.xpath(`//*[@id="disabled"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="interface"]/option[text()='${interface}']`)
              )
              .click();
            driver
              .findElement(
                By.xpath(
                  `//*[@id="ipprotocol"]/option[text()='${addressFamily}']`
                )
              )
              .click();
            driver
              .findElement(
                By.xpath(`//*[@id="proto"]/option[text()='${protocol}']`)
              )
              .click();
            if (protocol === "ICMP") {
              await driver.wait(
                until.elementLocated(By.xpath(`//*[@id="icmptype[]"]`), 100000)
              );
              await driver.wait(
                until.elementIsVisible(
                  driver.findElement(By.xpath(`//*[@id="icmptype[]"]`)),
                  100000
                )
              );
              var copyOfIcmp = [...icmpSubtypes];
              if (copyOfIcmp.includes("any") === false) {
                var elementIcmp = driver.findElement(
                  By.xpath(`//*[@id="icmptype[]"]/option[text()='any']`)
                );
                await driver.executeScript(
                  "arguments[0].scrollIntoView(true);",
                  elementIcmp
                );
                await driver
                  .actions()
                  .keyDown(Key.CONTROL)
                  .click(elementIcmp)
                  .keyUp(Key.CONTROL)
                  .perform();
              }
              await icmpSubtypes.map((test) => {
                if (test === "any") {
                } else {
                  var elementIcmp2 = driver.findElement(
                    By.xpath(`//*[@id="icmptype[]"]/option[text()='${test}']`)
                  );
                  driver.executeScript(
                    "arguments[0].scrollIntoView(true);",
                    elementIcmp2
                  );
                  driver
                    .actions()
                    .keyDown(Key.CONTROL)
                    .click(elementIcmp2)
                    .keyUp(Key.CONTROL)
                    .perform();
                }
              });
            }

            if (sInvertMatch === true) {
              await driver.findElement(By.xpath(`//*[@id="srcnot"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="srctype"]/option[text()='${sAny}']`)
              )
              .click();
            if (sAny === "Single host or alias" || sAny === "Network") {
              await driver.findElement(By.xpath(`//*[@id="src"]`)).clear();
              await driver
                .findElement(By.xpath(`//*[@id="src"]`))
                .sendKeys(sAddress);
            }
            if (sAny === "Network") {
              driver
                .findElement(
                  By.xpath(`//*[@id="srcmask"]/option[text()='${sPort}']`)
                )
                .click();
            }
            if (
              protocol === "TCP" ||
              protocol === "UDP" ||
              protocol === "TCP/UDP"
            ) {
              if (
                !(await driver
                  .findElement(By.xpath(`//*[@id="srcbeginport"]`))
                  .isDisplayed())
              ) {
                await driver
                  .findElement(By.xpath(`//*[@id="btnsrctoggle"]`))
                  .click();
              }
              driver
                .findElement(
                  By.xpath(
                    `//*[@id="srcbeginport"]/option[text()='${sprFrom}']`
                  )
                )
                .click();
              if (sprFrom === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="srcbeginport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="srcbeginport_cust"]`))
                  .sendKeys(sprFromCustom);
              }
              driver
                .findElement(
                  By.xpath(`//*[@id="srcendport"]/option[text()='${sprTo}']`)
                )
                .click();
              if (sprTo === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="srcendport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="srcendport_cust"]`))
                  .sendKeys(sprToCustom);
              }
            }

            if (dInvertMatch === true) {
              await driver.findElement(By.xpath(`//*[@id="dstnot"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="dsttype"]/option[text()='${dAny}']`)
              )
              .click();
            if (dAny === "Single host or alias" || dAny === "Network") {
              await driver.findElement(By.xpath(`//*[@id="dst"]`)).clear();
              await driver
                .findElement(By.xpath(`//*[@id="dst"]`))
                .sendKeys(dAddress);
            }
            if (dAny === "Network") {
              driver
                .findElement(
                  By.xpath(`//*[@id="dstmask"]/option[text()='${dPort}']`)
                )
                .click();
            }

            if (
              protocol === "TCP" ||
              protocol === "UDP" ||
              protocol === "TCP/UDP"
            ) {
              driver
                .findElement(
                  By.xpath(
                    `//*[@id="dstbeginport"]/option[text()='${dptFrom}']`
                  )
                )
                .click();
              if (dptFrom === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="dstbeginport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="dstbeginport_cust"]`))
                  .sendKeys(dptFromCustom);
              }
              driver
                .findElement(
                  By.xpath(`//*[@id="dstendport"]/option[text()='${dptTo}']`)
                )
                .click();
              if (dptTo === "(other)") {
                await driver
                  .findElement(By.xpath(`//*[@id="dstendport_cust"]`))
                  .clear();
                await driver
                  .findElement(By.xpath(`//*[@id="dstendport_cust"]`))
                  .sendKeys(dptToCustom);
              }
            }
            if (log === true) {
              await driver.findElement(By.xpath(`//*[@id="log"]`)).click();
            }
            await driver.findElement(By.xpath(`//*[@id="descr"]`)).clear();
            await driver
              .findElement(By.xpath(`//*[@id="descr"]`))
              .sendKeys(description);
            await driver.wait(
              until.elementIsVisible(
                driver.findElement(By.xpath(`//*[@id="btnadvopts"]`)),
                100000
              )
            );
            if (
              !(await driver
                .findElement(
                  By.xpath(`//*[@id="2"]/div[1]/form/div[5]/div[1]/h2`)
                )
                .isDisplayed())
            ) {
              await driver
                .findElement(By.xpath(`//*[@id="btnadvopts"]`))
                .click();
            }
            if (protocol === "TCP") {
              driver
                .findElement(
                  By.xpath(`//*[@id="os"]/option[text()='${sourceOs}']`)
                )
                .click();
            }
            if (diffservCodePoint === "") {
              driver.findElement(By.xpath(`//*[@id="dscp"]/option[1]`)).click();
            } else {
              driver
                .findElement(
                  By.xpath(
                    `//*[@id="dscp"]/option[text()='${diffservCodePoint}']`
                  )
                )
                .click();
            }
            if (allowIpOptions === true) {
              await driver
                .findElement(By.xpath(`//*[@id="allowopts"]`))
                .click();
            }
            if (disableReplyTo === true) {
              await driver
                .findElement(By.xpath(`//*[@id="disablereplyto"]`))
                .click();
            }
            await driver.wait(
              until.elementIsVisible(
                driver.findElement(By.xpath(`//*[@id="tag"]`)),
                100000
              )
            );
            await driver.findElement(By.xpath(`//*[@id="tag"]`)).clear();
            await driver.findElement(By.xpath(`//*[@id="tag"]`)).sendKeys(tag);
            if (tInvert === true) {
              await driver
                .findElement(By.xpath(`//*[@id="nottagged"]`))
                .click();
            }
            await driver.findElement(By.xpath(`//*[@id="tagged"]`)).clear();
            await driver
              .findElement(By.xpath(`//*[@id="tagged"]`))
              .sendKeys(tagged);
            await driver.findElement(By.xpath(`//*[@id="max"]`)).clear();
            await driver
              .findElement(By.xpath(`//*[@id="max"]`))
              .sendKeys(maxState);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-nodes"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-nodes"]`))
              .sendKeys(maxSrcNodes);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn"]`))
              .sendKeys(maxConnections);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-states"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-states"]`))
              .sendKeys(maxSrcStates);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rate"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rate"]`))
              .sendKeys(maxSrcConnRate);
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rates"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="max-src-conn-rates"]`))
              .sendKeys(maxSrcConnRateS);
            await driver
              .findElement(By.xpath(`//*[@id="statetimeout"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="statetimeout"]`))
              .sendKeys(stateTimeout);
            if (tcpAnyFlag === true) {
              await driver
                .findElement(By.xpath(`//*[@id="tcpflags_any"]`))
                .click();
            } else {
              if (setFin === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[2]/input`))
                  .click();
              }
              if (setSyn === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[3]/input`))
                  .click();
              }
              if (setRst === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[4]/input`))
                  .click();
              }
              if (setPsh === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[5]/input`))
                  .click();
              }
              if (setAck === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[6]/input`))
                  .click();
              }
              if (setUrg === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[7]/input`))
                  .click();
              }
              if (setEce === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[8]/input`))
                  .click();
              }
              if (setCwr === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags1"]/td[9]/input`))
                  .click();
              }
              if (outofFin === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[2]/input`))
                  .click();
              }
              if (outofSyn === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[3]/input`))
                  .click();
              }
              if (outofRst === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[4]/input`))
                  .click();
              }
              if (outofPsh === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[5]/input`))
                  .click();
              }
              if (outofAck === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[6]/input`))
                  .click();
              }
              if (outofUrg === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[7]/input`))
                  .click();
              }
              if (outofEce === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[8]/input`))
                  .click();
              }
              if (outofCwr === true) {
                await driver
                  .findElement(By.xpath(`//*[@id="tcpflags2"]/td[9]/input`))
                  .click();
              }
            }
            if (noPfsync === true) {
              await driver.findElement(By.xpath(`//*[@id="nopfsync"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="statetype"]/option[text()='${stateType}']`)
              )
              .click();
            if (noXmlrpcSync === true) {
              await driver.findElement(By.xpath(`//*[@id="nosync"]`)).click();
            }
            driver
              .findElement(
                By.xpath(`//*[@id="vlanprio"]/option[text()='${vlanPrio}']`)
              )
              .click();
            driver
              .findElement(
                By.xpath(
                  `//*[@id="vlanprioset"]/option[text()='${vlanPrioSet}']`
                )
              )
              .click();
            driver
              .findElement(By.xpath(`//*[@id="gateway"]/option[1]`))
              .click();
          }
        } finally {
          await driver.findElement(By.xpath(`//*[@id="save"]`)).click();
          mes = await driver
            .findElement(By.xpath(`/html/body/div[1]/div`))
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
      if (
        mes ===
        `The firewall rule configuration has been changed.
The changes must be applied for them to take effect.
Apply Changes`
      ) {
        const frule = await Frule.create({
          ruleId,
          deviceId,
          rtype,
          action,
          disabled,
          quick,
          interface,
          direction,
          addressFamily,
          protocol,
          icmpSubtypes,
          sInvertMatch,
          sAny,
          sAddress,
          sPort,
          sprFrom,
          sprFromCustom,
          sprTo,
          sprToCustom,
          dInvertMatch,
          dAny,
          dAddress,
          dPort,
          dptFrom,
          dptFromCustom,
          dptTo,
          dptToCustom,
          log,
          description,
          sourceOs,
          diffservCodePoint,
          allowIpOptions,
          disableReplyTo,
          tag,
          tInvert,
          tagged,
          maxState,
          maxSrcNodes,
          maxConnections,
          maxSrcStates,
          maxSrcConnRate,
          maxSrcConnRateS,
          stateTimeout,
          setFin,
          setSyn,
          setRst,
          setPsh,
          setAck,
          setUrg,
          setEce,
          setCwr,
          outofFin,
          outofSyn,
          outofRst,
          outofPsh,
          outofAck,
          outofUrg,
          outofEce,
          outofCwr,
          tcpAnyFlag,
          noPfsync,
          stateType,
          noXmlrpcSync,
          vlanPrio,
          vlanPrioSet,
          gateway,
          pfsenseId: pfId,
          pfsenseDeleteId: pfDelId,
          generatedByUserId,
        });
        totalRules = await Frule.countDocuments({
          deviceId: req.body.deviceId,
        });
        floatRules = await Frule.countDocuments({
          deviceId: req.body.deviceId,
          rtype: "FLOATING",
        });
        wanRules = await Frule.countDocuments({
          deviceId: req.body.deviceId,
          rtype: "WAN",
        });

        if (rtype === "FLOATING") {
          //loop after float
          const updPfWan = await Frule.find({
            deviceId: req.body.deviceId,
            rtype: "WAN",
          });
          updPfWan.map((test) => {
            const pfData = {
              pfsenseId: test.pfsenseId + 1,
            };
            Frule.findOneAndUpdate({ ruleId: test.ruleId }, pfData, {
              new: true,
              runValidators: true,
              useFindAndModify: false,
            });
          });
          const updPfLan = await Frule.find({
            deviceId: req.body.deviceId,
            rtype: "LAN",
          });
          updPfLan.map((test) => {
            const pfData = {
              pfsenseId: test.pfsenseId + 1,
            };
            Frule.findOneAndUpdate({ ruleId: test.ruleId }, pfData, {
              new: true,
              runValidators: true,
              useFindAndModify: false,
            });
          });
        } else if (rtype === "WAN") {
          //loop after wan
          const updPfLan = await Frule.find({
            deviceId: req.body.deviceId,
            rtype: "LAN",
          });
          updPfLan.map((test) => {
            const pfData = {
              pfsenseId: test.pfsenseId + 1,
            };
            Frule.findOneAndUpdate({ ruleId: test.ruleId }, pfData, {
              new: true,
              runValidators: true,
              useFindAndModify: false,
            });
          });
        }
      }
    } else {
      mes = "Error: Duplicate Rule Id Entered";
    }
  }
  res.status(200).json({
    success: true,
    message: mes,
  });
});

// Get all frules(admin)
exports.getAllFrules = catchAsyncErrors(async (req, res, next) => {
  const frules = await Frule.find().sort({ pfsenseId: 1 });

  res.status(200).json({
    success: true,
    message: "Firewall rules fetched successfully",
    frules,
  });
});

// Get single frule (admin)
exports.getSingleFrule = catchAsyncErrors(async (req, res, next) => {
  const frule = await Frule.findOne({ ruleId: req.params.ruleId });

  if (!frule) {
    return next(
      new ErrorHander(
        `Firewall rule does not exist with Rule Id : ${req.params.ruleId}`,
        400
      )
    );
  }

  res.status(200).json({
    success: true,
    frule,
  });
});

// update Frule  -- Admin
exports.updateFrule = catchAsyncErrors(async (req, res, next) => {
  let mes = "NILL";
  let newFruleData = {
    action: req.body.action,
    disabled: req.body.disabled,
    quick: req.body.quick,
    interface: req.body.interface,
    direction: req.body.direction,
    addressFamily: req.body.addressFamily,
    protocol: req.body.protocol,
    icmpSubtypes: req.body.icmpSubtypes,
    sInvertMatch: req.body.sInvertMatch,
    sAny: req.body.sAny,
    sAddress: req.body.sAddress,
    sPort: req.body.sPort,
    sprFrom: req.body.sprFrom,
    sprFromCustom: req.body.sprFromCustom,
    sprTo: req.body.sprTo,
    sprToCustom: req.body.sprToCustom,
    dInvertMatch: req.body.dInvertMatch,
    dAny: req.body.dAny,
    dAddress: req.body.dAddress,
    dPort: req.body.dPort,
    dptFrom: req.body.dptFrom,
    dptFromCustom: req.body.dptFromCustom,
    dptTo: req.body.dptTo,
    dptToCustom: req.body.dptToCustom,
    log: req.body.log,
    description: req.body.description,
    sourceOs: req.body.sourceOs,
    diffservCodePoint: req.body.diffservCodePoint,
    allowIpOptions: req.body.allowIpOptions,
    disableReplyTo: req.body.disableReplyTo,
    tag: req.body.tag,
    tInvert: req.body.tInvert,
    tagged: req.body.tagged,
    maxState: req.body.maxState,
    maxSrcNodes: req.body.maxSrcNodes,
    maxConnections: req.body.maxConnections,
    maxSrcStates: req.body.maxSrcStates,
    maxSrcConnRate: req.body.maxSrcConnRate,
    maxSrcConnRateS: req.body.maxSrcConnRateS,
    stateTimeout: req.body.stateTimeout,
    setFin: req.body.setFin,
    setSyn: req.body.setSyn,
    setRst: req.body.setRst,
    setPsh: req.body.setPsh,
    setAck: req.body.setAck,
    setUrg: req.body.setUrg,
    setEce: req.body.setEce,
    setCwr: req.body.setcwr,
    outofFin: req.body.outofFin,
    outofSyn: req.body.outofSyn,
    outofRst: req.body.outofRst,
    outofPsh: req.body.outofPsh,
    outofAck: req.body.outofAck,
    outofUrg: req.body.outofUrg,
    outofEce: req.body.outofEce,
    outofCwr: req.body.outofCwr,
    tcpAnyFlag: req.body.tcpAnyFlag,
    noPfsync: req.body.noPfsync,
    stateType: req.body.stateType,
    noXmlrpcSync: req.body.noXmlrpcSync,
    vlanPrio: req.body.vlanPrio,
    vlanPrioSet: req.body.vlanPrioSet,
    gateway: req.body.gateway,
  };
  const {
    action,
    disabled,
    quick,
    interface,
    direction,
    addressFamily,
    protocol,
    icmpSubtypes,
    sInvertMatch,
    sAny,
    sAddress,
    sPort,
    sprFrom,
    sprFromCustom,
    sprTo,
    sprToCustom,
    dInvertMatch,
    dAny,
    dAddress,
    dPort,
    dptFrom,
    dptFromCustom,
    dptTo,
    dptToCustom,
    log,
    description,
    sourceOs,
    diffservCodePoint,
    allowIpOptions,
    disableReplyTo,
    tag,
    tInvert,
    tagged,
    maxState,
    maxSrcNodes,
    maxConnections,
    maxSrcStates,
    maxSrcConnRate,
    maxSrcConnRateS,
    stateTimeout,
    setFin,
    setSyn,
    setRst,
    setPsh,
    setAck,
    setUrg,
    setEce,
    setCwr,
    outofFin,
    outofSyn,
    outofRst,
    outofPsh,
    outofAck,
    outofUrg,
    outofEce,
    outofCwr,
    tcpAnyFlag,
    noPfsync,
    stateType,
    noXmlrpcSync,
    vlanPrio,
    vlanPrioSet,
    gateway,
  } = req.body;
  const frule = await Frule.findOne({ ruleId: req.params.ruleId });
  if (!frule) {
    return next(
      new ErrorHander(
        `Firewall rule does not exist with Rule Id : ${req.params.ruleId}`,
        400
      )
    );
  }
  const device = await Device.findOne({ ipAddress: frule.deviceId });
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
      if (frule.rtype === "FLOATING") {
        await driver.get(
          `http://${device.ipAddress}/firewall_rules_edit.php?id=${frule.pfsenseId}`
        );
        driver
          .findElement(By.xpath(`//*[@id="type"]/option[text()='${action}']`))
          .click();
        if (
          disabled === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="disabled"]`))
            .isSelected()) == false
        ) {
          console.log("if disable");
          await driver.findElement(By.xpath(`//*[@id="disabled"]`)).click();
        } else if (
          disabled === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="disabled"]`))
            .isSelected()) == true
        ) {
          console.log("else if disable");
          await driver.findElement(By.xpath(`//*[@id="disabled"]`)).click();
        }

        if (
          quick === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="quick"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="quick"]`)).click();
        } else if (
          quick === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="quick"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(`//*[@id="quick"]`)).click();
        }
        await frule.interface.map((test) => {
          var elementInterface = driver.findElement(
            By.xpath(`//*[@id="interface[]"]/option[text()='${test}']`)
          );
          driver.executeScript(
            "arguments[0].scrollIntoView(true);",
            elementInterface
          );
          driver
            .actions()
            .keyDown(Key.CONTROL)
            .click(elementInterface)
            .keyUp(Key.CONTROL)
            .perform();
        });
        await interface.map((test) => {
          var elementInterface = driver.findElement(
            By.xpath(`//*[@id="interface[]"]/option[text()='${test}']`)
          );
          driver.executeScript(
            "arguments[0].scrollIntoView(true);",
            elementInterface
          );
          driver
            .actions()
            .keyDown(Key.CONTROL)
            .click(elementInterface)
            .keyUp(Key.CONTROL)
            .perform();
        });
        driver
          .findElement(
            By.xpath(`//*[@id="direction"]/option[text()='${direction}']`)
          )
          .click();
        driver
          .findElement(
            By.xpath(`//*[@id="ipprotocol"]/option[text()='${addressFamily}']`)
          )
          .click();
        driver
          .findElement(
            By.xpath(`//*[@id="proto"]/option[text()='${protocol}']`)
          )
          .click();
        if (protocol === "ICMP") {
          await driver.wait(
            until.elementLocated(By.xpath(`//*[@id="icmptype[]"]`), 100000)
          );
          await driver.wait(
            until.elementIsVisible(
              driver.findElement(By.xpath(`//*[@id="icmptype[]"]`)),
              100000
            )
          );
          await frule.icmpSubtypes.map((test) => {
            console.log("running 1");
            var elementIcmp2 = driver.findElement(
              By.xpath(`//*[@id="icmptype[]"]/option[text()='${test}']`)
            );
            driver.executeScript(
              "arguments[0].scrollIntoView(true);",
              elementIcmp2
            );
            driver
              .actions()
              .keyDown(Key.CONTROL)
              .click(elementIcmp2)
              .keyUp(Key.CONTROL)
              .perform();
          });
          if (Object.keys(frule.icmpSubtypes).length == 0) {
            console.log("running 2");
            var elementIcmp = driver.findElement(
              By.xpath(`//*[@id="icmptype[]"]/option[text()='any']`)
            );
            await driver.executeScript(
              "arguments[0].scrollIntoView(true);",
              elementIcmp
            );
            await driver
              .actions()
              .keyDown(Key.CONTROL)
              .click(elementIcmp)
              .keyUp(Key.CONTROL)
              .perform();
          }
          await icmpSubtypes.map((test) => {
            console.log("running 3");
            var elementIcmp2 = driver.findElement(
              By.xpath(`//*[@id="icmptype[]"]/option[text()='${test}']`)
            );
            driver.executeScript(
              "arguments[0].scrollIntoView(true);",
              elementIcmp2
            );
            driver
              .actions()
              .keyDown(Key.CONTROL)
              .click(elementIcmp2)
              .keyUp(Key.CONTROL)
              .perform();
          });
        } else {
          newFruleData.icmpSubtypes = [];
        }
        if (
          sInvertMatch === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="srcnot"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="srcnot"]`)).click();
        } else if (
          sInvertMatch === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="srcnot"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(`//*[@id="srcnot"]`)).click();
        }
        driver
          .findElement(By.xpath(`//*[@id="srctype"]/option[text()='${sAny}']`))
          .click();
        if (sAny === "Single host or alias" || sAny === "Network") {
          await driver.findElement(By.xpath(`//*[@id="src"]`)).clear();
          await driver
            .findElement(By.xpath(`//*[@id="src"]`))
            .sendKeys(sAddress);
        }
        if (sAny === "Network") {
          driver
            .findElement(
              By.xpath(`//*[@id="srcmask"]/option[text()='${sPort}']`)
            )
            .click();
        }
        if (
          protocol === "TCP" ||
          protocol === "UDP" ||
          protocol === "TCP/UDP"
        ) {
          if (
            !(await driver
              .findElement(By.xpath(`//*[@id="srcbeginport"]`))
              .isDisplayed())
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="btnsrctoggle"]`))
              .click();
          }
          driver
            .findElement(
              By.xpath(`//*[@id="srcbeginport"]/option[text()='${sprFrom}']`)
            )
            .click();
          if (sprFrom === "(other)") {
            await driver
              .findElement(By.xpath(`//*[@id="srcbeginport_cust"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="srcbeginport_cust"]`))
              .sendKeys(sprFromCustom);
          }
          driver
            .findElement(
              By.xpath(`//*[@id="srcendport"]/option[text()='${sprTo}']`)
            )
            .click();
          if (sprTo === "(other)") {
            await driver
              .findElement(By.xpath(`//*[@id="srcendport_cust"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="srcendport_cust"]`))
              .sendKeys(sprToCustom);
          }
        }
        if (
          dInvertMatch === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="dstnot"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="dstnot"]`)).click();
        } else if (
          dInvertMatch === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="dstnot"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(`//*[@id="dstnot"]`)).click();
        }
        driver
          .findElement(By.xpath(`//*[@id="dsttype"]/option[text()='${dAny}']`))
          .click();
        if (dAny === "Single host or alias" || dAny === "Network") {
          await driver.findElement(By.xpath(`//*[@id="dst"]`)).clear();
          await driver
            .findElement(By.xpath(`//*[@id="dst"]`))
            .sendKeys(dAddress);
        }
        if (dAny === "Network") {
          driver
            .findElement(
              By.xpath(`//*[@id="dstmask"]/option[text()='${dPort}']`)
            )
            .click();
        }

        if (
          protocol === "TCP" ||
          protocol === "UDP" ||
          protocol === "TCP/UDP"
        ) {
          driver
            .findElement(
              By.xpath(`//*[@id="dstbeginport"]/option[text()='${dptFrom}']`)
            )
            .click();
          if (dptFrom === "(other)") {
            await driver
              .findElement(By.xpath(`//*[@id="dstbeginport_cust"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="dstbeginport_cust"]`))
              .sendKeys(dptFromCustom);
          }
          driver
            .findElement(
              By.xpath(`//*[@id="dstendport"]/option[text()='${dptTo}']`)
            )
            .click();
          if (dptTo === "(other)") {
            await driver
              .findElement(By.xpath(`//*[@id="dstendport_cust"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="dstendport_cust"]`))
              .sendKeys(dptToCustom);
          }
        }
        if (
          log === true &&
          (await driver.findElement(By.xpath(`//*[@id="log"]`)).isSelected()) ==
            false
        ) {
          await driver.findElement(By.xpath(`//*[@id="log"]`)).click();
        } else if (
          log === false &&
          (await driver.findElement(By.xpath(`//*[@id="log"]`)).isSelected()) ==
            true
        ) {
          await driver.findElement(By.xpath(`//*[@id="log"]`)).click();
        }
        await driver.findElement(By.xpath(`//*[@id="descr"]`)).clear();
        await driver
          .findElement(By.xpath(`//*[@id="descr"]`))
          .sendKeys(description);
        await driver.wait(
          until.elementIsVisible(
            driver.findElement(By.xpath(`//*[@id="btnadvopts"]`)),
            100000
          )
        );
        if (
          !(await driver
            .findElement(By.xpath(`//*[@id="2"]/div[1]/form/div[5]/div[1]/h2`))
            .isDisplayed())
        ) {
          await driver.findElement(By.xpath(`//*[@id="btnadvopts"]`)).click();
        }
        if (protocol === "TCP") {
          driver
            .findElement(By.xpath(`//*[@id="os"]/option[text()='${sourceOs}']`))
            .click();
        }
        if (diffservCodePoint === "") {
          driver.findElement(By.xpath(`//*[@id="dscp"]/option[1]`)).click();
        } else {
          driver
            .findElement(
              By.xpath(`//*[@id="dscp"]/option[text()='${diffservCodePoint}']`)
            )
            .click();
        }
        if (
          allowIpOptions === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="allowopts"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="allowopts"]`)).click();
        } else if (
          allowIpOptions === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="allowopts"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(`//*[@id="allowopts"]`)).click();
        }
        if (
          disableReplyTo === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="disablereplyto"]`))
            .isSelected()) == false
        ) {
          await driver
            .findElement(By.xpath(`//*[@id="disablereplyto"]`))
            .click();
        } else if (
          disableReplyTo === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="disablereplyto"]`))
            .isSelected()) == true
        ) {
          await driver
            .findElement(By.xpath(`//*[@id="disablereplyto"]`))
            .click();
        }
        await driver.wait(
          until.elementIsVisible(
            driver.findElement(By.xpath(`//*[@id="tag"]`)),
            100000
          )
        );
        await driver.findElement(By.xpath(`//*[@id="tag"]`)).clear();
        await driver.findElement(By.xpath(`//*[@id="tag"]`)).sendKeys(tag);
        if (
          tInvert === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="nottagged"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="nottagged"]`)).click();
        } else if (
          tInvert === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="nottagged"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(`//*[@id="nottagged"]`)).click();
        }
        await driver.findElement(By.xpath(`//*[@id="tagged"]`)).clear();
        await driver
          .findElement(By.xpath(`//*[@id="tagged"]`))
          .sendKeys(tagged);
        await driver.findElement(By.xpath(`//*[@id="max"]`)).clear();
        await driver.findElement(By.xpath(`//*[@id="max"]`)).sendKeys(maxState);
        await driver.findElement(By.xpath(`//*[@id="max-src-nodes"]`)).clear();
        await driver
          .findElement(By.xpath(`//*[@id="max-src-nodes"]`))
          .sendKeys(maxSrcNodes);
        await driver.findElement(By.xpath(`//*[@id="max-src-conn"]`)).clear();
        await driver
          .findElement(By.xpath(`//*[@id="max-src-conn"]`))
          .sendKeys(maxConnections);
        await driver.findElement(By.xpath(`//*[@id="max-src-states"]`)).clear();
        await driver
          .findElement(By.xpath(`//*[@id="max-src-states"]`))
          .sendKeys(maxSrcStates);
        await driver
          .findElement(By.xpath(`//*[@id="max-src-conn-rate"]`))
          .clear();
        await driver
          .findElement(By.xpath(`//*[@id="max-src-conn-rate"]`))
          .sendKeys(maxSrcConnRate);
        await driver
          .findElement(By.xpath(`//*[@id="max-src-conn-rates"]`))
          .clear();
        await driver
          .findElement(By.xpath(`//*[@id="max-src-conn-rates"]`))
          .sendKeys(maxSrcConnRateS);
        await driver.findElement(By.xpath(`//*[@id="statetimeout"]`)).clear();
        await driver
          .findElement(By.xpath(`//*[@id="statetimeout"]`))
          .sendKeys(stateTimeout);
        if (
          tcpAnyFlag === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="tcpflags_any"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="tcpflags_any"]`)).click();
        } else if (
          tcpAnyFlag === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="tcpflags_any"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(`//*[@id="tcpflags_any"]`)).click();
        }
        if (
          (await driver
            .findElement(By.xpath(`//*[@id="tcpflags_any"]`))
            .isSelected()) == false
        ) {
          if (
            setFin === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[2]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[2]/input`))
              .click();
          } else if (
            setFin === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[2]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[2]/input`))
              .click();
          }
          if (
            setSyn === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[3]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[3]/input`))
              .click();
          } else if (
            setSyn === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[3]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[3]/input`))
              .click();
          }
          if (
            setRst === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[4]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[4]/input`))
              .click();
          } else if (
            setRst === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[4]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[4]/input`))
              .click();
          }
          if (
            setPsh === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[5]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[5]/input`))
              .click();
          } else if (
            setPsh === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[5]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[5]/input`))
              .click();
          }
          if (
            setAck === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[6]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[6]/input`))
              .click();
          } else if (
            setAck === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[6]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[6]/input`))
              .click();
          }
          if (
            setUrg === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[7]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[7]/input`))
              .click();
          } else if (
            setUrg === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[7]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[7]/input`))
              .click();
          }
          if (
            setEce === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[8]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[8]/input`))
              .click();
          } else if (
            setEce === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[8]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[8]/input`))
              .click();
          }
          if (
            setCwr === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[9]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[9]/input`))
              .click();
          } else if (
            setCwr === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[9]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[9]/input`))
              .click();
          }
          if (
            outofFin === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[2]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[2]/input`))
              .click();
          } else if (
            outofFin === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[2]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[2]/input`))
              .click();
          }
          if (
            outofSyn === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[3]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[3]/input`))
              .click();
          } else if (
            outofSyn === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[3]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[3]/input`))
              .click();
          }
          if (
            outofRst === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[4]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[4]/input`))
              .click();
          } else if (
            outofRst === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[4]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[4]/input`))
              .click();
          }
          if (
            outofPsh === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[5]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[5]/input`))
              .click();
          } else if (
            outofPsh === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[5]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[5]/input`))
              .click();
          }
          if (
            outofAck === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[6]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[6]/input`))
              .click();
          } else if (
            outofAck === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[6]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[6]/input`))
              .click();
          }
          if (
            outofUrg === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[7]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[7]/input`))
              .click();
          } else if (
            outofUrg === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[7]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[7]/input`))
              .click();
          }
          if (
            outofEce === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[8]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[8]/input`))
              .click();
          } else if (
            outofEce === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[8]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[8]/input`))
              .click();
          }
          if (
            outofCwr === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[9]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[9]/input`))
              .click();
          } else if (
            outofCwr === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[9]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[9]/input`))
              .click();
          }
        }
        if (
          noPfsync === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="nopfsync"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="nopfsync"]`)).click();
        } else if (
          noPfsync === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="nopfsync"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(`//*[@id="nopfsync"]`)).click();
        }
        driver
          .findElement(
            By.xpath(`//*[@id="statetype"]/option[text()='${stateType}']`)
          )
          .click();
        if (
          noXmlrpcSync === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="nosync"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="nosync"]`)).click();
        } else if (
          noXmlrpcSync === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="nosync"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(`//*[@id="nosync"]`)).click();
        }
        driver
          .findElement(
            By.xpath(`//*[@id="vlanprio"]/option[text()='${vlanPrio}']`)
          )
          .click();
        driver
          .findElement(
            By.xpath(`//*[@id="vlanprioset"]/option[text()='${vlanPrioSet}']`)
          )
          .click();
        driver.findElement(By.xpath(`//*[@id="gateway"]/option[1]`)).click();
      } else if (frule.rtype === "WAN") {
        await driver.get(
          `http://${device.ipAddress}/firewall_rules_edit.php?id=${frule.pfsenseId}`
        );
        driver
          .findElement(By.xpath(`//*[@id="type"]/option[text()='${action}']`))
          .click();
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
        driver
          .findElement(
            By.xpath(`//*[@id="interface"]/option[text()='${interface}']`)
          )
          .click();
        driver
          .findElement(
            By.xpath(`//*[@id="ipprotocol"]/option[text()='${addressFamily}']`)
          )
          .click();
        driver
          .findElement(
            By.xpath(`//*[@id="proto"]/option[text()='${protocol}']`)
          )
          .click();
        if (protocol === "ICMP") {
          await driver.wait(
            until.elementLocated(By.xpath(`//*[@id="icmptype[]"]`), 100000)
          );
          await driver.wait(
            until.elementIsVisible(
              driver.findElement(By.xpath(`//*[@id="icmptype[]"]`)),
              100000
            )
          );
          await frule.icmpSubtypes.map((test) => {
            console.log("running 1");
            var elementIcmp2 = driver.findElement(
              By.xpath(`//*[@id="icmptype[]"]/option[text()='${test}']`)
            );
            driver.executeScript(
              "arguments[0].scrollIntoView(true);",
              elementIcmp2
            );
            driver
              .actions()
              .keyDown(Key.CONTROL)
              .click(elementIcmp2)
              .keyUp(Key.CONTROL)
              .perform();
          });
          if (Object.keys(frule.icmpSubtypes).length == 0) {
            console.log("running 2");
            var elementIcmp = driver.findElement(
              By.xpath(`//*[@id="icmptype[]"]/option[text()='any']`)
            );
            await driver.executeScript(
              "arguments[0].scrollIntoView(true);",
              elementIcmp
            );
            await driver
              .actions()
              .keyDown(Key.CONTROL)
              .click(elementIcmp)
              .keyUp(Key.CONTROL)
              .perform();
          }
          await icmpSubtypes.map((test) => {
            console.log("running 3");
            var elementIcmp2 = driver.findElement(
              By.xpath(`//*[@id="icmptype[]"]/option[text()='${test}']`)
            );
            driver.executeScript(
              "arguments[0].scrollIntoView(true);",
              elementIcmp2
            );
            driver
              .actions()
              .keyDown(Key.CONTROL)
              .click(elementIcmp2)
              .keyUp(Key.CONTROL)
              .perform();
          });
        } else {
          newFruleData.icmpSubtypes = [];
        }
        if (
          sInvertMatch === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="srcnot"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="srcnot"]`)).click();
        } else if (
          sInvertMatch === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="srcnot"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(`//*[@id="srcnot"]`)).click();
        }
        driver
          .findElement(By.xpath(`//*[@id="srctype"]/option[text()='${sAny}']`))
          .click();
        if (sAny === "Single host or alias" || sAny === "Network") {
          await driver.findElement(By.xpath(`//*[@id="src"]`)).clear();
          await driver
            .findElement(By.xpath(`//*[@id="src"]`))
            .sendKeys(sAddress);
        }
        if (sAny === "Network") {
          driver
            .findElement(
              By.xpath(`//*[@id="srcmask"]/option[text()='${sPort}']`)
            )
            .click();
        }
        if (
          protocol === "TCP" ||
          protocol === "UDP" ||
          protocol === "TCP/UDP"
        ) {
          if (
            !(await driver
              .findElement(By.xpath(`//*[@id="srcbeginport"]`))
              .isDisplayed())
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="btnsrctoggle"]`))
              .click();
          }
          driver
            .findElement(
              By.xpath(`//*[@id="srcbeginport"]/option[text()='${sprFrom}']`)
            )
            .click();
          if (sprFrom === "(other)") {
            await driver
              .findElement(By.xpath(`//*[@id="srcbeginport_cust"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="srcbeginport_cust"]`))
              .sendKeys(sprFromCustom);
          }
          driver
            .findElement(
              By.xpath(`//*[@id="srcendport"]/option[text()='${sprTo}']`)
            )
            .click();
          if (sprTo === "(other)") {
            await driver
              .findElement(By.xpath(`//*[@id="srcendport_cust"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="srcendport_cust"]`))
              .sendKeys(sprToCustom);
          }
        }
        if (
          dInvertMatch === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="dstnot"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="dstnot"]`)).click();
        } else if (
          dInvertMatch === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="dstnot"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(``)).click();
        }
        driver
          .findElement(By.xpath(`//*[@id="dsttype"]/option[text()='${dAny}']`))
          .click();
        if (dAny === "Single host or alias" || dAny === "Network") {
          await driver.findElement(By.xpath(`//*[@id="dst"]`)).clear();
          await driver
            .findElement(By.xpath(`//*[@id="dst"]`))
            .sendKeys(dAddress);
        }
        if (dAny === "Network") {
          driver
            .findElement(
              By.xpath(`//*[@id="dstmask"]/option[text()='${dPort}']`)
            )
            .click();
        }

        if (
          protocol === "TCP" ||
          protocol === "UDP" ||
          protocol === "TCP/UDP"
        ) {
          driver
            .findElement(
              By.xpath(`//*[@id="dstbeginport"]/option[text()='${dptFrom}']`)
            )
            .click();
          if (dptFrom === "(other)") {
            await driver
              .findElement(By.xpath(`//*[@id="dstbeginport_cust"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="dstbeginport_cust"]`))
              .sendKeys(dptFromCustom);
          }
          driver
            .findElement(
              By.xpath(`//*[@id="dstendport"]/option[text()='${dptTo}']`)
            )
            .click();
          if (dptTo === "(other)") {
            await driver
              .findElement(By.xpath(`//*[@id="dstendport_cust"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="dstendport_cust"]`))
              .sendKeys(dptToCustom);
          }
        }
        if (
          log === true &&
          (await driver.findElement(By.xpath(`//*[@id="log"]`)).isSelected()) ==
            false
        ) {
          await driver.findElement(By.xpath(`//*[@id="log"]`)).click();
        } else if (
          log === false &&
          (await driver.findElement(By.xpath(`//*[@id="log"]`)).isSelected()) ==
            true
        ) {
          await driver.findElement(By.xpath(`//*[@id="log"]`)).click();
        }
        await driver.findElement(By.xpath(`//*[@id="descr"]`)).clear();
        await driver
          .findElement(By.xpath(`//*[@id="descr"]`))
          .sendKeys(description);
        await driver.wait(
          until.elementIsVisible(
            driver.findElement(By.xpath(`//*[@id="btnadvopts"]`)),
            100000
          )
        );
        if (
          !(await driver
            .findElement(By.xpath(`//*[@id="2"]/div[1]/form/div[5]/div[1]/h2`))
            .isDisplayed())
        ) {
          await driver.findElement(By.xpath(`//*[@id="btnadvopts"]`)).click();
        }
        if (protocol === "TCP") {
          driver
            .findElement(By.xpath(`//*[@id="os"]/option[text()='${sourceOs}']`))
            .click();
        }
        if (diffservCodePoint === "") {
          driver.findElement(By.xpath(`//*[@id="dscp"]/option[1]`)).click();
        } else {
          driver
            .findElement(
              By.xpath(`//*[@id="dscp"]/option[text()='${diffservCodePoint}']`)
            )
            .click();
        }
        if (
          allowIpOptions === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="allowopts"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="allowopts"]`)).click();
        } else if (
          allowIpOptions === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="allowopts"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(`//*[@id="allowopts"]`)).click();
        }
        if (
          disableReplyTo === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="disablereplyto"]`))
            .isSelected()) == false
        ) {
          await driver
            .findElement(By.xpath(`//*[@id="disablereplyto"]`))
            .click();
        } else if (
          disableReplyTo === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="disablereplyto"]`))
            .isSelected()) == true
        ) {
          await driver
            .findElement(By.xpath(`//*[@id="disablereplyto"]`))
            .click();
        }
        await driver.wait(
          until.elementIsVisible(
            driver.findElement(By.xpath(`//*[@id="tag"]`)),
            100000
          )
        );
        await driver.findElement(By.xpath(`//*[@id="tag"]`)).clear();
        await driver.findElement(By.xpath(`//*[@id="tag"]`)).sendKeys(tag);
        if (
          tInvert === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="nottagged"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="nottagged"]`)).click();
        } else if (
          tInvert === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="nottagged"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(`//*[@id="nottagged"]`)).click();
        }
        await driver.findElement(By.xpath(`//*[@id="tagged"]`)).clear();
        await driver
          .findElement(By.xpath(`//*[@id="tagged"]`))
          .sendKeys(tagged);
        await driver.findElement(By.xpath(`//*[@id="max"]`)).clear();
        await driver.findElement(By.xpath(`//*[@id="max"]`)).sendKeys(maxState);
        await driver.findElement(By.xpath(`//*[@id="max-src-nodes"]`)).clear();
        await driver
          .findElement(By.xpath(`//*[@id="max-src-nodes"]`))
          .sendKeys(maxSrcNodes);
        await driver.findElement(By.xpath(`//*[@id="max-src-conn"]`)).clear();
        await driver
          .findElement(By.xpath(`//*[@id="max-src-conn"]`))
          .sendKeys(maxConnections);
        await driver.findElement(By.xpath(`//*[@id="max-src-states"]`)).clear();
        await driver
          .findElement(By.xpath(`//*[@id="max-src-states"]`))
          .sendKeys(maxSrcStates);
        await driver
          .findElement(By.xpath(`//*[@id="max-src-conn-rate"]`))
          .clear();
        await driver
          .findElement(By.xpath(`//*[@id="max-src-conn-rate"]`))
          .sendKeys(maxSrcConnRate);
        await driver
          .findElement(By.xpath(`//*[@id="max-src-conn-rates"]`))
          .clear();
        await driver
          .findElement(By.xpath(`//*[@id="max-src-conn-rates"]`))
          .sendKeys(maxSrcConnRateS);
        await driver.findElement(By.xpath(`//*[@id="statetimeout"]`)).clear();
        await driver
          .findElement(By.xpath(`//*[@id="statetimeout"]`))
          .sendKeys(stateTimeout);
        if (
          tcpAnyFlag === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="tcpflags_any"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="tcpflags_any"]`)).click();
        } else if (
          tcpAnyFlag === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="tcpflags_any"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(`//*[@id="tcpflags_any"]`)).click();
        }
        if (
          (await driver
            .findElement(By.xpath(`//*[@id="tcpflags_any"]`))
            .isSelected()) == false
        ) {
          if (
            setFin === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[2]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[2]/input`))
              .click();
          } else if (
            setFin === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[2]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[2]/input`))
              .click();
          }
          if (
            setSyn === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[3]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[3]/input`))
              .click();
          } else if (
            setSyn === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[3]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[3]/input`))
              .click();
          }
          if (
            setRst === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[4]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[4]/input`))
              .click();
          } else if (
            setRst === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[4]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[4]/input`))
              .click();
          }
          if (
            setPsh === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[5]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[5]/input`))
              .click();
          } else if (
            setPsh === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[5]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[5]/input`))
              .click();
          }
          if (
            setAck === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[6]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[6]/input`))
              .click();
          } else if (
            setAck === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[6]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[6]/input`))
              .click();
          }
          if (
            setUrg === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[7]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[7]/input`))
              .click();
          } else if (
            setUrg === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[7]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[7]/input`))
              .click();
          }
          if (
            setEce === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[8]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[8]/input`))
              .click();
          } else if (
            setEce === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[8]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[8]/input`))
              .click();
          }
          if (
            setCwr === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[9]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[9]/input`))
              .click();
          } else if (
            setCwr === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[9]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[9]/input`))
              .click();
          }
          if (
            outofFin === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[2]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[2]/input`))
              .click();
          } else if (
            outofFin === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[2]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[2]/input`))
              .click();
          }
          if (
            outofSyn === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[3]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[3]/input`))
              .click();
          } else if (
            outofSyn === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[3]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[3]/input`))
              .click();
          }
          if (
            outofRst === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[4]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[4]/input`))
              .click();
          } else if (
            outofRst === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[4]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[4]/input`))
              .click();
          }
          if (
            outofPsh === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[5]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[5]/input`))
              .click();
          } else if (
            outofPsh === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[5]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[5]/input`))
              .click();
          }
          if (
            outofAck === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[6]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[6]/input`))
              .click();
          } else if (
            outofAck === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[6]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[6]/input`))
              .click();
          }
          if (
            outofUrg === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[7]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[7]/input`))
              .click();
          } else if (
            outofUrg === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[7]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[7]/input`))
              .click();
          }
          if (
            outofEce === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[8]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[8]/input`))
              .click();
          } else if (
            outofEce === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[8]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[8]/input`))
              .click();
          }
          if (
            outofCwr === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[9]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[9]/input`))
              .click();
          } else if (
            outofCwr === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[9]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[9]/input`))
              .click();
          }
        }
        if (
          noPfsync === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="nopfsync"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="nopfsync"]`)).click();
        } else if (
          noPfsync === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="nopfsync"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(`//*[@id="nopfsync"]`)).click();
        }
        driver
          .findElement(
            By.xpath(`//*[@id="statetype"]/option[text()='${stateType}']`)
          )
          .click();
        if (
          noXmlrpcSync === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="nosync"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="nosync"]`)).click();
        } else if (
          noXmlrpcSync === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="nosync"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(`//*[@id="nosync"]`)).click();
        }
        driver
          .findElement(
            By.xpath(`//*[@id="vlanprio"]/option[text()='${vlanPrio}']`)
          )
          .click();
        driver
          .findElement(
            By.xpath(`//*[@id="vlanprioset"]/option[text()='${vlanPrioSet}']`)
          )
          .click();
        driver.findElement(By.xpath(`//*[@id="gateway"]/option[1]`)).click();
      } else if (frule.rtype === "LAN") {
        await driver.get(
          `http://${device.ipAddress}/firewall_rules_edit.php?id=${frule.pfsenseId}`
        );
        driver
          .findElement(By.xpath(`//*[@id="type"]/option[text()='${action}']`))
          .click();
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
        driver
          .findElement(
            By.xpath(`//*[@id="interface"]/option[text()='${interface}']`)
          )
          .click();
        driver
          .findElement(
            By.xpath(`//*[@id="ipprotocol"]/option[text()='${addressFamily}']`)
          )
          .click();
        driver
          .findElement(
            By.xpath(`//*[@id="proto"]/option[text()='${protocol}']`)
          )
          .click();
        if (protocol === "ICMP") {
          await driver.wait(
            until.elementLocated(By.xpath(`//*[@id="icmptype[]"]`), 100000)
          );
          await driver.wait(
            until.elementIsVisible(
              driver.findElement(By.xpath(`//*[@id="icmptype[]"]`)),
              100000
            )
          );
          await frule.icmpSubtypes.map((test) => {
            console.log("running 1");
            var elementIcmp2 = driver.findElement(
              By.xpath(`//*[@id="icmptype[]"]/option[text()='${test}']`)
            );
            driver.executeScript(
              "arguments[0].scrollIntoView(true);",
              elementIcmp2
            );
            driver
              .actions()
              .keyDown(Key.CONTROL)
              .click(elementIcmp2)
              .keyUp(Key.CONTROL)
              .perform();
          });
          if (Object.keys(frule.icmpSubtypes).length == 0) {
            console.log("running 2");
            var elementIcmp = driver.findElement(
              By.xpath(`//*[@id="icmptype[]"]/option[text()='any']`)
            );
            await driver.executeScript(
              "arguments[0].scrollIntoView(true);",
              elementIcmp
            );
            await driver
              .actions()
              .keyDown(Key.CONTROL)
              .click(elementIcmp)
              .keyUp(Key.CONTROL)
              .perform();
          }
          await icmpSubtypes.map((test) => {
            console.log("running 3");
            var elementIcmp2 = driver.findElement(
              By.xpath(`//*[@id="icmptype[]"]/option[text()='${test}']`)
            );
            driver.executeScript(
              "arguments[0].scrollIntoView(true);",
              elementIcmp2
            );
            driver
              .actions()
              .keyDown(Key.CONTROL)
              .click(elementIcmp2)
              .keyUp(Key.CONTROL)
              .perform();
          });
        } else {
          newFruleData.icmpSubtypes = [];
        }
        if (
          sInvertMatch === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="srcnot"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="srcnot"]`)).click();
        } else if (
          sInvertMatch === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="srcnot"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(`//*[@id="srcnot"]`)).click();
        }
        driver
          .findElement(By.xpath(`//*[@id="srctype"]/option[text()='${sAny}']`))
          .click();
        if (sAny === "Single host or alias" || sAny === "Network") {
          await driver.findElement(By.xpath(`//*[@id="src"]`)).clear();
          await driver
            .findElement(By.xpath(`//*[@id="src"]`))
            .sendKeys(sAddress);
        }
        if (sAny === "Network") {
          driver
            .findElement(
              By.xpath(`//*[@id="srcmask"]/option[text()='${sPort}']`)
            )
            .click();
        }
        if (
          protocol === "TCP" ||
          protocol === "UDP" ||
          protocol === "TCP/UDP"
        ) {
          if (
            !(await driver
              .findElement(By.xpath(`//*[@id="srcbeginport"]`))
              .isDisplayed())
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="btnsrctoggle"]`))
              .click();
          }
          driver
            .findElement(
              By.xpath(`//*[@id="srcbeginport"]/option[text()='${sprFrom}']`)
            )
            .click();
          if (sprFrom === "(other)") {
            await driver
              .findElement(By.xpath(`//*[@id="srcbeginport_cust"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="srcbeginport_cust"]`))
              .sendKeys(sprFromCustom);
          }
          driver
            .findElement(
              By.xpath(`//*[@id="srcendport"]/option[text()='${sprTo}']`)
            )
            .click();
          if (sprTo === "(other)") {
            await driver
              .findElement(By.xpath(`//*[@id="srcendport_cust"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="srcendport_cust"]`))
              .sendKeys(sprToCustom);
          }
        }
        if (
          dInvertMatch === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="dstnot"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="dstnot"]`)).click();
        } else if (
          dInvertMatch === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="dstnot"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(``)).click();
        }
        driver
          .findElement(By.xpath(`//*[@id="dsttype"]/option[text()='${dAny}']`))
          .click();
        if (dAny === "Single host or alias" || dAny === "Network") {
          await driver.findElement(By.xpath(`//*[@id="dst"]`)).clear();
          await driver
            .findElement(By.xpath(`//*[@id="dst"]`))
            .sendKeys(dAddress);
        }
        if (dAny === "Network") {
          driver
            .findElement(
              By.xpath(`//*[@id="dstmask"]/option[text()='${dPort}']`)
            )
            .click();
        }

        if (
          protocol === "TCP" ||
          protocol === "UDP" ||
          protocol === "TCP/UDP"
        ) {
          driver
            .findElement(
              By.xpath(`//*[@id="dstbeginport"]/option[text()='${dptFrom}']`)
            )
            .click();
          if (dptFrom === "(other)") {
            await driver
              .findElement(By.xpath(`//*[@id="dstbeginport_cust"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="dstbeginport_cust"]`))
              .sendKeys(dptFromCustom);
          }
          driver
            .findElement(
              By.xpath(`//*[@id="dstendport"]/option[text()='${dptTo}']`)
            )
            .click();
          if (dptTo === "(other)") {
            await driver
              .findElement(By.xpath(`//*[@id="dstendport_cust"]`))
              .clear();
            await driver
              .findElement(By.xpath(`//*[@id="dstendport_cust"]`))
              .sendKeys(dptToCustom);
          }
        }
        if (
          log === true &&
          (await driver.findElement(By.xpath(`//*[@id="log"]`)).isSelected()) ==
            false
        ) {
          await driver.findElement(By.xpath(`//*[@id="log"]`)).click();
        } else if (
          log === false &&
          (await driver.findElement(By.xpath(`//*[@id="log"]`)).isSelected()) ==
            true
        ) {
          await driver.findElement(By.xpath(`//*[@id="log"]`)).click();
        }
        await driver.findElement(By.xpath(`//*[@id="descr"]`)).clear();
        await driver
          .findElement(By.xpath(`//*[@id="descr"]`))
          .sendKeys(description);
        await driver.wait(
          until.elementIsVisible(
            driver.findElement(By.xpath(`//*[@id="btnadvopts"]`)),
            100000
          )
        );
        if (
          !(await driver
            .findElement(By.xpath(`//*[@id="2"]/div[1]/form/div[5]/div[1]/h2`))
            .isDisplayed())
        ) {
          await driver.findElement(By.xpath(`//*[@id="btnadvopts"]`)).click();
        }
        if (protocol === "TCP") {
          driver
            .findElement(By.xpath(`//*[@id="os"]/option[text()='${sourceOs}']`))
            .click();
        }
        if (diffservCodePoint === "") {
          driver.findElement(By.xpath(`//*[@id="dscp"]/option[1]`)).click();
        } else {
          driver
            .findElement(
              By.xpath(`//*[@id="dscp"]/option[text()='${diffservCodePoint}']`)
            )
            .click();
        }
        if (
          allowIpOptions === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="allowopts"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="allowopts"]`)).click();
        } else if (
          allowIpOptions === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="allowopts"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(`//*[@id="allowopts"]`)).click();
        }
        if (
          disableReplyTo === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="disablereplyto"]`))
            .isSelected()) == false
        ) {
          await driver
            .findElement(By.xpath(`//*[@id="disablereplyto"]`))
            .click();
        } else if (
          disableReplyTo === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="disablereplyto"]`))
            .isSelected()) == true
        ) {
          await driver
            .findElement(By.xpath(`//*[@id="disablereplyto"]`))
            .click();
        }
        await driver.wait(
          until.elementIsVisible(
            driver.findElement(By.xpath(`//*[@id="tag"]`)),
            100000
          )
        );
        await driver.findElement(By.xpath(`//*[@id="tag"]`)).clear();
        await driver.findElement(By.xpath(`//*[@id="tag"]`)).sendKeys(tag);
        if (
          tInvert === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="nottagged"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="nottagged"]`)).click();
        } else if (
          tInvert === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="nottagged"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(`//*[@id="nottagged"]`)).click();
        }
        await driver.findElement(By.xpath(`//*[@id="tagged"]`)).clear();
        await driver
          .findElement(By.xpath(`//*[@id="tagged"]`))
          .sendKeys(tagged);
        await driver.findElement(By.xpath(`//*[@id="max"]`)).clear();
        await driver.findElement(By.xpath(`//*[@id="max"]`)).sendKeys(maxState);
        await driver.findElement(By.xpath(`//*[@id="max-src-nodes"]`)).clear();
        await driver
          .findElement(By.xpath(`//*[@id="max-src-nodes"]`))
          .sendKeys(maxSrcNodes);
        await driver.findElement(By.xpath(`//*[@id="max-src-conn"]`)).clear();
        await driver
          .findElement(By.xpath(`//*[@id="max-src-conn"]`))
          .sendKeys(maxConnections);
        await driver.findElement(By.xpath(`//*[@id="max-src-states"]`)).clear();
        await driver
          .findElement(By.xpath(`//*[@id="max-src-states"]`))
          .sendKeys(maxSrcStates);
        await driver
          .findElement(By.xpath(`//*[@id="max-src-conn-rate"]`))
          .clear();
        await driver
          .findElement(By.xpath(`//*[@id="max-src-conn-rate"]`))
          .sendKeys(maxSrcConnRate);
        await driver
          .findElement(By.xpath(`//*[@id="max-src-conn-rates"]`))
          .clear();
        await driver
          .findElement(By.xpath(`//*[@id="max-src-conn-rates"]`))
          .sendKeys(maxSrcConnRateS);
        await driver.findElement(By.xpath(`//*[@id="statetimeout"]`)).clear();
        await driver
          .findElement(By.xpath(`//*[@id="statetimeout"]`))
          .sendKeys(stateTimeout);
        if (
          tcpAnyFlag === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="tcpflags_any"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="tcpflags_any"]`)).click();
        } else if (
          tcpAnyFlag === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="tcpflags_any"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(`//*[@id="tcpflags_any"]`)).click();
        }
        if (
          (await driver
            .findElement(By.xpath(`//*[@id="tcpflags_any"]`))
            .isSelected()) == false
        ) {
          if (
            setFin === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[2]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[2]/input`))
              .click();
          } else if (
            setFin === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[2]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[2]/input`))
              .click();
          }
          if (
            setSyn === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[3]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[3]/input`))
              .click();
          } else if (
            setSyn === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[3]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[3]/input`))
              .click();
          }
          if (
            setRst === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[4]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[4]/input`))
              .click();
          } else if (
            setRst === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[4]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[4]/input`))
              .click();
          }
          if (
            setPsh === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[5]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[5]/input`))
              .click();
          } else if (
            setPsh === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[5]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[5]/input`))
              .click();
          }
          if (
            setAck === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[6]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[6]/input`))
              .click();
          } else if (
            setAck === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[6]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[6]/input`))
              .click();
          }
          if (
            setUrg === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[7]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[7]/input`))
              .click();
          } else if (
            setUrg === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[7]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[7]/input`))
              .click();
          }
          if (
            setEce === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[8]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[8]/input`))
              .click();
          } else if (
            setEce === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[8]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[8]/input`))
              .click();
          }
          if (
            setCwr === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[9]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[9]/input`))
              .click();
          } else if (
            setCwr === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[9]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags1"]/td[9]/input`))
              .click();
          }
          if (
            outofFin === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[2]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[2]/input`))
              .click();
          } else if (
            outofFin === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[2]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[2]/input`))
              .click();
          }
          if (
            outofSyn === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[3]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[3]/input`))
              .click();
          } else if (
            outofSyn === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[3]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[3]/input`))
              .click();
          }
          if (
            outofRst === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[4]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[4]/input`))
              .click();
          } else if (
            outofRst === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[4]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[4]/input`))
              .click();
          }
          if (
            outofPsh === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[5]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[5]/input`))
              .click();
          } else if (
            outofPsh === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[5]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[5]/input`))
              .click();
          }
          if (
            outofAck === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[6]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[6]/input`))
              .click();
          } else if (
            outofAck === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[6]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[6]/input`))
              .click();
          }
          if (
            outofUrg === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[7]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[7]/input`))
              .click();
          } else if (
            outofUrg === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[7]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[7]/input`))
              .click();
          }
          if (
            outofEce === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[8]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[8]/input`))
              .click();
          } else if (
            outofEce === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[8]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[8]/input`))
              .click();
          }
          if (
            outofCwr === true &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[9]/input`))
              .isSelected()) == false
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[9]/input`))
              .click();
          } else if (
            outofCwr === false &&
            (await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[9]/input`))
              .isSelected()) == true
          ) {
            await driver
              .findElement(By.xpath(`//*[@id="tcpflags2"]/td[9]/input`))
              .click();
          }
        }
        if (
          noPfsync === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="nopfsync"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="nopfsync"]`)).click();
        } else if (
          noPfsync === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="nopfsync"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(`//*[@id="nopfsync"]`)).click();
        }
        driver
          .findElement(
            By.xpath(`//*[@id="statetype"]/option[text()='${stateType}']`)
          )
          .click();
        if (
          noXmlrpcSync === true &&
          (await driver
            .findElement(By.xpath(`//*[@id="nosync"]`))
            .isSelected()) == false
        ) {
          await driver.findElement(By.xpath(`//*[@id="nosync"]`)).click();
        } else if (
          noXmlrpcSync === false &&
          (await driver
            .findElement(By.xpath(`//*[@id="nosync"]`))
            .isSelected()) == true
        ) {
          await driver.findElement(By.xpath(`//*[@id="nosync"]`)).click();
        }
        driver
          .findElement(
            By.xpath(`//*[@id="vlanprio"]/option[text()='${vlanPrio}']`)
          )
          .click();
        driver
          .findElement(
            By.xpath(`//*[@id="vlanprioset"]/option[text()='${vlanPrioSet}']`)
          )
          .click();
        driver.findElement(By.xpath(`//*[@id="gateway"]/option[1]`)).click();
      }
    } finally {
      await driver.findElement(By.xpath(`//*[@id="save"]`)).click();
      mes = await driver
        .findElement(By.xpath(`/html/body/div[1]/div`))
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
  if (
    mes ===
    `The firewall rule configuration has been changed.
The changes must be applied for them to take effect.
Apply Changes`
  ) {
    await Frule.findOneAndUpdate({ ruleId: req.params.ruleId }, newFruleData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  }

  res.status(200).json({
    success: true,
    message: mes,
  });
});

// Delete Frule --Admin
exports.deleteFrule = catchAsyncErrors(async (req, res, next) => {
  var mes = "Error";
  const frule = await Frule.findOne({ ruleId: req.params.ruleId });

  if (!frule) {
    return next(
      new ErrorHander(
        `Firewall rule does not exist with Rule Id : ${req.params.ruleId}`,
        400
      )
    );
  }

  const device = await Device.findOne({ ipAddress: frule.deviceId });
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
      await driver.get(`http://${device.ipAddress}/firewall_rules.php`);
      if (frule.rtype === "FLOATING") {
        driver.findElement(By.xpath(`//*[@id="2"]/div/ul/li[1]/a`)).click();
        await driver.wait(
          until.elementLocated(
            By.xpath(`//*[@id="fr${frule.pfsenseDeleteId}"]/td[14]/a[5]`),
            100000
          )
        );
        driver
          .findElement(
            By.xpath(`//*[@id="fr${frule.pfsenseDeleteId}"]/td[14]/a[5]`)
          )
          .click();
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        if (alertText === "Are you sure you wish to delete this rule?") {
          await alert.accept();
        } else {
          await alert.dismiss();
        }
      } else if (frule.rtype === "WAN") {
        driver.findElement(By.xpath(`//*[@id="2"]/div/ul/li[2]/a`)).click();
        await driver.wait(
          until.elementLocated(
            By.xpath(`//*[@id="fr${frule.pfsenseDeleteId}"]/td[13]/a[5]`),
            100000
          )
        );
        driver
          .findElement(
            By.xpath(`//*[@id="fr${frule.pfsenseDeleteId}"]/td[13]/a[5]`)
          )
          .click();
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        if (alertText === "Are you sure you wish to delete this rule?") {
          await alert.accept();
        } else {
          await alert.dismiss();
        }
      } else if (frule.rtype === "LAN") {
        driver.findElement(By.xpath(`//*[@id="2"]/div/ul/li[3]/a`)).click();
        await driver.wait(
          until.elementLocated(
            By.xpath(`//*[@id="fr${frule.pfsenseDeleteId}"]/td[13]/a[5]`),
            100000
          )
        );
        driver
          .findElement(
            By.xpath(`//*[@id="fr${frule.pfsenseDeleteId}"]/td[13]/a[5]`)
          )
          .click();
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        if (alertText === "Are you sure you wish to delete this rule?") {
          await alert.accept();
        } else {
          await alert.dismiss();
        }
      }
    } finally {
      mes = "Firewall Rule Deleted Successfully.";
      await driver.wait(
        until.elementLocated(
          By.xpath(`//*[@id="2"]/div/div[1]/form/button`),
          100000
        )
      );
      await driver
        .findElement(By.xpath(`//*[@id="2"]/div/div[1]/form/button`))
        .click();
      driver.quit();
    }
  }
  //code to change pfsense id

  const indexChanger1 = await Frule.find({
    deviceId: frule.deviceId,
  });
  indexChanger1.map(async (test) => {
    if (test.pfsenseId > frule.pfsenseId) {
      let prevId = Number(test.pfsenseId);
      prevId = prevId - 1;
      const pfData = {
        pfsenseId: prevId,
      };
      await Frule.findOneAndUpdate({ ruleId: test.ruleId }, pfData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
    }
  });
  if (frule.rtype === "FLOATING") {
    const indexChanger = await Frule.find({
      deviceId: frule.deviceId,
      rtype: "FLOATING",
    });
    indexChanger.map(async (test) => {
      if (test.pfsenseDeleteId > frule.pfsenseDeleteId) {
        let prevId = Number(test.pfsenseDeleteId);
        prevId = prevId - 1;
        const pfData = {
          pfsenseDeleteId: prevId,
        };
        await Frule.findOneAndUpdate({ ruleId: test.ruleId }, pfData, {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        });
      }
    });
  } else if (frule.rtype === "WAN") {
    const indexChanger = await Frule.find({
      deviceId: frule.deviceId,
      rtype: "WAN",
    });
    indexChanger.map(async (test) => {
      if (test.pfsenseDeleteId > frule.pfsenseDeleteId) {
        let prevId = Number(test.pfsenseDeleteId);
        prevId = prevId - 1;
        const pfData = {
          pfsenseDeleteId: prevId,
        };
        await Frule.findOneAndUpdate({ ruleId: test.ruleId }, pfData, {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        });
      }
    });
  } else if (frule.rtype === "LAN") {
    const indexChanger = await Frule.find({
      deviceId: frule.deviceId,
      rtype: "LAN",
    });
    indexChanger.map(async (test) => {
      if (test.pfsenseDeleteId > frule.pfsenseDeleteId) {
        let prevId = Number(test.pfsenseDeleteId);
        prevId = prevId - 1;
        const pfData = {
          pfsenseDeleteId: prevId,
        };
        await Frule.findOneAndUpdate({ ruleId: test.ruleId }, pfData, {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        });
      }
    });
  }
  await frule.remove();
  res.status(200).json({
    success: true,
    message: mes,
  });
});
exports.Pfsenseidupdate = catchAsyncErrors(async (req, res, next) => {
  const { ruleId1, ruleId2, deviceId } = req.body;
  const frule1 = await Frule.findOne({ ruleId: ruleId1, deviceId: deviceId });
  if (!frule1) {
    return next(
      new ErrorHander(`Firewall rule does not exist with Rule Id : ${ruleId1}`)
    );
  }
  const frule2 = await Frule.findOne({ ruleId: ruleId2, deviceId: deviceId });
  if (!frule2) {
    return next(
      new ErrorHander(`Firewall rule does not exist with Rule Id : ${ruleId2}`)
    );
  }
  if (!(frule1.rtype === frule2.rtype)) {
    return next(new ErrorHander(`Invalid Operation`));
  }
  let myChecker = frule2.pfsenseId - frule1.pfsenseId;
  if (!(myChecker === 1)) {
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
        await driver.get(`http://${device.ipAddress}/firewall_rules.php`);
        if (frule1.rtype === "FLOATING") {
          driver.findElement(By.xpath(`//*[@id="2"]/div/ul/li[1]/a`)).click();
          await driver.wait(
            until.elementLocated(
              By.xpath(`//*[@id="frc${frule1.pfsenseDeleteId}"]`)
            ),
            100000
          );
          driver
            .findElement(By.xpath(`//*[@id="frc${frule1.pfsenseDeleteId}"]`))
            .click();
          await driver.wait(
            until.elementLocated(
              By.xpath(`//*[@id="Xmove_${frule2.pfsenseId}"]`)
            ),
            100000
          );
          driver
            .findElement(By.xpath(`//*[@id="Xmove_${frule2.pfsenseId}"]`))
            .click();
        } else if (frule1.rtype === "WAN") {
          driver.findElement(By.xpath(`//*[@id="2"]/div/ul/li[2]/a`)).click();
          await driver.wait(
            until.elementLocated(
              By.xpath(`//*[@id="frc${frule1.pfsenseDeleteId}"]`)
            ),
            100000
          );
          driver
            .findElement(By.xpath(`//*[@id="frc${frule1.pfsenseDeleteId}"]`))
            .click();
          await driver.wait(
            until.elementLocated(
              By.xpath(`//*[@id="Xmove_${frule2.pfsenseId}"]`)
            ),
            100000
          );
          driver
            .findElement(By.xpath(`//*[@id="Xmove_${frule2.pfsenseId}"]`))
            .click();
        } else if (frule1.rtype === "LAN") {
          driver.findElement(By.xpath(`//*[@id="2"]/div/ul/li[3]/a`)).click();
          await driver.wait(
            until.elementLocated(
              By.xpath(`//*[@id="frc${frule1.pfsenseDeleteId}"]`)
            ),
            100000
          );
          driver
            .findElement(By.xpath(`//*[@id="frc${frule1.pfsenseDeleteId}"]`))
            .click();
          await driver.wait(
            until.elementLocated(
              By.xpath(`//*[@id="Xmove_${frule2.pfsenseId}"]`)
            ),
            100000
          );
          driver
            .findElement(By.xpath(`//*[@id="Xmove_${frule2.pfsenseId}"]`))
            .click();
        }
      } finally {
        if (
          await driver.wait(
            until.elementIsEnabled(
              driver.findElement(By.xpath(`//*[@id="order-store"]`)),
              100000
            )
          )
        ) {
          driver.findElement(By.xpath(`//*[@id="order-store"]`)).click();
        }
        if (
          await driver.wait(
            until.elementLocated(
              By.xpath(`//*[@id="2"]/div/div[1]/form/button`),
              1000
            )
          )
        ) {
          await driver
            .findElement(By.xpath(`//*[@id="2"]/div/div[1]/form/button`))
            .click();
        }
        driver.quit();
      }
    }
    const frule = await Frule.find({ deviceId: deviceId });
    let frule1PsenseId = frule1.pfsenseId;
    let frule2PsenseId = frule2.pfsenseId;
    let frule2DeleteId = frule2.pfsenseDeleteId;
    if (frule1.pfsenseId > frule2.pfsenseId) {
      frule.map(async (test) => {
        if (
          test.pfsenseId >= frule2PsenseId &&
          test.pfsenseId < frule1PsenseId
        ) {
          const pfData = {
            pfsenseId: test.pfsenseId + 1,
            pfsenseDeleteId: test.pfsenseDeleteId + 1,
          };
          await Frule.findOneAndUpdate({ ruleId: test.ruleId }, pfData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });
        }
      });
      const pfData = {
        pfsenseId: frule2PsenseId,
        pfsenseDeleteId: frule2DeleteId,
      };
      await Frule.findOneAndUpdate({ ruleId: frule1.ruleId }, pfData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
    } else {
      frule.map(async (test) => {
        if (
          test.pfsenseId > frule1PsenseId &&
          test.pfsenseId < frule2PsenseId
        ) {
          const pfData = {
            pfsenseId: test.pfsenseId - 1,
            pfsenseDeleteId: test.pfsenseDeleteId - 1,
          };
          await Frule.findOneAndUpdate({ ruleId: test.ruleId }, pfData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });
        }
      });
      const pfData = {
        pfsenseId: frule2PsenseId - 1,
        pfsenseDeleteId: frule2DeleteId - 1,
      };
      await Frule.findOneAndUpdate({ ruleId: frule1.ruleId }, pfData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
    }
  }
  res.status(200).json({
    success: true,
    message: "Operation Successfull",
  });
});
