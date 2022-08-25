import React, { useState, useContext } from "react";
import Fhome from "../Fhome";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../Contexts/UserContext";
import AxiosInstance from "../../../Axios/AxiosInstance";

const AddFloatRule = () => {
  const navigate = useNavigate();
  const [os, setOs] = useState(() => {
    return "true";
  });
  const [distcpflag, setDistcpflag] = useState(() => {
    return "block";
  });
  const [dstfrom, setDstfrom] = useState(() => {
    return "";
  });
  const [dstto, setDstto] = useState(() => {
    return "";
  });
  const [srcfrom, setSrcfrom] = useState(() => {
    return "";
  });
  const [srcto, setSrcto] = useState(() => {
    return "";
  });
  const [ipdestypval, setIpdestypval] = useState(() => {
    return "true";
  });
  const [desmaskval, setDesmaskval] = useState(() => {
    return "true";
  });
  const [ipsrctypval, setIpsrctypval] = useState(() => {
    return "true";
  });
  const [srcmaskval, setSrcmaskval] = useState(() => {
    return "true";
  });
  const [icmpblock, setIcmpblock] = useState(() => {
    return "none";
  });
  const [dstprtr1, setDstprtr1] = useState(() => {
    return "none";
  });
  const [disstyl1, setDisstyl1] = useState(() => {
    return "none";
  });
  const [srcprtrange, setSrcprtrange] = useState(() => {
    return "none";
  });
  const [sourceos, setSourceos] = useState(() => {
    return "none";
  });
  const [distext1, setDistext1] = useState(() => {
    return "Display Advanced";
  });
  const [distext2, setDistext2] = useState(() => {
    return "Display Advanced";
  });
  const distextf1 = () => {
    if (distext1 === "Display Advanced") {
      setDistext1("Hide Advanced");
    } else {
      setDistext1("Display Advanced");
    }
  };
  const distextf2 = () => {
    if (distext2 === "Display Advanced") {
      setDistext2("Hide Advanced");
    } else {
      setDistext2("Display Advanced");
    }
  };
  const dispadvan1 = () => {
    if (srcprtrange === "none") {
      setSrcprtrange("block");
    } else {
      setSrcprtrange("none");
    }
  };
  const dispadvan2 = () => {
    if (sourceos === "none") {
      setSourceos("block");
    } else {
      setSourceos("none");
    }
  };
  const protochange = () => {
    let selectprot = document.getElementById("proto");
    let valueprot = selectprot.options[selectprot.selectedIndex].text;
    if (valueprot === "TCP" || valueprot === "UDP" || valueprot === "TCP/UDP") {
      setDstprtr1("block");
      setDisstyl1("block");
    } else {
      setDstprtr1("none");
      setDisstyl1("none");
      setDistext1("Display Advanced");
      setSrcprtrange("none");
    }
    if (valueprot === "ICMP") {
      setIcmpblock("block");
      setDistext1("Display Advanced");
      setSrcprtrange("none");
    } else {
      setIcmpblock("none");
    }
    if (valueprot === "TCP") {
      setOs("");
    } else {
      setOs("true");
    }
  };
  const srctypefun = () => {
    let selectsrctyp = document.getElementById("srctype");
    let valuesrctyp = selectsrctyp.options[selectsrctyp.selectedIndex].text;
    if (valuesrctyp === "Single host or alias") {
      setIpsrctypval("");
      setSrcmaskval("true");
    } else if (valuesrctyp === "Network") {
      setIpsrctypval("");
      setSrcmaskval("");
    } else {
      setIpsrctypval("true");
      setSrcmaskval("true");
    }
  };
  const destypefun = () => {
    let selectdestyp = document.getElementById("dsttype");
    let valuedestyp = selectdestyp.options[selectdestyp.selectedIndex].text;
    if (valuedestyp === "Single host or alias") {
      setIpdestypval("");
      setDesmaskval("true");
    } else if (valuedestyp === "Network") {
      setIpdestypval("");
      setDesmaskval("");
    } else {
      setIpdestypval("true");
      setDesmaskval("true");
    }
  };
  const srcfromfun = () => {
    let selectfromsrc = document.getElementById("srcbeginport");
    let valuefromsrc = selectfromsrc.options[selectfromsrc.selectedIndex].text;
    if (valuefromsrc === "(other)") {
      setSrcfrom("");
    } else {
      setSrcfrom("true");
    }
  };
  const srctofun = () => {
    let selecttosrc = document.getElementById("srcendport");
    let valuetosrc = selecttosrc.options[selecttosrc.selectedIndex].text;
    if (valuetosrc === "(other)") {
      setSrcto("");
    } else {
      setSrcto("true");
    }
  };
  const dstfromfun = () => {
    let selectfromdst = document.getElementById("dstbeginport");
    let valuefromdst = selectfromdst.options[selectfromdst.selectedIndex].text;
    if (valuefromdst === "(other)") {
      setDstfrom("");
    } else {
      setDstfrom("true");
    }
  };
  const dsttofun = () => {
    let selecttodst = document.getElementById("dstendport");
    let valuetodst = selecttodst.options[selecttodst.selectedIndex].text;
    if (valuetodst === "(other)") {
      setDstto("");
    } else {
      setDstto("true");
    }
  };
  const tcpflagfun = () => {
    let selecttcpflag = document.getElementById("tcpflags_any");
    let valuetcpflag = selecttcpflag.checked;
    if (valuetcpflag) {
      setDistcpflag("none");
    } else {
      setDistcpflag("block");
    }
  };
  const { userId, userRole, fDeviceId, fDeviceType } = useContext(UserContext);
  const [initialValues, setInitialValues] = useState(() => {
    return {
      ruleId: "",
      rtype: "",
      action: "",
      disabled: "",
      quick: "",
      interface: {},
      direction: "",
      addressFamily: "",
      protocol: "",
      icmpSubtypes: {},
      sInvertMatch: "",
      sAny: "",
      sAddress: "",
      sPort: "",
      sprFrom: "",
      sprFromCustom: "",
      sprTo: "",
      sprToCustom: "",
      dInvertMatch: "",
      dAny: "",
      dAddress: "",
      dPort: "",
      dptFrom: "",
      dptFromCustom: "",
      dptTo: "",
      dptToCustom: "",
      log: "",
      description: "",
      sourceOs: "",
      diffservCodePoint: "",
      allowIpOptions: "",
      disableReplyTo: "",
      tag: "",
      tInvert: "",
      tagged: "",
      maxState: "",
      maxSrcNodes: "",
      maxConnections: "",
      maxSrcStates: "",
      maxSrcConnRate: "",
      maxSrcConnRateS: "",
      stateTimeout: "",
      setFin: "",
      setSyn: "",
      setRst: "",
      setPsh: "",
      setAck: "",
      setUrg: "",
      setEce: "",
      setCwr: "",
      outofFin: "",
      outofSyn: "",
      outofRst: "",
      outofPsh: "",
      outofAck: "",
      outofUrg: "",
      outofEce: "",
      outofCwr: "",
      tcpAnyFlag: "",
      noPfsync: "",
      stateType: "",
      noXmlrpcSync: "",
      vlanPrio: "",
      vlanPrioSet: "",
      gateway: "",
    };
  });
  const registerStatus = (pDesc) => {
    AxiosInstance.post("/registerStatuss", {
      requestedBY: userId,
      deviceType: fDeviceType,
      description: pDesc,
      workOnId: document.getElementById("ruleid").value,
      deviceId: fDeviceId,
      link: "/editFloatRule",
      currentStatus: "Pending Approval",
      created: "1",
      edited: "0",
      deleted: "0",
    });
  };
  const addLog = (pDesc) => {
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " : " + time;
    AxiosInstance.post("/registerLog", {
      generatedByUserId: userId,
      dateAndTime: dateTime,
      description: pDesc,
    });
    navigate(-1);
  };
  const addTempRule = () => {
    AxiosInstance.post("/tempregisterFrule", {
      ruleId: document.getElementById("ruleid").value,
      deviceId: fDeviceId,
      rtype: "FLOATING",
      action: document.getElementById("type").value,
      disabled: document.getElementById("disabled").checked,
      quick: document.getElementById("quick").checked,
      interface: Array.from(
        document.getElementById("interface[]").selectedOptions
      ).map(({ value }) => value),
      direction: document.getElementById("direction").value,
      addressFamily: document.getElementById("ipprotocol").value,
      protocol: document.getElementById("proto").value,
      icmpSubtypes: Array.from(
        document.getElementById("icmptype[]").selectedOptions
      ).map(({ value }) => value),
      sInvertMatch: document.getElementById("srcnot").checked,
      sAny: document.getElementById("srctype").value,
      sAddress: document.getElementById("src").value,
      sPort: document.getElementById("srcmask").value,
      sprFrom: document.getElementById("srcbeginport").value,
      sprFromCustom: document.getElementById("srcbeginport_cust").value,
      sprTo: document.getElementById("srcendport").value,
      sprToCustom: document.getElementById("srcendport_cust").value,
      dInvertMatch: document.getElementById("dstnot").checked,
      dAny: document.getElementById("dsttype").value,
      dAddress: document.getElementById("dst").value,
      dPort: document.getElementById("dstmask").value,
      dptFrom: document.getElementById("dstbeginport").value,
      dptFromCustom: document.getElementById("dstbeginport_cust").value,
      dptTo: document.getElementById("dstendport").value,
      dptToCustom: document.getElementById("dstendport_cust").value,
      log: document.getElementById("log").checked,
      description: document.getElementById("descr").value,
      sourceOs: document.getElementById("os").value,
      diffservCodePoint: document.getElementById("dscp").value,
      allowIpOptions: document.getElementById("allowopts").checked,
      disableReplyTo: document.getElementById("disablereplyto").checked,
      tag: document.getElementById("tag").value,
      tInvert: document.getElementById("nottagged").checked,
      tagged: document.getElementById("tagged").value,
      maxState: document.getElementById("max").value,
      maxSrcNodes: document.getElementById("max-src-nodes").value,
      maxConnections: document.getElementById("max-src-conn").value,
      maxSrcStates: document.getElementById("max-src-states").value,
      maxSrcConnRate: document.getElementById("max-src-conn-rate").value,
      maxSrcConnRateS: document.getElementById("max-src-conn-rates").value,
      stateTimeout: document.getElementById("statetimeout").value,
      setFin: document.getElementById("tcpflags1_fin").checked,
      setSyn: document.getElementById("tcpflags1_syn").checked,
      setRst: document.getElementById("tcpflags1_rst").checked,
      setPsh: document.getElementById("tcpflags1_psh").checked,
      setAck: document.getElementById("tcpflags1_ack").checked,
      setUrg: document.getElementById("tcpflags1_urg").checked,
      setEce: document.getElementById("tcpflags1_ece").checked,
      setCwr: document.getElementById("tcpflags1_cwr").checked,
      outofFin: document.getElementById("tcpflags2_fin").checked,
      outofSyn: document.getElementById("tcpflags2_syn").checked,
      outofRst: document.getElementById("tcpflags2_rst").checked,
      outofPsh: document.getElementById("tcpflags2_psh").checked,
      outofAck: document.getElementById("tcpflags2_ack").checked,
      outofUrg: document.getElementById("tcpflags2_urg").checked,
      outofEce: document.getElementById("tcpflags2_ece").checked,
      outofCwr: document.getElementById("tcpflags2_cwr").checked,
      tcpAnyFlag: document.getElementById("tcpflags_any").checked,
      noPfsync: document.getElementById("nopfsync").checked,
      stateType: document.getElementById("statetype").value,
      noXmlrpcSync: document.getElementById("nosync").checked,
      vlanPrio: document.getElementById("vlanprio").value,
      vlanPrioSet: document.getElementById("vlanprioset").value,
      gateway: document.getElementById("gateway").value,
      generatedByUserId: userId,
    });
  };
  const addRule = () => {
    if (userRole === "Admin") {
      AxiosInstance.post("/registerFrule", {
        ruleId: document.getElementById("ruleid").value,
        deviceId: fDeviceId,
        rtype: "FLOATING",
        action: document.getElementById("type").value,
        disabled: document.getElementById("disabled").checked,
        quick: document.getElementById("quick").checked,
        interface: Array.from(
          document.getElementById("interface[]").selectedOptions
        ).map(({ value }) => value),
        direction: document.getElementById("direction").value,
        addressFamily: document.getElementById("ipprotocol").value,
        protocol: document.getElementById("proto").value,
        icmpSubtypes: Array.from(
          document.getElementById("icmptype[]").selectedOptions
        ).map(({ value }) => value),
        sInvertMatch: document.getElementById("srcnot").checked,
        sAny: document.getElementById("srctype").value,
        sAddress: document.getElementById("src").value,
        sPort: document.getElementById("srcmask").value,
        sprFrom: document.getElementById("srcbeginport").value,
        sprFromCustom: document.getElementById("srcbeginport_cust").value,
        sprTo: document.getElementById("srcendport").value,
        sprToCustom: document.getElementById("srcendport_cust").value,
        dInvertMatch: document.getElementById("dstnot").checked,
        dAny: document.getElementById("dsttype").value,
        dAddress: document.getElementById("dst").value,
        dPort: document.getElementById("dstmask").value,
        dptFrom: document.getElementById("dstbeginport").value,
        dptFromCustom: document.getElementById("dstbeginport_cust").value,
        dptTo: document.getElementById("dstendport").value,
        dptToCustom: document.getElementById("dstendport_cust").value,
        log: document.getElementById("log").checked,
        description: document.getElementById("descr").value,
        sourceOs: document.getElementById("os").value,
        diffservCodePoint: document.getElementById("dscp").value,
        allowIpOptions: document.getElementById("allowopts").checked,
        disableReplyTo: document.getElementById("disablereplyto").checked,
        tag: document.getElementById("tag").value,
        tInvert: document.getElementById("nottagged").checked,
        tagged: document.getElementById("tagged").value,
        maxState: document.getElementById("max").value,
        maxSrcNodes: document.getElementById("max-src-nodes").value,
        maxConnections: document.getElementById("max-src-conn").value,
        maxSrcStates: document.getElementById("max-src-states").value,
        maxSrcConnRate: document.getElementById("max-src-conn-rate").value,
        maxSrcConnRateS: document.getElementById("max-src-conn-rates").value,
        stateTimeout: document.getElementById("statetimeout").value,
        setFin: document.getElementById("tcpflags1_fin").checked,
        setSyn: document.getElementById("tcpflags1_syn").checked,
        setRst: document.getElementById("tcpflags1_rst").checked,
        setPsh: document.getElementById("tcpflags1_psh").checked,
        setAck: document.getElementById("tcpflags1_ack").checked,
        setUrg: document.getElementById("tcpflags1_urg").checked,
        setEce: document.getElementById("tcpflags1_ece").checked,
        setCwr: document.getElementById("tcpflags1_cwr").checked,
        outofFin: document.getElementById("tcpflags2_fin").checked,
        outofSyn: document.getElementById("tcpflags2_syn").checked,
        outofRst: document.getElementById("tcpflags2_rst").checked,
        outofPsh: document.getElementById("tcpflags2_psh").checked,
        outofAck: document.getElementById("tcpflags2_ack").checked,
        outofUrg: document.getElementById("tcpflags2_urg").checked,
        outofEce: document.getElementById("tcpflags2_ece").checked,
        outofCwr: document.getElementById("tcpflags2_cwr").checked,
        tcpAnyFlag: document.getElementById("tcpflags_any").checked,
        noPfsync: document.getElementById("nopfsync").checked,
        stateType: document.getElementById("statetype").value,
        noXmlrpcSync: document.getElementById("nosync").checked,
        vlanPrio: document.getElementById("vlanprio").value,
        vlanPrioSet: document.getElementById("vlanprioset").value,
        gateway: document.getElementById("gateway").value,
        generatedByUserId: userId,
      })
        .then((res) => {
          if (res.data.success === true) {
            if (
              res.data.message ===
              `The firewall rule configuration has been changed.
The changes must be applied for them to take effect.
Apply Changes`
            ) {
              addTempRule();
              addLog(
                `Firewall Rule with Rule Id : "${
                  document.getElementById("ruleid").value
                }" is created.`
              );
              alert(
                `Firewall Rule with Rule Id : "${
                  document.getElementById("ruleid").value
                }" is created.`
              );
              console.log("addadmintrue");
            } else if (res.data.message.includes("error")) {
              console.log("addadminerroe");
              alert(res.data.message);
            } else if (res.data.message.includes("Duplicate")) {
              console.log("addadminerroe");
              alert(res.data.message);
            }
          }
        })
        .catch((err) => {
          console.log("addadminerr");
          alert(err.response.data.message);
        });
    } else if (userRole === "Operator") {
      AxiosInstance.post("/tempregisterFrule", {
        ruleId: document.getElementById("ruleid").value,
        deviceId: fDeviceId,
        rtype: "FLOATING",
        action: document.getElementById("type").value,
        disabled: document.getElementById("disabled").checked,
        quick: document.getElementById("quick").checked,
        interface: Array.from(
          document.getElementById("interface[]").selectedOptions
        ).map(({ value }) => value),
        direction: document.getElementById("direction").value,
        addressFamily: document.getElementById("ipprotocol").value,
        protocol: document.getElementById("proto").value,
        icmpSubtypes: Array.from(
          document.getElementById("icmptype[]").selectedOptions
        ).map(({ value }) => value),
        sInvertMatch: document.getElementById("srcnot").checked,
        sAny: document.getElementById("srctype").value,
        sAddress: document.getElementById("src").value,
        sPort: document.getElementById("srcmask").value,
        sprFrom: document.getElementById("srcbeginport").value,
        sprFromCustom: document.getElementById("srcbeginport_cust").value,
        sprTo: document.getElementById("srcendport").value,
        sprToCustom: document.getElementById("srcendport_cust").value,
        dInvertMatch: document.getElementById("dstnot").checked,
        dAny: document.getElementById("dsttype").value,
        dAddress: document.getElementById("dst").value,
        dPort: document.getElementById("dstmask").value,
        dptFrom: document.getElementById("dstbeginport").value,
        dptFromCustom: document.getElementById("dstbeginport_cust").value,
        dptTo: document.getElementById("dstendport").value,
        dptToCustom: document.getElementById("dstendport_cust").value,
        log: document.getElementById("log").checked,
        description: document.getElementById("descr").value,
        sourceOs: document.getElementById("os").value,
        diffservCodePoint: document.getElementById("dscp").value,
        allowIpOptions: document.getElementById("allowopts").checked,
        disableReplyTo: document.getElementById("disablereplyto").checked,
        tag: document.getElementById("tag").value,
        tInvert: document.getElementById("nottagged").checked,
        tagged: document.getElementById("tagged").value,
        maxState: document.getElementById("max").value,
        maxSrcNodes: document.getElementById("max-src-nodes").value,
        maxConnections: document.getElementById("max-src-conn").value,
        maxSrcStates: document.getElementById("max-src-states").value,
        maxSrcConnRate: document.getElementById("max-src-conn-rate").value,
        maxSrcConnRateS: document.getElementById("max-src-conn-rates").value,
        stateTimeout: document.getElementById("statetimeout").value,
        setFin: document.getElementById("tcpflags1_fin").checked,
        setSyn: document.getElementById("tcpflags1_syn").checked,
        setRst: document.getElementById("tcpflags1_rst").checked,
        setPsh: document.getElementById("tcpflags1_psh").checked,
        setAck: document.getElementById("tcpflags1_ack").checked,
        setUrg: document.getElementById("tcpflags1_urg").checked,
        setEce: document.getElementById("tcpflags1_ece").checked,
        setCwr: document.getElementById("tcpflags1_cwr").checked,
        outofFin: document.getElementById("tcpflags2_fin").checked,
        outofSyn: document.getElementById("tcpflags2_syn").checked,
        outofRst: document.getElementById("tcpflags2_rst").checked,
        outofPsh: document.getElementById("tcpflags2_psh").checked,
        outofAck: document.getElementById("tcpflags2_ack").checked,
        outofUrg: document.getElementById("tcpflags2_urg").checked,
        outofEce: document.getElementById("tcpflags2_ece").checked,
        outofCwr: document.getElementById("tcpflags2_cwr").checked,
        tcpAnyFlag: document.getElementById("tcpflags_any").checked,
        noPfsync: document.getElementById("nopfsync").checked,
        stateType: document.getElementById("statetype").value,
        noXmlrpcSync: document.getElementById("nosync").checked,
        vlanPrio: document.getElementById("vlanprio").value,
        vlanPrioSet: document.getElementById("vlanprioset").value,
        gateway: document.getElementById("gateway").value,
        generatedByUserId: userId,
      })
        .then((res) => {
          if (res.data.success === true) {
            if (res.data.message === `Firewall rule added successfully.`) {
              console.log("addoperatortrue");
              registerStatus(
                `Firewall Rule with Rule Id : "${
                  document.getElementById("ruleid").value
                }" is created and waiting for Admin approval.`
              );
              addLog(
                `Firewall Rule with Rule Id : "${
                  document.getElementById("ruleid").value
                }" is created and waiting for Admin approval.`
              );
              alert(
                `Firewall Rule with Rule Id : "${
                  document.getElementById("ruleid").value
                }" is created and waiting for Admin approval.`
              );
            } else {
              console.log("addoperatorelse");
              alert(res.data.message);
            }
          }
        })
        .catch((err) => {
          console.log("addoperatorerr");
          alert(err.response.data.message);
        });
    }
  };
  return (
    <>
      <Fhome />
      <div>
        <meta name="theme-color" content="#ffffff" />
        <div className="container static">
          <header className="header">
            <ol className="breadcrumb">
              <li>Firewall</li>
              <li>Rules</li>
              <li>Floating</li>
              <li>Edit</li>
            </ol>
            <ul className="context-links"></ul>
          </header>
          <div className="form-horizontal" method="post">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h2 className="panel-title">Edit Firewall Rule</h2>
              </div>
              <div className="panel-body">
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>Rule Id</span>
                  </label>
                  <div className="col-sm-10">
                    <input
                      className="form-control"
                      name="ruleid"
                      id="ruleid"
                      type="text"
                      value={initialValues.ruleId}
                      onChange={(e) => setInitialValues(e.target.value)}
                    />
                    <span className="help-block"></span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span className="element-required">Action</span>
                  </label>

                  <div className="col-sm-10">
                    <select
                      className="form-control"
                      name="type"
                      id="type"
                      value={initialValues.action}
                      onChange={(e) => setInitialValues(e.target.value)}
                    >
                      <option value="Pass">Pass</option>
                      <option value="Block">Block</option>
                      <option value="Reject">Reject</option>
                      <option value="Match">Match</option>
                    </select>

                    <span className="help-block">
                      Choose what to do with packets that match the criteria
                      specified below.
                      <br />
                      Hint: the difference between block and reject is that with
                      reject, a packet (TCP RST or ICMP port unreachable for
                      UDP) is returned to the sender, whereas with block the
                      packet is dropped silently. In either case, the original
                      packet is discarded.
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>Disabled</span>
                  </label>
                  <div className="checkbox col-sm-10">
                    <label className="chkboxlbl">
                      <input
                        name="disabled"
                        id="disabled"
                        type="checkbox"
                        checked={initialValues.disabled}
                        onChange={(e) => setInitialValues(e.target.value)}
                      />
                      Disable this rule
                    </label>

                    <span className="help-block">
                      Set this option to disable this rule without removing it
                      from the list.
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>Quick</span>
                  </label>
                  <div className="checkbox col-sm-10">
                    <label className="chkboxlbl">
                      <input
                        name="quick"
                        id="quick"
                        type="checkbox"
                        checked={initialValues.quick}
                        onChange={(e) => setInitialValues(e.target.value)}
                      />
                      Apply the action immediately on match.
                    </label>

                    <span className="help-block">
                      Set this option to apply this action to traffic that
                      matches this rule immediately.
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span className="element-required">Interface</span>
                  </label>
                  <div className="col-sm-10">
                    <select
                      className="form-control"
                      name="interface[]"
                      id="interface[]"
                      multiple="multiple"
                      value={initialValues.interface}
                      onChange={(e) => setInitialValues(e.target.value)}
                    >
                      <option value="WAN">WAN</option>
                      <option value="LAN">LAN</option>
                    </select>

                    <span className="help-block">
                      Choose the interface(s) for this rule.
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span className="element-required">Direction</span>
                  </label>
                  <div className="col-sm-10">
                    <select
                      className="form-control"
                      name="direction"
                      id="direction"
                      value={initialValues.direction}
                      onChange={(e) => setInitialValues(e.target.value)}
                    >
                      <option value="any">any</option>
                      <option value="in">in</option>
                      <option value="out">out</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span className="element-required">Address Family</span>
                  </label>
                  <div className="col-sm-10">
                    <select
                      className="form-control"
                      name="ipprotocol"
                      id="ipprotocol"
                      value={initialValues.addressFamily}
                      onChange={(e) => setInitialValues(e.target.value)}
                    >
                      <option value="IPv4">IPv4</option>
                      <option value="IPv6">IPv6</option>
                      <option value="IPv4+IPv6">IPv4+IPv6</option>
                    </select>

                    <span className="help-block">
                      Select the Internet Protocol version this rule applies to.
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span className="element-required">Protocol</span>
                  </label>
                  <div className="col-sm-10">
                    <select
                      className="form-control"
                      name="proto"
                      id="proto"
                      value={initialValues.protocol}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                        protochange();
                      }}
                    >
                      <option value="Any">Any</option>
                      <option value="TCP" selected="">
                        TCP
                      </option>
                      <option value="UDP">UDP</option>
                      <option value="TCP/UDP">TCP/UDP</option>
                      <option value="ICMP">ICMP</option>
                      <option value="ESP">ESP</option>
                      <option value="AH">AH</option>
                      <option value="GRE">GRE</option>
                      <option value="EoIP">EoIP</option>
                      <option value="IPV6">IPV6</option>
                      <option value="IGMP">IGMP</option>
                      <option value="PIM">PIM</option>
                      <option value="OSPF">OSPF</option>
                      <option value="SCTP">SCTP</option>
                      <option value="CARP">CARP</option>
                      <option value="PFSYNC">PFSYNC</option>
                    </select>

                    <span className="help-block">
                      Choose which IP protocol this rule should match.
                    </span>
                  </div>
                </div>
                <div
                  className="form-group icmptype_section"
                  style={{ display: icmpblock }}
                >
                  <label className="col-sm-2 control-label">
                    <span>ICMP Subtypes</span>
                  </label>
                  <div className="col-sm-10">
                    <select
                      id="icmptype[]"
                      name="icmptype[]"
                      className="form-control"
                      multiple="multiple"
                      value={initialValues.icmpSubtypes}
                      onChange={(e) => setInitialValues(e.target.value)}
                    >
                      <option value="any">any</option>
                      <option value="Alternate Host">Alternate Host</option>
                      <option value="Datagram conversion error">
                        Datagram conversion error
                      </option>
                      <option value="Echo reply">Echo reply</option>
                      <option value="Echo request">Echo request</option>
                      <option value="Information reply">
                        Information reply
                      </option>
                      <option value="Information request">
                        Information request
                      </option>
                      <option value="IPv6 I-am-here">IPv6 I-am-here</option>
                      <option value="IPv6 where-are-you">
                        IPv6 where-are-you
                      </option>
                      <option value="Address mask reply">
                        Address mask reply
                      </option>
                      <option value="Address mask request">
                        Address mask request
                      </option>
                      <option value="Mobile host redirect">
                        Mobile host redirect
                      </option>
                      <option value="Mobile registration reply">
                        Mobile registration reply
                      </option>
                      <option value="Mobile registration request">
                        Mobile registration request
                      </option>
                      <option value="Parameter problem (invalid IP header)">
                        Parameter problem (invalid IP header)
                      </option>
                      <option value="Photuris">Photuris</option>
                      <option value="Redirect">Redirect</option>
                      <option value="Router advertisement">
                        Router advertisement
                      </option>
                      <option value="Router solicitation">
                        Router solicitation
                      </option>
                      <option value="SKIP">SKIP</option>
                      <option value="Source quench">Source quench</option>
                      <option value="Timestamp reply">Timestamp reply</option>
                      <option value="Timestamp">Timestamp</option>
                      <option value="Time exceeded">Time exceeded</option>
                      <option value="Traceroute">Traceroute</option>
                      <option value="Destination unreachable">
                        Destination unreachable
                      </option>
                    </select>

                    <span className="help-block">
                      <div id="icmptype_help">
                        For ICMP rules on IPv4, one or more of these ICMP
                        subtypes may be specified.
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h2 className="panel-title">Source</h2>
              </div>
              <div className="panel-body">
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span className="element-required">Source</span>
                  </label>
                  <div className="checkbox col-sm-2">
                    <label className="chkboxlbl">
                      <input
                        name="srcnot"
                        id="srcnot"
                        type="checkbox"
                        checked={initialValues.sInvertMatch}
                        onChange={(e) => setInitialValues(e.target.value)}
                      />
                      Invert match
                    </label>
                  </div>
                  <div className="col-sm-4">
                    <select
                      className="form-control"
                      name="srctype"
                      id="srctype"
                      value={initialValues.sAny}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                        srctypefun();
                      }}
                    >
                      <option value="any">any</option>
                      <option value="Single host or alias">
                        Single host or alias
                      </option>
                      <option value="Network">Network</option>
                      <option value="This Firewall (self)">
                        This Firewall (self)
                      </option>
                      <option value="PPPoE clients">PPPoE clients</option>
                      <option value="L2TP clients">L2TP clients</option>
                      <option value="WAN net">WAN net</option>
                      <option value="WAN address">WAN address</option>
                      <option value="LAN net">LAN net</option>
                      <option value="LAN address">LAN address</option>
                    </select>
                  </div>
                  <div className="col-sm-4">
                    <div className="input-group">
                      <input
                        className="form-control ui-autocomplete-input"
                        name="src"
                        id="src"
                        title="An IPv4 address like 1.2.3.4 or an IPv6 address like 1:2a:3b:ffff::1 or an alias"
                        type="text"
                        placeholder="Source Address"
                        disabled={ipsrctypval}
                        value={initialValues.sAddress}
                        onChange={(e) => setInitialValues(e.target.value)}
                      />
                      <span className="input-group-addon input-group-inbetween pfIpMask">
                        /
                      </span>
                      <select
                        className="form-control pfIpMask"
                        name="srcmask"
                        id="srcmask"
                        disabled={srcmaskval}
                        value={initialValues.sPort}
                        onChange={(e) => setInitialValues(e.target.value)}
                      >
                        <option value="32">32</option>
                        <option value="31">31</option>
                        <option value="30">30</option>
                        <option value="29">29</option>
                        <option value="28">28</option>
                        <option value="27">27</option>
                        <option value="26">26</option>
                        <option value="25">25</option>
                        <option value="24">24</option>
                        <option value="23">23</option>
                        <option value="22">22</option>
                        <option value="21">21</option>
                        <option value="20">20</option>
                        <option value="19">19</option>
                        <option value="18">18</option>
                        <option value="17">17</option>
                        <option value="16">16</option>
                        <option value="15">15</option>
                        <option value="14">14</option>
                        <option value="13">13</option>
                        <option value="12">12</option>
                        <option value="11">11</option>
                        <option value="10">10</option>
                        <option value="9">9</option>
                        <option value="8">8</option>
                        <option value="7">7</option>
                        <option value="6">6</option>
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label"></label>
                  <div className="col-sm-10">
                    <button
                      className="btn btn-info btn-sm"
                      type="button"
                      value=""
                      name="btnsrctoggle"
                      id="btnsrctoggle"
                      onClick={() => {
                        dispadvan1();
                        distextf1();
                      }}
                      style={{ display: disstyl1 }}
                    >
                      <i className="fa fa-cog"></i> {distext1}
                    </button>

                    <span className="help-block">
                      The <b>Source Port Range</b> for a connection is typically
                      random and almost never equal to the destination port. In
                      most cases this setting must remain at its default value,
                      <b>any</b>.
                    </span>
                  </div>
                </div>
                <div
                  className="form-group srcportrange srcprtr"
                  style={{ display: srcprtrange }}
                >
                  <label className="col-sm-2 control-label">
                    <span>Source Port Range</span>
                  </label>
                  <div className="col-sm-2">
                    <select
                      className="form-control"
                      name="srcbeginport"
                      id="srcbeginport"
                      value={initialValues.sprFrom}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                        srcfromfun();
                      }}
                    >
                      <option value="(other)">(other)</option>
                      <option value="any">any</option>
                      <option value="BGP (179)">BGP (179)</option>
                      <option value="CVSup (5999)">CVSup (5999)</option>
                      <option value="DNS (53)">DNS (53)</option>
                      <option value="DNS over TLS (853)">
                        DNS over TLS (853)
                      </option>
                      <option value="FTP (21)">FTP (21)</option>
                      <option value="HBCI (3000)">HBCI (3000)</option>
                      <option value="HTTP (80)">HTTP (80)</option>
                      <option value="HTTPS (443)">HTTPS (443)</option>
                      <option value="ICQ (5190)">ICQ (5190)</option>
                      <option value="IDENT/AUTH (113)">IDENT/AUTH (113)</option>
                      <option value="IMAP (143)">IMAP (143)</option>
                      <option value="IMAP/S (993)">IMAP/S (993)</option>
                      <option value="IPsec NAT-T (4500)">
                        IPsec NAT-T (4500)
                      </option>
                      <option value="ISAKMP (500)">ISAKMP (500)</option>
                      <option value="L2TP (1701)">L2TP (1701)</option>
                      <option value="LDAP (389)">LDAP (389)</option>
                      <option value="LDAP/S (636)">LDAP/S (636)</option>
                      <option value="MMS/TCP (1755)">MMS/TCP (1755)</option>
                      <option value="MMS/UDP (7000)">MMS/UDP (7000)</option>
                      <option value="MS DS (445)">MS DS (445)</option>
                      <option value="MS RDP (3389)">MS RDP (3389)</option>
                      <option value="MS WINS (1512)">MS WINS (1512)</option>
                      <option value="MSN (1863)">MSN (1863)</option>
                      <option value="NNTP (119)">NNTP (119)</option>
                      <option value="NTP (123)">NTP (123)</option>
                      <option value="NetBIOS-DGM (138)">
                        NetBIOS-DGM (138)
                      </option>
                      <option value="NetBIOS-NS (137)">NetBIOS-NS (137)</option>
                      <option value="NetBIOS-SSN (139)">
                        NetBIOS-SSN (139)
                      </option>
                      <option value="OpenVPN (1194)">OpenVPN (1194)</option>
                      <option value="POP3 (110)">POP3 (110)</option>
                      <option value="POP3/S (995)">POP3/S (995)</option>
                      <option value="PPTP (1723)">PPTP (1723)</option>
                      <option value="RADIUS (1812)">RADIUS (1812)</option>
                      <option value="RADIUS accounting (1813)">
                        RADIUS accounting (1813)
                      </option>
                      <option value="RTP (5004)">RTP (5004)</option>
                      <option value="SIP (5060)">SIP (5060)</option>
                      <option value="SMTP (25)">SMTP (25)</option>
                      <option value="SMTP/S (465)">SMTP/S (465)</option>
                      <option value="SNMP (161)">SNMP (161)</option>
                      <option value="SNMP-Trap (162)">SNMP-Trap (162)</option>
                      <option value="SSH (22)">SSH (22)</option>
                      <option value="STUN (3478)">STUN (3478)</option>
                      <option value="SUBMISSION (587)">SUBMISSION (587)</option>
                      <option value="Syslog (514)">Syslog (514)</option>
                      <option value="Teredo (3544)">Teredo (3544)</option>
                      <option value="Telnet (23)">Telnet (23)</option>
                      <option value="TFTP (69)">TFTP (69)</option>
                      <option value="VNC (5900)">VNC (5900)</option>
                    </select>

                    <span className="help-block">From</span>
                  </div>
                  <div className="col-sm-2">
                    <input
                      className="form-control ui-autocomplete-input"
                      name="srcbeginport_cust"
                      id="srcbeginport_cust"
                      type="text"
                      disabled={srcfrom}
                      value={initialValues.sprFromCustom}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                      }}
                    />

                    <span className="help-block">Custom</span>
                  </div>
                  <div className="col-sm-2">
                    <select
                      className="form-control"
                      name="srcendport"
                      id="srcendport"
                      value={initialValues.sprTo}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                        srctofun();
                      }}
                    >
                      <option value="(other)">(other)</option>
                      <option value="any">any</option>
                      <option value="BGP (179)">BGP (179)</option>
                      <option value="CVSup (5999)">CVSup (5999)</option>
                      <option value="DNS (53)">DNS (53)</option>
                      <option value="DNS over TLS (853)">
                        DNS over TLS (853)
                      </option>
                      <option value="FTP (21)">FTP (21)</option>
                      <option value="HBCI (3000)">HBCI (3000)</option>
                      <option value="HTTP (80)">HTTP (80)</option>
                      <option value="HTTPS (443)">HTTPS (443)</option>
                      <option value="ICQ (5190)">ICQ (5190)</option>
                      <option value="IDENT/AUTH (113)">IDENT/AUTH (113)</option>
                      <option value="IMAP (143)">IMAP (143)</option>
                      <option value="IMAP/S (993)">IMAP/S (993)</option>
                      <option value="IPsec NAT-T (4500)">
                        IPsec NAT-T (4500)
                      </option>
                      <option value="ISAKMP (500)">ISAKMP (500)</option>
                      <option value="L2TP (1701)">L2TP (1701)</option>
                      <option value="LDAP (389)">LDAP (389)</option>
                      <option value="LDAP/S (636)">LDAP/S (636)</option>
                      <option value="MMS/TCP (1755)">MMS/TCP (1755)</option>
                      <option value="MMS/UDP (7000)">MMS/UDP (7000)</option>
                      <option value="MS DS (445)">MS DS (445)</option>
                      <option value="MS RDP (3389)">MS RDP (3389)</option>
                      <option value="MS WINS (1512)">MS WINS (1512)</option>
                      <option value="MSN (1863)">MSN (1863)</option>
                      <option value="NNTP (119)">NNTP (119)</option>
                      <option value="NTP (123)">NTP (123)</option>
                      <option value="NetBIOS-DGM (138)">
                        NetBIOS-DGM (138)
                      </option>
                      <option value="NetBIOS-NS (137)">NetBIOS-NS (137)</option>
                      <option value="NetBIOS-SSN (139)">
                        NetBIOS-SSN (139)
                      </option>
                      <option value="OpenVPN (1194)">OpenVPN (1194)</option>
                      <option value="POP3 (110)">POP3 (110)</option>
                      <option value="POP3/S (995)">POP3/S (995)</option>
                      <option value="PPTP (1723)">PPTP (1723)</option>
                      <option value="RADIUS (1812)">RADIUS (1812)</option>
                      <option value="RADIUS accounting (1813)">
                        RADIUS accounting (1813)
                      </option>
                      <option value="RTP (5004)">RTP (5004)</option>
                      <option value="SIP (5060)">SIP (5060)</option>
                      <option value="SMTP (25)">SMTP (25)</option>
                      <option value="SMTP/S (465)">SMTP/S (465)</option>
                      <option value="SNMP (161)">SNMP (161)</option>
                      <option value="SNMP-Trap (162)">SNMP-Trap (162)</option>
                      <option value="SSH (22)">SSH (22)</option>
                      <option value="STUN (3478)">STUN (3478)</option>
                      <option value="SUBMISSION (587)">SUBMISSION (587)</option>
                      <option value="Syslog (514)">Syslog (514)</option>
                      <option value="Teredo (3544)">Teredo (3544)</option>
                      <option value="Telnet (23)">Telnet (23)</option>
                      <option value="TFTP (69)">TFTP (69)</option>
                      <option value="VNC (5900)">VNC (5900)</option>
                    </select>

                    <span className="help-block">To</span>
                  </div>
                  <div className="col-sm-2">
                    <input
                      className="form-control ui-autocomplete-input"
                      name="srcendport_cust"
                      id="srcendport_cust"
                      type="text"
                      disabled={srcto}
                      value={initialValues.sprToCustom}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                      }}
                    />

                    <span className="help-block">Custom</span>
                  </div>
                  <div className="col-sm-10 col-sm-offset-2">
                    <span className="help-block">
                      Specify the source port or port range for this rule. The
                      "To" field may be left empty if only filtering a single
                      port.
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h2 className="panel-title">Destination</h2>
              </div>
              <div className="panel-body">
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span className="element-required">Destination</span>
                  </label>
                  <div className="checkbox col-sm-2">
                    <label className="chkboxlbl">
                      <input
                        name="dstnot"
                        id="dstnot"
                        type="checkbox"
                        checked={initialValues.dInvertMatch}
                        onChange={(e) => {
                          setInitialValues(e.target.value);
                        }}
                      />
                      Invert match
                    </label>
                  </div>
                  <div className="col-sm-4">
                    <select
                      className="form-control"
                      name="dsttype"
                      id="dsttype"
                      value={initialValues.dAny}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                        destypefun();
                      }}
                    >
                      <option value="any">any</option>
                      <option value="Single host or alias">
                        Single host or alias
                      </option>
                      <option value="Network">Network</option>
                      <option value="This Firewall (self)">
                        This Firewall (self)
                      </option>
                      <option value="PPPoE clients">PPPoE clients</option>
                      <option value="L2TP clients">L2TP clients</option>
                      <option value="WAN net">WAN net</option>
                      <option value="WAN address">WAN address</option>
                      <option value="LAN net">LAN net</option>
                      <option value="LAN address">LAN address</option>
                    </select>
                  </div>
                  <div className="col-sm-4">
                    <div className="input-group">
                      <input
                        className="form-control ui-autocomplete-input"
                        name="dst"
                        id="dst"
                        title="An IPv4 address like 1.2.3.4 or an IPv6 address like 1:2a:3b:ffff::1 or an alias"
                        type="text"
                        placeholder="Destination Address"
                        disabled={ipdestypval}
                        value={initialValues.dAddress}
                        onChange={(e) => {
                          setInitialValues(e.target.value);
                        }}
                      />
                      <span className="input-group-addon input-group-inbetween pfIpMask">
                        /
                      </span>
                      <select
                        className="form-control pfIpMask"
                        name="dstmask"
                        id="dstmask"
                        disabled={desmaskval}
                        value={initialValues.dPort}
                        onChange={(e) => {
                          setInitialValues(e.target.value);
                        }}
                      >
                        <option value="32">32</option>
                        <option value="31">31</option>
                        <option value="30">30</option>
                        <option value="29">29</option>
                        <option value="28">28</option>
                        <option value="27">27</option>
                        <option value="26">26</option>
                        <option value="25">25</option>
                        <option value="24">24</option>
                        <option value="23">23</option>
                        <option value="22">22</option>
                        <option value="21">21</option>
                        <option value="20">20</option>
                        <option value="19">19</option>
                        <option value="18">18</option>
                        <option value="17">17</option>
                        <option value="16">16</option>
                        <option value="15">15</option>
                        <option value="14">14</option>
                        <option value="13">13</option>
                        <option value="12">12</option>
                        <option value="11">11</option>
                        <option value="10">10</option>
                        <option value="9">9</option>
                        <option value="8">8</option>
                        <option value="7">7</option>
                        <option value="6">6</option>
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div
                  className="form-group dstportrange dstprtr"
                  style={{ display: dstprtr1 }}
                >
                  <label className="col-sm-2 control-label">
                    <span>Destination Port Range</span>
                  </label>
                  <div className="col-sm-2">
                    <select
                      className="form-control"
                      name="dstbeginport"
                      id="dstbeginport"
                      value={initialValues.dptFrom}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                        dstfromfun();
                      }}
                    >
                      <option value="(other)">(other)</option>
                      <option value="any">any</option>
                      <option value="BGP (179)">BGP (179)</option>
                      <option value="CVSup (5999)">CVSup (5999)</option>
                      <option value="DNS (53)">DNS (53)</option>
                      <option value="DNS over TLS (853)">
                        DNS over TLS (853)
                      </option>
                      <option value="FTP (21)">FTP (21)</option>
                      <option value="HBCI (3000)">HBCI (3000)</option>
                      <option value="HTTP (80)">HTTP (80)</option>
                      <option value="HTTPS (443)">HTTPS (443)</option>
                      <option value="ICQ (5190)">ICQ (5190)</option>
                      <option value="IDENT/AUTH (113)">IDENT/AUTH (113)</option>
                      <option value="IMAP (143)">IMAP (143)</option>
                      <option value="IMAP/S (993)">IMAP/S (993)</option>
                      <option value="IPsec NAT-T (4500)">
                        IPsec NAT-T (4500)
                      </option>
                      <option value="ISAKMP (500)">ISAKMP (500)</option>
                      <option value="L2TP (1701)">L2TP (1701)</option>
                      <option value="LDAP (389)">LDAP (389)</option>
                      <option value="LDAP/S (636)">LDAP/S (636)</option>
                      <option value="MMS/TCP (1755)">MMS/TCP (1755)</option>
                      <option value="MMS/UDP (7000)">MMS/UDP (7000)</option>
                      <option value="MS DS (445)">MS DS (445)</option>
                      <option value="MS RDP (3389)">MS RDP (3389)</option>
                      <option value="MS WINS (1512)">MS WINS (1512)</option>
                      <option value="MSN (1863)">MSN (1863)</option>
                      <option value="NNTP (119)">NNTP (119)</option>
                      <option value="NTP (123)">NTP (123)</option>
                      <option value="NetBIOS-DGM (138)">
                        NetBIOS-DGM (138)
                      </option>
                      <option value="NetBIOS-NS (137)">NetBIOS-NS (137)</option>
                      <option value="NetBIOS-SSN (139)">
                        NetBIOS-SSN (139)
                      </option>
                      <option value="OpenVPN (1194)">OpenVPN (1194)</option>
                      <option value="POP3 (110)">POP3 (110)</option>
                      <option value="POP3/S (995)">POP3/S (995)</option>
                      <option value="PPTP (1723)">PPTP (1723)</option>
                      <option value="RADIUS (1812)">RADIUS (1812)</option>
                      <option value="RADIUS accounting (1813)">
                        RADIUS accounting (1813)
                      </option>
                      <option value="RTP (5004)">RTP (5004)</option>
                      <option value="SIP (5060)">SIP (5060)</option>
                      <option value="SMTP (25)">SMTP (25)</option>
                      <option value="SMTP/S (465)">SMTP/S (465)</option>
                      <option value="SNMP (161)">SNMP (161)</option>
                      <option value="SNMP-Trap (162)">SNMP-Trap (162)</option>
                      <option value="SSH (22)">SSH (22)</option>
                      <option value="STUN (3478)">STUN (3478)</option>
                      <option value="SUBMISSION (587)">SUBMISSION (587)</option>
                      <option value="Syslog (514)">Syslog (514)</option>
                      <option value="Teredo (3544)">Teredo (3544)</option>
                      <option value="Telnet (23)">Telnet (23)</option>
                      <option value="TFTP (69)">TFTP (69)</option>
                      <option value="VNC (5900)">VNC (5900)</option>
                    </select>

                    <span className="help-block">From</span>
                  </div>
                  <div className="col-sm-2">
                    <input
                      className="form-control ui-autocomplete-input"
                      name="dstbeginport_cust"
                      id="dstbeginport_cust"
                      type="text"
                      disabled={dstfrom}
                      value={initialValues.dptFromCustom}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                      }}
                    />

                    <span className="help-block">Custom</span>
                  </div>
                  <div className="col-sm-2">
                    <select
                      className="form-control"
                      name="dstendport"
                      id="dstendport"
                      value={initialValues.dptTo}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                        dsttofun();
                      }}
                    >
                      <option value="(other)">(other)</option>
                      <option value="any">any</option>
                      <option value="BGP (179)">BGP (179)</option>
                      <option value="CVSup (5999)">CVSup (5999)</option>
                      <option value="DNS (53)">DNS (53)</option>
                      <option value="DNS over TLS (853)">
                        DNS over TLS (853)
                      </option>
                      <option value="FTP (21)">FTP (21)</option>
                      <option value="HBCI (3000)">HBCI (3000)</option>
                      <option value="HTTP (80)">HTTP (80)</option>
                      <option value="HTTPS (443)">HTTPS (443)</option>
                      <option value="ICQ (5190)">ICQ (5190)</option>
                      <option value="IDENT/AUTH (113)">IDENT/AUTH (113)</option>
                      <option value="IMAP (143)">IMAP (143)</option>
                      <option value="IMAP/S (993)">IMAP/S (993)</option>
                      <option value="IPsec NAT-T (4500)">
                        IPsec NAT-T (4500)
                      </option>
                      <option value="ISAKMP (500)">ISAKMP (500)</option>
                      <option value="L2TP (1701)">L2TP (1701)</option>
                      <option value="LDAP (389)">LDAP (389)</option>
                      <option value="LDAP/S (636)">LDAP/S (636)</option>
                      <option value="MMS/TCP (1755)">MMS/TCP (1755)</option>
                      <option value="MMS/UDP (7000)">MMS/UDP (7000)</option>
                      <option value="MS DS (445)">MS DS (445)</option>
                      <option value="MS RDP (3389)">MS RDP (3389)</option>
                      <option value="MS WINS (1512)">MS WINS (1512)</option>
                      <option value="MSN (1863)">MSN (1863)</option>
                      <option value="NNTP (119)">NNTP (119)</option>
                      <option value="NTP (123)">NTP (123)</option>
                      <option value="NetBIOS-DGM (138)">
                        NetBIOS-DGM (138)
                      </option>
                      <option value="NetBIOS-NS (137)">NetBIOS-NS (137)</option>
                      <option value="NetBIOS-SSN (139)">
                        NetBIOS-SSN (139)
                      </option>
                      <option value="OpenVPN (1194)">OpenVPN (1194)</option>
                      <option value="POP3 (110)">POP3 (110)</option>
                      <option value="POP3/S (995)">POP3/S (995)</option>
                      <option value="PPTP (1723)">PPTP (1723)</option>
                      <option value="RADIUS (1812)">RADIUS (1812)</option>
                      <option value="RADIUS accounting (1813)">
                        RADIUS accounting (1813)
                      </option>
                      <option value="RTP (5004)">RTP (5004)</option>
                      <option value="SIP (5060)">SIP (5060)</option>
                      <option value="SMTP (25)">SMTP (25)</option>
                      <option value="SMTP/S (465)">SMTP/S (465)</option>
                      <option value="SNMP (161)">SNMP (161)</option>
                      <option value="SNMP-Trap (162)">SNMP-Trap (162)</option>
                      <option value="SSH (22)">SSH (22)</option>
                      <option value="STUN (3478)">STUN (3478)</option>
                      <option value="SUBMISSION (587)">SUBMISSION (587)</option>
                      <option value="Syslog (514)">Syslog (514)</option>
                      <option value="Teredo (3544)">Teredo (3544)</option>
                      <option value="Telnet (23)">Telnet (23)</option>
                      <option value="TFTP (69)">TFTP (69)</option>
                      <option value="VNC (5900)">VNC (5900)</option>
                    </select>

                    <span className="help-block">To</span>
                  </div>
                  <div className="col-sm-2">
                    <input
                      className="form-control ui-autocomplete-input"
                      name="dstendport_cust"
                      id="dstendport_cust"
                      type="text"
                      disabled={dstto}
                      value={initialValues.dptToCustom}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                      }}
                    />

                    <span className="help-block">Custom</span>
                  </div>
                  <div className="col-sm-10 col-sm-offset-2">
                    <span className="help-block">
                      Specify the destination port or port range for this rule.
                      The "To" field may be left empty if only filtering a
                      single port.
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h2 className="panel-title">Extra Options</h2>
              </div>
              <div className="panel-body">
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>Log</span>
                  </label>
                  <div className="checkbox col-sm-10">
                    <label className="chkboxlbl">
                      <input
                        name="log"
                        id="log"
                        type="checkbox"
                        checked={initialValues.log}
                        onChange={(e) => {
                          setInitialValues(e.target.value);
                        }}
                      />
                      Log packets that are handled by this rule
                    </label>

                    <span className="help-block">
                      Hint: the firewall has limited local log space. Don't turn
                      on logging for everything. If doing a lot of logging,
                      consider using a remote syslog server (see the
                      status_logs_settings.php Status: System Logs: Settings
                      page).
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>Description</span>
                  </label>
                  <div className="col-sm-10">
                    <input
                      className="form-control"
                      name="descr"
                      id="descr"
                      type="text"
                      value={initialValues.description}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                      }}
                    />

                    <span className="help-block">
                      A description may be entered here for administrative
                      reference. A maximum of 52 characters will be used in the
                      ruleset and displayed in the firewall log.
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>Advanced Options</span>
                  </label>
                  <div className="col-sm-10">
                    <button
                      className="btn btn-info btn-sm"
                      type="button"
                      value="Display Advanced"
                      name="btnadvopts"
                      id="btnadvopts"
                      onClick={() => {
                        dispadvan2();
                        distextf2();
                      }}
                    >
                      <i className="fa fa-cog"></i> {distext2}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="panel panel-default advanced-options"
              style={{ display: sourceos }}
            >
              <div className="panel-heading">
                <h2 className="panel-title">Advanced Options</h2>
              </div>
              <div className="panel-body">
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>Source OS</span>
                  </label>
                  <div className="col-sm-10">
                    <select
                      className="form-control"
                      name="os"
                      id="os"
                      disabled={os}
                      value={initialValues.sourceOs}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                      }}
                    >
                      <option value="Any">Any</option>
                      <option value="AIX">AIX</option>
                      <option value="AIX 4.3">AIX 4.3</option>
                      <option value="AIX 4.3 2">AIX 4.3 2</option>
                      <option value="AIX 4.3 2-3">AIX 4.3 2-3</option>
                      <option value="AIX 4.3 3">AIX 4.3 3</option>
                      <option value="AIX 5.1">AIX 5.1</option>
                      <option value="AIX 5.1-5.2">AIX 5.1-5.2</option>
                      <option value="AIX 5.2">AIX 5.2</option>
                      <option value="AIX 5.3">AIX 5.3</option>
                      <option value="AIX 5.3 ML1">AIX 5.3 ML1</option>
                      <option value="Alteon">Alteon</option>
                      <option value="Alteon ACEswitch">Alteon ACEswitch</option>
                      <option value="AMIGAOS">AMIGAOS</option>
                      <option value="AMIGAOS 3.9">AMIGAOS 3.9</option>
                      <option value="AOL">AOL</option>
                      <option value="AOL web cache">AOL web cache</option>
                      <option value="AXIS">AXIS</option>
                      <option value="AXIS 5600">AXIS 5600</option>
                      <option value="AXIS 5600 v5.64">AXIS 5600 v5.64</option>
                      <option value="BeOS">BeOS</option>
                      <option value="BeOS 5.0">BeOS 5.0</option>
                      <option value="BeOS 5.0-5.1">BeOS 5.0-5.1</option>
                      <option value="BeOS 5.1">BeOS 5.1</option>
                      <option value="BSD/OS">BSD/OS</option>
                      <option value="BSD/OS 3.1">BSD/OS 3.1</option>
                      <option value="BSD/OS 4.0">BSD/OS 4.0</option>
                      <option value="BSD/OS 4.0-4.3">BSD/OS 4.0-4.3</option>
                      <option value="BSD/OS 4.1">BSD/OS 4.1</option>
                      <option value="BSD/OS 4.2">BSD/OS 4.2</option>
                      <option value="BSD/OS 4.3">BSD/OS 4.3</option>
                      <option value="CacheFlow">CacheFlow</option>
                      <option value="CacheFlow 1.1">CacheFlow 1.1</option>
                      <option value="CacheFlow 4.1">CacheFlow 4.1</option>
                      <option value="Checkpoint">Checkpoint</option>
                      <option value="Cisco">Cisco</option>
                      <option value="Cisco 12008">Cisco 12008</option>
                      <option value="Cisco Content Engine">
                        Cisco Content Engine
                      </option>
                      <option value="Contiki">Contiki</option>
                      <option value="Contiki 1.1">Contiki 1.1</option>
                      <option value="Contiki 1.1 rc0">Contiki 1.1 rc0</option>
                      <option value="Dell">Dell</option>
                      <option value="Dell PowerApp cache">
                        Dell PowerApp cache
                      </option>
                      <option value="DOS">DOS</option>
                      <option value="DOS WATTCP">DOS WATTCP</option>
                      <option value="DOS WATTCP 1.05">DOS WATTCP 1.05</option>
                      <option value="DOS WATTCP 1.05Arachne">
                        DOS WATTCP 1.05Arachne
                      </option>
                      <option value="DragonFly">DragonFly</option>
                      <option value="DragonFly 1.0">DragonFly 1.0</option>
                      <option value="DragonFly 1.0 A">DragonFly 1.0 A</option>
                      <option value="DragonFly 1.10">DragonFly 1.10</option>
                      <option value="DragonFly 1.11">DragonFly 1.11</option>
                      <option value="DragonFly 1.12">DragonFly 1.12</option>
                      <option value="DragonFly 1.2">DragonFly 1.2</option>
                      <option value="DragonFly 1.2-1.12">
                        DragonFly 1.2-1.12
                      </option>
                      <option value="DragonFly 1.3">DragonFly 1.3</option>
                      <option value="DragonFly 1.4">DragonFly 1.4</option>
                      <option value="DragonFly 1.5">DragonFly 1.5</option>
                      <option value="DragonFly 1.6">DragonFly 1.6</option>
                      <option value="DragonFly 1.7">DragonFly 1.7</option>
                      <option value="DragonFly 1.8">DragonFly 1.8</option>
                      <option value="DragonFly 1.9">DragonFly 1.9</option>
                      <option value="DragonFly 2.0">DragonFly 2.0</option>
                      <option value="DragonFly 2.0-2.1">
                        DragonFly 2.0-2.1
                      </option>
                      <option value="DragonFly 2.1">DragonFly 2.1</option>
                      <option value="DragonFly 2.2">DragonFly 2.2</option>
                      <option value="DragonFly 2.2-2.3">
                        DragonFly 2.2-2.3
                      </option>
                      <option value="DragonFly 2.3">DragonFly 2.3</option>
                      <option value="DragonFly 2.4">DragonFly 2.4</option>
                      <option value="DragonFly 2.4-2.7">
                        DragonFly 2.4-2.7
                      </option>
                      <option value="DragonFly 2.5">DragonFly 2.5</option>
                      <option value="DragonFly 2.6">DragonFly 2.6</option>
                      <option value="DragonFly 2.7">DragonFly 2.7</option>
                      <option value="Eagle">Eagle</option>
                      <option value="ExtremeWare">ExtremeWare</option>
                      <option value="ExtremeWare 4.x">ExtremeWare 4.x</option>
                      <option value="FortiNet">FortiNet</option>
                      <option value="FortiNet FortiGate">
                        FortiNet FortiGate
                      </option>
                      <option value="FortiNet FortiGate 50">
                        FortiNet FortiGate 50
                      </option>
                      <option value="FreeBSD">FreeBSD</option>
                      <option value="FreeBSD 2.0">FreeBSD 2.0</option>
                      <option value="FreeBSD 2.0-2.2">FreeBSD 2.0-2.2</option>
                      <option value="FreeBSD 2.1">FreeBSD 2.1</option>
                      <option value="FreeBSD 2.2">FreeBSD 2.2</option>
                      <option value="FreeBSD 3.0">FreeBSD 3.0</option>
                      <option value="FreeBSD 3.0-3.5">FreeBSD 3.0-3.5</option>
                      <option value="FreeBSD 3.1">FreeBSD 3.1</option>
                      <option value="FreeBSD 3.2">FreeBSD 3.2</option>
                      <option value="FreeBSD 3.3">FreeBSD 3.3</option>
                      <option value="FreeBSD 3.4">FreeBSD 3.4</option>
                      <option value="FreeBSD 3.5">FreeBSD 3.5</option>
                      <option value="FreeBSD 4.0">FreeBSD 4.0</option>
                      <option value="FreeBSD 4.0-4.2">FreeBSD 4.0-4.2</option>
                      <option value="FreeBSD 4.1">FreeBSD 4.1</option>
                      <option value="FreeBSD 4.10">FreeBSD 4.10</option>
                      <option value="FreeBSD 4.11">FreeBSD 4.11</option>
                      <option value="FreeBSD 4.2">FreeBSD 4.2</option>
                      <option value="FreeBSD 4.4">FreeBSD 4.4</option>
                      <option value="FreeBSD 4.6">FreeBSD 4.6</option>
                      <option value="FreeBSD 4.6 noRFC1323">
                        FreeBSD 4.6 noRFC1323
                      </option>
                      <option value="FreeBSD 4.6-4.8">FreeBSD 4.6-4.8</option>
                      <option value="FreeBSD 4.6-4.8 noRFC1323">
                        FreeBSD 4.6-4.8 noRFC1323
                      </option>
                      <option value="FreeBSD 4.6-4.9">FreeBSD 4.6-4.9</option>
                      <option value="FreeBSD 4.7">FreeBSD 4.7</option>
                      <option value="FreeBSD 4.7 noRFC1323">
                        FreeBSD 4.7 noRFC1323
                      </option>
                      <option value="FreeBSD 4.7-4.11">FreeBSD 4.7-4.11</option>
                      <option value="FreeBSD 4.8">FreeBSD 4.8</option>
                      <option value="FreeBSD 4.8 noRFC1323">
                        FreeBSD 4.8 noRFC1323
                      </option>
                      <option value="FreeBSD 4.8-4.11">FreeBSD 4.8-4.11</option>
                      <option value="FreeBSD 4.9">FreeBSD 4.9</option>
                      <option value="FreeBSD 5.0">FreeBSD 5.0</option>
                      <option value="FreeBSD 5.0-5.1">FreeBSD 5.0-5.1</option>
                      <option value="FreeBSD 5.0-5.2">FreeBSD 5.0-5.2</option>
                      <option value="FreeBSD 5.1">FreeBSD 5.1</option>
                      <option value="FreeBSD 5.2">FreeBSD 5.2</option>
                      <option value="FreeMiNT">FreeMiNT</option>
                      <option value="FreeMiNT 1">FreeMiNT 1</option>
                      <option value="FreeMiNT 1 16A">FreeMiNT 1 16A</option>
                      <option value="HP-UX">HP-UX</option>
                      <option value="HP-UX 11.0">HP-UX 11.0</option>
                      <option value="HP-UX 11.10">HP-UX 11.10</option>
                      <option value="HP-UX 11.11">HP-UX 11.11</option>
                      <option value="HP-UX B.10.20">HP-UX B.10.20</option>
                      <option value="HP-UX B.11.00">HP-UX B.11.00</option>
                      <option value="HP-UX B.11.00 A">HP-UX B.11.00 A</option>
                      <option value="Inktomi">Inktomi</option>
                      <option value="Inktomi crawler">Inktomi crawler</option>
                      <option value="IRIX">IRIX</option>
                      <option value="IRIX 6.2">IRIX 6.2</option>
                      <option value="IRIX 6.2-6.5">IRIX 6.2-6.5</option>
                      <option value="IRIX 6.3">IRIX 6.3</option>
                      <option value="IRIX 6.4">IRIX 6.4</option>
                      <option value="IRIX 6.5">IRIX 6.5</option>
                      <option value="IRIX 6.5 12">IRIX 6.5 12</option>
                      <option value="IRIX 6.5 12-21">IRIX 6.5 12-21</option>
                      <option value="IRIX 6.5 13">IRIX 6.5 13</option>
                      <option value="IRIX 6.5 14">IRIX 6.5 14</option>
                      <option value="IRIX 6.5 15">IRIX 6.5 15</option>
                      <option value="IRIX 6.5 15-21">IRIX 6.5 15-21</option>
                      <option value="IRIX 6.5 16">IRIX 6.5 16</option>
                      <option value="IRIX 6.5 17">IRIX 6.5 17</option>
                      <option value="IRIX 6.5 18">IRIX 6.5 18</option>
                      <option value="IRIX 6.5 19">IRIX 6.5 19</option>
                      <option value="IRIX 6.5 20">IRIX 6.5 20</option>
                      <option value="IRIX 6.5 21">IRIX 6.5 21</option>
                      <option value="IRIX 6.5 IP27">IRIX 6.5 IP27</option>
                      <option value="IRIX 6.5 RFC1323">IRIX 6.5 RFC1323</option>
                      <option value="LinkSys">LinkSys</option>
                      <option value="LinkSys WRV54G">LinkSys WRV54G</option>
                      <option value="Linux">Linux</option>
                      <option value="Linux 2.0">Linux 2.0</option>
                      <option value="Linux 2.0 3x">Linux 2.0 3x</option>
                      <option value="Linux 2.2">Linux 2.2</option>
                      <option value="Linux 2.2 20">Linux 2.2 20</option>
                      <option value="Linux 2.2 20-25">Linux 2.2 20-25</option>
                      <option value="Linux 2.2 21">Linux 2.2 21</option>
                      <option value="Linux 2.2 22">Linux 2.2 22</option>
                      <option value="Linux 2.2 23">Linux 2.2 23</option>
                      <option value="Linux 2.2 24">Linux 2.2 24</option>
                      <option value="Linux 2.2 25">Linux 2.2 25</option>
                      <option value="Linux 2.2 lo0">Linux 2.2 lo0</option>
                      <option value="Linux 2.2 Opera">Linux 2.2 Opera</option>
                      <option value="Linux 2.2 ts">Linux 2.2 ts</option>
                      <option value="Linux 2.4">Linux 2.4</option>
                      <option value="Linux 2.4 .18-21">Linux 2.4 .18-21</option>
                      <option value="Linux 2.4 cluster">
                        Linux 2.4 cluster
                      </option>
                      <option value="Linux 2.4 lo0">Linux 2.4 lo0</option>
                      <option value="Linux 2.4 Opera">Linux 2.4 Opera</option>
                      <option value="Linux 2.4 ts">Linux 2.4 ts</option>
                      <option value="Linux 2.5">Linux 2.5</option>
                      <option value="Linux 2.5-2.6">Linux 2.5-2.6</option>
                      <option value="Linux 2.6">Linux 2.6</option>
                      <option value="Linux 2.6 .1-7">Linux 2.6 .1-7</option>
                      <option value="Linux 3.0">Linux 3.0</option>
                      <option value="Linux google">Linux google</option>
                      <option value="LookSmart">LookSmart</option>
                      <option value="LookSmart ZyBorg">LookSmart ZyBorg</option>
                      <option value="MacOS">MacOS</option>
                      <option value="MacOS 7.3">MacOS 7.3</option>
                      <option value="MacOS 7.3 OTTCP">MacOS 7.3 OTTCP</option>
                      <option value="MacOS 7.3-7.6">MacOS 7.3-7.6</option>
                      <option value="MacOS 7.3-7.6 OTTCP">
                        MacOS 7.3-7.6 OTTCP
                      </option>
                      <option value="MacOS 7.4">MacOS 7.4</option>
                      <option value="MacOS 7.4 OTTCP">MacOS 7.4 OTTCP</option>
                      <option value="MacOS 7.5">MacOS 7.5</option>
                      <option value="MacOS 7.5 OTTCP">MacOS 7.5 OTTCP</option>
                      <option value="MacOS 7.6">MacOS 7.6</option>
                      <option value="MacOS 7.6 OTTCP">MacOS 7.6 OTTCP</option>
                      <option value="MacOS 8.0">MacOS 8.0</option>
                      <option value="MacOS 8.0 OTTCP">MacOS 8.0 OTTCP</option>
                      <option value="MacOS 8.0-8.6">MacOS 8.0-8.6</option>
                      <option value="MacOS 8.0-8.6 OTTCP">
                        MacOS 8.0-8.6 OTTCP
                      </option>
                      <option value="MacOS 8.1">MacOS 8.1</option>
                      <option value="MacOS 8.1 OTTCP">MacOS 8.1 OTTCP</option>
                      <option value="MacOS 8.1-8.6">MacOS 8.1-8.6</option>
                      <option value="MacOS 8.1-8.6 OTTCP">
                        MacOS 8.1-8.6 OTTCP
                      </option>
                      <option value="MacOS 8.2">MacOS 8.2</option>
                      <option value="MacOS 8.2 OTTCP">MacOS 8.2 OTTCP</option>
                      <option value="MacOS 8.3">MacOS 8.3</option>
                      <option value="MacOS 8.3 OTTCP">MacOS 8.3 OTTCP</option>
                      <option value="MacOS 8.4">MacOS 8.4</option>
                      <option value="MacOS 8.4 OTTCP">MacOS 8.4 OTTCP</option>
                      <option value="MacOS 8.5">MacOS 8.5</option>
                      <option value="MacOS 8.5 OTTCP">MacOS 8.5 OTTCP</option>
                      <option value="MacOS 8.6">MacOS 8.6</option>
                      <option value="MacOS 8.6 OTTCP">MacOS 8.6 OTTCP</option>
                      <option value="MacOS 9.0">MacOS 9.0</option>
                      <option value="MacOS 9.0-9.2">MacOS 9.0-9.2</option>
                      <option value="MacOS 9.1">MacOS 9.1</option>
                      <option value="MacOS 9.2">MacOS 9.2</option>
                      <option value="NAST">NAST</option>
                      <option value="NetApp">NetApp</option>
                      <option value="NetApp 4.1">NetApp 4.1</option>
                      <option value="NetApp 5.2">NetApp 5.2</option>
                      <option value="NetApp 5.2 1">NetApp 5.2 1</option>
                      <option value="NetApp 5.3">NetApp 5.3</option>
                      <option value="NetApp 5.3 1">NetApp 5.3 1</option>
                      <option value="NetApp 5.3-5.5">NetApp 5.3-5.5</option>
                      <option value="NetApp 5.4">NetApp 5.4</option>
                      <option value="NetApp 5.5">NetApp 5.5</option>
                      <option value="NetApp 5.x">NetApp 5.x</option>
                      <option value="NetApp CacheFlow">NetApp CacheFlow</option>
                      <option value="NetBSD">NetBSD</option>
                      <option value="NetBSD 1.3">NetBSD 1.3</option>
                      <option value="NetBSD 1.6">NetBSD 1.6</option>
                      <option value="NetBSD 1.6 df">NetBSD 1.6 df</option>
                      <option value="NetBSD 1.6 opera">NetBSD 1.6 opera</option>
                      <option value="NetBSD 1.6 randomization">
                        NetBSD 1.6 randomization
                      </option>
                      <option value="NewtonOS">NewtonOS</option>
                      <option value="NewtonOS 2.1">NewtonOS 2.1</option>
                      <option value="NeXTSTEP">NeXTSTEP</option>
                      <option value="NeXTSTEP 3.3">NeXTSTEP 3.3</option>
                      <option value="NMAP">NMAP</option>
                      <option value="NMAP OS">NMAP OS</option>
                      <option value="NMAP OS 1">NMAP OS 1</option>
                      <option value="NMAP OS 2">NMAP OS 2</option>
                      <option value="NMAP OS 3">NMAP OS 3</option>
                      <option value="NMAP OS 4">NMAP OS 4</option>
                      <option value="NMAP syn scan">NMAP syn scan</option>
                      <option value="NMAP syn scan 1">NMAP syn scan 1</option>
                      <option value="NMAP syn scan 2">NMAP syn scan 2</option>
                      <option value="NMAP syn scan 3">NMAP syn scan 3</option>
                      <option value="NMAP syn scan 4">NMAP syn scan 4</option>
                      <option value="Nortel">Nortel</option>
                      <option value="Nortel Contivity Client">
                        Nortel Contivity Client
                      </option>
                      <option value="Novell">Novell</option>
                      <option value="Novell BorderManager">
                        Novell BorderManager
                      </option>
                      <option value="Novell IntranetWare">
                        Novell IntranetWare
                      </option>
                      <option value="Novell IntranetWare 4.11">
                        Novell IntranetWare 4.11
                      </option>
                      <option value="Novell NetWare">Novell NetWare</option>
                      <option value="Novell NetWare 5.0">
                        Novell NetWare 5.0
                      </option>
                      <option value="Novell NetWare 6">Novell NetWare 6</option>
                      <option value="OpenBSD">OpenBSD</option>
                      <option value="OpenBSD 2.6">OpenBSD 2.6</option>
                      <option value="OpenBSD 3.0-4.0">OpenBSD 3.0-4.0</option>
                      <option value="OpenBSD 3.0-4.0 opera">
                        OpenBSD 3.0-4.0 opera
                      </option>
                      <option value="OpenBSD 3.0-4.8">OpenBSD 3.0-4.8</option>
                      <option value="OpenBSD 3.0-4.8 no-df">
                        OpenBSD 3.0-4.8 no-df
                      </option>
                      <option value="OpenBSD 3.3-4.0">OpenBSD 3.3-4.0</option>
                      <option value="OpenBSD 3.3-4.0 no-df">
                        OpenBSD 3.3-4.0 no-df
                      </option>
                      <option value="OpenBSD 4.9">OpenBSD 4.9</option>
                      <option value="OpenBSD 4.9 no-df">
                        OpenBSD 4.9 no-df
                      </option>
                      <option value="OpenBSD 6.1">OpenBSD 6.1</option>
                      <option value="OpenBSD 6.1 no-df">
                        OpenBSD 6.1 no-df
                      </option>
                      <option value="OpenVMS">OpenVMS</option>
                      <option value="OpenVMS 7.2">OpenVMS 7.2</option>
                      <option value="OS/2">OS/2</option>
                      <option value="OS/2 4">OS/2 4</option>
                      <option value="OS/400">OS/400</option>
                      <option value="OS/400 V4R5">OS/400 V4R5</option>
                      <option value="OS/400 V4R5 CF67032">
                        OS/400 V4R5 CF67032
                      </option>
                      <option value="OS/400 VR4">OS/400 VR4</option>
                      <option value="OS/400 VR5">OS/400 VR5</option>
                      <option value="PalmOS">PalmOS</option>
                      <option value="PalmOS 3">PalmOS 3</option>
                      <option value="PalmOS 3 5">PalmOS 3 5</option>
                      <option value="PalmOS 4">PalmOS 4</option>
                      <option value="PalmOS 5">PalmOS 5</option>
                      <option value="PalmOS 5.2">PalmOS 5.2</option>
                      <option value="PalmOS 5.2 Clie">PalmOS 5.2 Clie</option>
                      <option value="PalmOS 5.2 Treo">PalmOS 5.2 Treo</option>
                      <option value="PalmOS Tungsten">PalmOS Tungsten</option>
                      <option value="PalmOS Tungsten C">
                        PalmOS Tungsten C
                      </option>
                      <option value="Plan9">Plan9</option>
                      <option value="Plan9 4">Plan9 4</option>
                      <option value="PocketPC">PocketPC</option>
                      <option value="PocketPC 2002">PocketPC 2002</option>
                      <option value="Proxyblocker">Proxyblocker</option>
                      <option value="QNX">QNX</option>
                      <option value="Redline">Redline</option>
                      <option value="RISC OS">RISC OS</option>
                      <option value="RISC OS 3.70">RISC OS 3.70</option>
                      <option value="RISC OS 3.70 4.10">
                        RISC OS 3.70 4.10
                      </option>
                      <option value="SCO">SCO</option>
                      <option value="SCO OpenServer">SCO OpenServer</option>
                      <option value="SCO OpenServer 5.0">
                        SCO OpenServer 5.0
                      </option>
                      <option value="SCO UnixWare">SCO UnixWare</option>
                      <option value="SCO UnixWare 7.1">SCO UnixWare 7.1</option>
                      <option value="Sega">Sega</option>
                      <option value="Sega Dreamcast">Sega Dreamcast</option>
                      <option value="Sega Dreamcast 3.0">
                        Sega Dreamcast 3.0
                      </option>
                      <option value="Sega Dreamcast HKT-3020">
                        Sega Dreamcast HKT-3020
                      </option>
                      <option value="Solaris">Solaris</option>
                      <option value="Solaris 10">Solaris 10</option>
                      <option value="Solaris 10 beta">Solaris 10 beta</option>
                      <option value="Solaris 2.5">Solaris 2.5</option>
                      <option value="Solaris 2.5 1">Solaris 2.5 1</option>
                      <option value="Solaris 2.5-2.7">Solaris 2.5-2.7</option>
                      <option value="Solaris 2.6">Solaris 2.6</option>
                      <option value="Solaris 2.6-2.7">Solaris 2.6-2.7</option>
                      <option value="Solaris 2.7">Solaris 2.7</option>
                      <option value="Solaris 2.9">Solaris 2.9</option>
                      <option value="Solaris 8">Solaris 8</option>
                      <option value="Solaris 8 RFC1323">
                        Solaris 8 RFC1323
                      </option>
                      <option value="Sony">Sony</option>
                      <option value="Sony PS2">Sony PS2</option>
                      <option value="Spirent">Spirent</option>
                      <option value="Spirent Avalanche">
                        Spirent Avalanche
                      </option>
                      <option value="SunOS">SunOS</option>
                      <option value="SunOS 4.1">SunOS 4.1</option>
                      <option value="SymbianOS">SymbianOS</option>
                      <option value="SymbianOS 6048">SymbianOS 6048</option>
                      <option value="SymbianOS 6600">SymbianOS 6600</option>
                      <option value="SymbianOS 7">SymbianOS 7</option>
                      <option value="SymbianOS 9210">SymbianOS 9210</option>
                      <option value="SymbianOS P800">SymbianOS P800</option>
                      <option value="TOPS-20">TOPS-20</option>
                      <option value="TOPS-20 7">TOPS-20 7</option>
                      <option value="Tru64">Tru64</option>
                      <option value="Tru64 4.0">Tru64 4.0</option>
                      <option value="Tru64 5.0">Tru64 5.0</option>
                      <option value="Tru64 5.1">Tru64 5.1</option>
                      <option value="Tru64 5.1 noRFC1323">
                        Tru64 5.1 noRFC1323
                      </option>
                      <option value="Tru64 5.1a">Tru64 5.1a</option>
                      <option value="Tru64 5.1a JP4">Tru64 5.1a JP4</option>
                      <option value="ULTRIX">ULTRIX</option>
                      <option value="ULTRIX 4.5">ULTRIX 4.5</option>
                      <option value="Windows">Windows</option>
                      <option value="Windows .NET">Windows .NET</option>
                      <option value="Windows 2000">Windows 2000</option>
                      <option value="Windows 2000 cisco">
                        Windows 2000 cisco
                      </option>
                      <option value="Windows 2000 RFC1323">
                        Windows 2000 RFC1323
                      </option>
                      <option value="Windows 2000 SP2">Windows 2000 SP2</option>
                      <option value="Windows 2000 SP2+">
                        Windows 2000 SP2+
                      </option>
                      <option value="Windows 2000 SP3">Windows 2000 SP3</option>
                      <option value="Windows 2000 SP4">Windows 2000 SP4</option>
                      <option value="Windows 2000 ZoneAlarm">
                        Windows 2000 ZoneAlarm
                      </option>
                      <option value="Windows 2003">Windows 2003</option>
                      <option value="Windows 2003 AS">Windows 2003 AS</option>
                      <option value="Windows 3.11">Windows 3.11</option>
                      <option value="Windows 95">Windows 95</option>
                      <option value="Windows 95 b">Windows 95 b</option>
                      <option value="Windows 95 winsock2">
                        Windows 95 winsock2
                      </option>
                      <option value="Windows 98">Windows 98</option>
                      <option value="Windows 98 lowTTL">
                        Windows 98 lowTTL
                      </option>
                      <option value="Windows 98 noSack">
                        Windows 98 noSack
                      </option>
                      <option value="Windows 98 RFC1323">
                        Windows 98 RFC1323
                      </option>
                      <option value="Windows CE">Windows CE</option>
                      <option value="Windows CE 2.0">Windows CE 2.0</option>
                      <option value="Windows ME">Windows ME</option>
                      <option value="Windows NT">Windows NT</option>
                      <option value="Windows NT 4.0">Windows NT 4.0</option>
                      <option value="Windows Vista">Windows Vista</option>
                      <option value="Windows XP">Windows XP</option>
                      <option value="Windows XP cisco">Windows XP cisco</option>
                      <option value="Windows XP RFC1323">
                        Windows XP RFC1323
                      </option>
                      <option value="Windows XP SP1">Windows XP SP1</option>
                      <option value="Windows XP SP3">Windows XP SP3</option>
                      <option value="Zaurus">Zaurus</option>
                      <option value="Zaurus 3.10">Zaurus 3.10</option>
                    </select>

                    <span className="help-block">
                      Note: this only works for TCP rules. General OS choice
                      matches all subtypes.
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>Diffserv Code Point</span>
                  </label>
                  <div className="col-sm-10">
                    <select
                      className="form-control"
                      name="dscp"
                      id="dscp"
                      value={initialValues.diffservCodePoint}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                      }}
                    >
                      <option value="">&nbsp;</option>
                      <option value="af11">af11</option>
                      <option value="af12">af12</option>
                      <option value="af13">af13</option>
                      <option value="af21">af21</option>
                      <option value="af22">af22</option>
                      <option value="af23">af23</option>
                      <option value="af31">af31</option>
                      <option value="af32">af32</option>
                      <option value="af33">af33</option>
                      <option value="af41">af41</option>
                      <option value="af42">af42</option>
                      <option value="af43">af43</option>
                      <option value="VA">VA</option>
                      <option value="EF">EF</option>
                      <option value="cs1">cs1</option>
                      <option value="cs2">cs2</option>
                      <option value="cs3">cs3</option>
                      <option value="cs4">cs4</option>
                      <option value="cs5">cs5</option>
                      <option value="cs6">cs6</option>
                      <option value="cs7">cs7</option>
                      <option value="0x01">0x01</option>
                      <option value="0x02">0x02</option>
                      <option value="0x04">0x04</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>Allow IP options</span>
                  </label>
                  <div className="checkbox col-sm-10">
                    <label className="chkboxlbl">
                      <input
                        name="allowopts"
                        id="allowopts"
                        type="checkbox"
                        checked={initialValues.allowIpOptions}
                        onChange={(e) => {
                          setInitialValues(e.target.value);
                        }}
                      />
                      Allow packets with IP options to pass. Otherwise they are
                      blocked by default. This is usually only seen with
                      multicast traffic.
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>Disable reply-to</span>
                  </label>
                  <div className="checkbox col-sm-10">
                    <label className="chkboxlbl">
                      <input
                        name="disablereplyto"
                        id="disablereplyto"
                        type="checkbox"
                        checked={initialValues.disableReplyTo}
                        onChange={(e) => {
                          setInitialValues(e.target.value);
                        }}
                      />
                      Disable auto generated reply-to for this rule.
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>Tag</span>
                  </label>
                  <div className="col-sm-10">
                    <input
                      className="form-control"
                      name="tag"
                      id="tag"
                      type="text"
                      value={initialValues.tag}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                      }}
                    />

                    <span className="help-block">
                      A packet matching this rule can be marked and this mark
                      used to match on other NAT/filter rules. It is called
                      <b>Policy filtering</b>.
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>Tagged</span>
                  </label>
                  <div className="checkbox col-sm-1">
                    <label className="chkboxlbl">
                      <input
                        name="nottagged"
                        id="nottagged"
                        type="checkbox"
                        checked={initialValues.tInvert}
                        onChange={(e) => {
                          setInitialValues(e.target.value);
                        }}
                      />
                      Invert
                    </label>
                  </div>
                  <div className="col-sm-4">
                    <input
                      className="form-control"
                      name="tagged"
                      id="tagged"
                      type="text"
                      placeholder="Tagged"
                      value={initialValues.tagged}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-sm-10 col-sm-offset-2">
                    <span className="help-block">
                      Match a mark placed on a packet by a different rule with
                      the Tag option. Check Invert to match packets which do not
                      contain this tag.
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>Max. states</span>
                  </label>
                  <div className="col-sm-10">
                    <input
                      className="form-control"
                      name="max"
                      id="max"
                      type="number"
                      min="1"
                      step="1"
                      value={initialValues.maxState}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                      }}
                    />

                    <span className="help-block">
                      Maximum state entries this rule can create.
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>Max. src nodes</span>
                  </label>
                  <div className="col-sm-10">
                    <input
                      className="form-control"
                      name="max-src-nodes"
                      id="max-src-nodes"
                      type="number"
                      min="1"
                      step="1"
                      value={initialValues.maxSrcNodes}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                      }}
                    />

                    <span className="help-block">
                      Maximum number of unique source hosts.
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>Max. connections</span>
                  </label>
                  <div className="col-sm-10">
                    <input
                      className="form-control"
                      name="max-src-conn"
                      id="max-src-conn"
                      type="number"
                      min="1"
                      step="1"
                      value={initialValues.maxConnections}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                      }}
                    />

                    <span className="help-block">
                      Maximum number of established connections per host (TCP
                      only).
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>Max. src. states</span>
                  </label>
                  <div className="col-sm-10">
                    <input
                      className="form-control"
                      name="max-src-states"
                      id="max-src-states"
                      type="number"
                      min="1"
                      step="1"
                      value={initialValues.maxSrcStates}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                      }}
                    />

                    <span className="help-block">
                      Maximum state entries per host.
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>Max. src. conn. Rate</span>
                  </label>
                  <div className="col-sm-10">
                    <input
                      className="form-control"
                      name="max-src-conn-rate"
                      id="max-src-conn-rate"
                      type="number"
                      min="1"
                      step="1"
                      value={initialValues.maxSrcConnRate}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                      }}
                    />

                    <span className="help-block">
                      Maximum new connections per host (TCP only).
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>Max. src. conn. Rates</span>
                  </label>
                  <div className="col-sm-10">
                    <input
                      className="form-control"
                      name="max-src-conn-rates"
                      id="max-src-conn-rates"
                      type="number"
                      min="1"
                      max="255"
                      step="1"
                      value={initialValues.maxSrcConnRateS}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                      }}
                    />

                    <span className="help-block">
                      / per how many second(s) (TCP only)
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>State timeout</span>
                  </label>
                  <div className="col-sm-10">
                    <input
                      className="form-control"
                      name="statetimeout"
                      id="statetimeout"
                      type="number"
                      min="1"
                      step="1"
                      value={initialValues.stateTimeout}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                      }}
                    />

                    <span className="help-block">State Timeout in seconds</span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>TCP Flags</span>
                  </label>
                  <div className="col-sm-10">
                    <table
                      className="table table-condensed table-flags"
                      style={{ width: "auto", display: distcpflag }}
                    >
                      <tbody>
                        <tr id="tcpheader">
                          <td></td>
                          <td>
                            <strong>FIN</strong>
                          </td>
                          <td>
                            <strong>SYN</strong>
                          </td>
                          <td>
                            <strong>RST</strong>
                          </td>
                          <td>
                            <strong>PSH</strong>
                          </td>
                          <td>
                            <strong>ACK</strong>
                          </td>
                          <td>
                            <strong>URG</strong>
                          </td>
                          <td>
                            <strong>ECE</strong>
                          </td>
                          <td>
                            <strong>CWR</strong>
                          </td>
                        </tr>
                        <tr id="tcpflags1">
                          <td>set</td>
                          <td>
                            <input
                              type="checkbox"
                              name="tcpflags1_fin"
                              id="tcpflags1_fin"
                              checked={initialValues.setFin}
                              onChange={(e) => {
                                setInitialValues(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              name="tcpflags1_syn"
                              id="tcpflags1_syn"
                              checked={initialValues.setSyn}
                              onChange={(e) => {
                                setInitialValues(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              name="tcpflags1_rst"
                              id="tcpflags1_rst"
                              checked={initialValues.setRst}
                              onChange={(e) => {
                                setInitialValues(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              name="tcpflags1_psh"
                              id="tcpflags1_psh"
                              checked={initialValues.setPsh}
                              onChange={(e) => {
                                setInitialValues(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              name="tcpflags1_ack"
                              id="tcpflags1_ack"
                              checked={initialValues.setAck}
                              onChange={(e) => {
                                setInitialValues(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              name="tcpflags1_urg"
                              id="tcpflags1_urg"
                              checked={initialValues.setUrg}
                              onChange={(e) => {
                                setInitialValues(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              name="tcpflags1_ece"
                              id="tcpflags1_ece"
                              checked={initialValues.setEce}
                              onChange={(e) => {
                                setInitialValues(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              name="tcpflags1_cwr"
                              id="tcpflags1_cwr"
                              checked={initialValues.setCwr}
                              onChange={(e) => {
                                setInitialValues(e.target.value);
                              }}
                            />
                          </td>
                        </tr>
                        <tr id="tcpflags2">
                          <td>out of</td>
                          <td>
                            <input
                              type="checkbox"
                              name="tcpflags2_fin"
                              id="tcpflags2_fin"
                              checked={initialValues.outofFin}
                              onChange={(e) => {
                                setInitialValues(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              name="tcpflags2_syn"
                              id="tcpflags2_syn"
                              checked={initialValues.outofSyn}
                              onChange={(e) => {
                                setInitialValues(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              name="tcpflags2_rst"
                              id="tcpflags2_rst"
                              checked={initialValues.outofRst}
                              onChange={(e) => {
                                setInitialValues(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              name="tcpflags2_psh"
                              id="tcpflags2_psh"
                              checked={initialValues.outofPsh}
                              onChange={(e) => {
                                setInitialValues(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              name="tcpflags2_ack"
                              id="tcpflags2_ack"
                              checked={initialValues.outofAck}
                              onChange={(e) => {
                                setInitialValues(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              name="tcpflags2_urg"
                              id="tcpflags2_urg"
                              checked={initialValues.outofUrg}
                              onChange={(e) => {
                                setInitialValues(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              name="tcpflags2_ece"
                              id="tcpflags2_ece"
                              checked={initialValues.outofEce}
                              onChange={(e) => {
                                setInitialValues(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              name="tcpflags2_cwr"
                              id="tcpflags2_cwr"
                              checked={initialValues.outofCwr}
                              onChange={(e) => {
                                setInitialValues(e.target.value);
                              }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <input
                      type="checkbox"
                      name="tcpflags_any"
                      id="tcpflags_any"
                      checked={initialValues.tcpAnyFlag}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                        tcpflagfun();
                      }}
                    />
                    <strong> Any flags.</strong>

                    <span className="help-block">
                      Use this to choose TCP flags that must be set or cleared
                      for this rule to match.
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>No pfSync</span>
                  </label>
                  <div className="checkbox col-sm-10">
                    <label className="chkboxlbl">
                      <input
                        name="nopfsync"
                        id="nopfsync"
                        type="checkbox"
                        checked={initialValues.noPfsync}
                        onChange={(e) => {
                          setInitialValues(e.target.value);
                        }}
                      />
                      Prevent states created by this rule to be sync'ed over
                      pfsync.
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>State type</span>
                  </label>
                  <div className="col-sm-10">
                    <select
                      className="form-control"
                      name="statetype"
                      id="statetype"
                      value={initialValues.stateType}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                      }}
                    >
                      <option value="Keep">Keep</option>
                      <option value="Sloppy">Sloppy</option>
                      <option value="Synproxy">Synproxy</option>
                      <option value="None">None</option>
                    </select>

                    <span className="help-block">
                      <span className="text-success">
                        Keep: works with all IP protocols
                        <br />
                        Sloppy: works with all IP protocols
                        <br />
                        Synproxy: proxies incoming TCP connections to help
                        protect servers from spoofed TCP SYN floods, at the cost
                        of performance (no SACK or window scaling)
                        <br />
                        None: Do not use state mechanisms to keep track
                      </span>
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>No XMLRPC Sync</span>
                  </label>
                  <div className="checkbox col-sm-10">
                    <label className="chkboxlbl">
                      <input
                        name="nosync"
                        id="nosync"
                        type="checkbox"
                        checked={initialValues.noXmlrpcSync}
                        onChange={(e) => {
                          setInitialValues(e.target.value);
                        }}
                      />
                      Prevent the rule on Master from automatically syncing to
                      other CARP members
                    </label>

                    <span className="help-block">
                      This does NOT prevent the rule from being overwritten on
                      Slave.
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>VLAN Prio</span>
                  </label>
                  <div className="col-sm-10">
                    <select
                      className="form-control"
                      name="vlanprio"
                      id="vlanprio"
                      value={initialValues.vlanPrio}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                      }}
                    >
                      <option value="none">none</option>
                      <option value="Background (BK, 0)">
                        Background (BK, 0)
                      </option>
                      <option value="Best Effort (BE, 1)">
                        Best Effort (BE, 1)
                      </option>
                      <option value="Excellent Effort (EE, 2)">
                        Excellent Effort (EE, 2)
                      </option>
                      <option value="Critical Applications (CA, 3)">
                        Critical Applications (CA, 3)
                      </option>
                      <option value="Video (VI, 4)">Video (VI, 4)</option>
                      <option value="Voice (VO, 5)">Voice (VO, 5)</option>
                      <option value="Internetwork Control (IC, 6)">
                        Internetwork Control (IC, 6)
                      </option>
                      <option value="Network Control (NC, 7)">
                        Network Control (NC, 7)
                      </option>
                    </select>

                    <span className="help-block">
                      Choose 802.1p priority to match on.
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>VLAN Prio Set</span>
                  </label>
                  <div className="col-sm-10">
                    <select
                      className="form-control"
                      name="vlanprioset"
                      id="vlanprioset"
                      value={initialValues.vlanPrioSet}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                      }}
                    >
                      <option value="none">none</option>
                      <option value="Background (BK, 0)">
                        Background (BK, 0)
                      </option>
                      <option value="Best Effort (BE, 1)">
                        Best Effort (BE, 1)
                      </option>
                      <option value="Excellent Effort (EE, 2)">
                        Excellent Effort (EE, 2)
                      </option>
                      <option value="Critical Applications (CA, 3)">
                        Critical Applications (CA, 3)
                      </option>
                      <option value="Video (VI, 4)">Video (VI, 4)</option>
                      <option value="Voice (VO, 5)">Voice (VO, 5)</option>
                      <option value="Internetwork Control (IC, 6)">
                        Internetwork Control (IC, 6)
                      </option>
                      <option value="Network Control (NC, 7)">
                        Network Control (NC, 7)
                      </option>
                    </select>

                    <span className="help-block">
                      Choose 802.1p priority to apply.
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>Schedule</span>
                  </label>
                  <div className="col-sm-10">
                    <select className="form-control" name="sched" id="sched">
                      <option value="" selected="">
                        none
                      </option>
                    </select>

                    <span className="help-block">
                      Leave as 'none' to leave the rule enabled all the time.
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>Gateway</span>
                  </label>
                  <div className="col-sm-10">
                    <select
                      className="form-control"
                      name="gateway"
                      id="gateway"
                      value={initialValues.gateway}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                      }}
                    >
                      <option value="Default">Default</option>
                      <option value="WAN_DHCP - 10.25.64.1 - Interface WAN_DHCP Gateway">
                        WAN_DHCP - 10.25.64.1 - Interface WAN_DHCP Gateway
                      </option>
                    </select>

                    <span className="help-block">
                      Leave as 'default' to use the system routing table. Or
                      choose a gateway to utilize policy based routing. <br />
                      Gateway selection is not valid for "IPV4+IPV6" address
                      family.
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>In / Out pipe</span>
                  </label>
                  <div className="col-sm-5">
                    <select className="form-control" name="dnpipe" id="dnpipe">
                      <option value="" selected="">
                        none
                      </option>
                    </select>
                  </div>
                  <div className="col-sm-5">
                    <select
                      className="form-control"
                      name="pdnpipe"
                      id="pdnpipe"
                    >
                      <option value="" selected="">
                        none
                      </option>
                    </select>
                  </div>
                  <div className="col-sm-10 col-sm-offset-2">
                    <span className="help-block">
                      Choose the Out queue/Virtual interface only if In is also
                      selected. The Out selection is applied to traffic leaving
                      the interface where the rule is created, the In selection
                      is applied to traffic coming into the chosen interface.
                      <br />
                      If creating a floating rule, if the direction is In then
                      the same rules apply, if the direction is Out the
                      selections are reversed, Out is for incoming and In is for
                      outgoing.
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">
                    <span>Ackqueue / Queue</span>
                  </label>
                  <div className="col-sm-5">
                    <select
                      className="form-control"
                      name="ackqueue"
                      id="ackqueue"
                    >
                      <option value="" selected="">
                        none
                      </option>
                    </select>
                  </div>
                  <div className="col-sm-5">
                    <select
                      className="form-control"
                      name="defaultqueue"
                      id="defaultqueue"
                    >
                      <option value="" selected="">
                        none
                      </option>
                    </select>
                  </div>
                  <div className="col-sm-10 col-sm-offset-2">
                    <span className="help-block">
                      Choose the Acknowledge Queue only if there is a selected
                      Queue.
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-10 col-sm-offset-2">
              <button
                className="btn btn-primary"
                id="save"
                onClick={() => {
                  if (
                    document.getElementById("ruleid").value === "" ||
                    document.getElementById("ruleid").value.match(/^\s*$/)
                  ) {
                    alert("Please Enter Rule Id");
                  } else {
                    addRule();
                  }
                }}
              >
                <i className="fa fa-save icon-embed-btn"></i>
                Save
              </button>
            </div>
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div style={{ position: "absolute", bottom: "2%", right: "12%" }}>
            <button
              className="btn btn-primary"
              id="cancel"
              onClick={() => {
                navigate(-1);
              }}
            >
              <i className="fa fa-arrow-left icon-embed-btn"></i>
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddFloatRule;
