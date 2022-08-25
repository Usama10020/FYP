import React, { useState, useEffect, useContext } from "react";
import Fhome from "../Fhome";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../Contexts/UserContext";
import AxiosInstance from "../../../Axios/AxiosInstance";

const EditWan = () => {
  const [displayOrNot, setDisplayOrNot] = useState("none");
  const display = () => {
    if (document.getElementById("type").value === "Static IPv4") {
      setDisplayOrNot("block");
    } else {
      setDisplayOrNot("none");
    }
  };
  const navigate = useNavigate();
  const {
    userId,
    userRole,
    fDeviceId,
    fDeviceType,
    statusId,
    fromStatus,
    created,
    edited,
    deleted,
    setStatusUptoDate,
    versions,
  } = useContext(UserContext);
  const [initialValues, setInitialValues] = useState(() => {
    return {
      ipv4Con: "",
      ipv4Address: "",
      subnet: "",
      version: "",
    };
  });
  useEffect(() => {
    setStatusUptoDate("yes");
    if (fromStatus === "true") {
      AxiosInstance.post("/tempgetSingleIp", {
        interfaceName: "WAN",
        deviceId: fDeviceId,
        version: versions,
      })
        .then((res) => {
          if (res.data.success === true) {
            setInitialValues({
              ipv4Con: res.data.tempip.ipv4Con,
              ipv4Address: res.data.tempip.ipv4Address,
              subnet: res.data.tempip.subnet,
              version: res.data.tempip.version,
            });
          }
        })
        .catch((err) => {
          console.log("temp read addadminerr");
          console.log(err.response.data.message);
        });
    } else {
      AxiosInstance.post("/GetSingleIp", {
        interfaceName: "WAN",
        deviceId: fDeviceId,
      })
        .then((res) => {
          if (res.data.success === true) {
            setInitialValues({
              ipv4Con: res.data.ipFind.ipv4Con,
              ipv4Address: res.data.ipFind.ipv4Address,
              subnet: res.data.ipFind.subnet,
            });
          }
        })
        .catch((err) => {
          console.log("read addadminerr");
          console.log(err.response.data.message);
        });
    }
  }, []);
  const [disDiscard, setDisDiscard] = useState(true);
  const [disSave, setDisSave] = useState(true);
  const buttonStatusChanger = () => {
    if (userRole === "Admin") {
      if (fromStatus === "true") {
        if (created === "1" || edited === "1") {
          setDisDiscard(false);
          setDisSave(false);
        } else if (deleted === "1") {
          setDisDiscard(false);
          setDisSave(true);
        }
      } else {
        setDisDiscard(true);
        setDisSave(false);
      }
    } else if (userRole === "Operator") {
      setDisDiscard(true);
      setDisSave(false);
    }
  };
  useEffect(() => {
    buttonStatusChanger();
  }, []);
  const addStatus = (pDesc) => {
    AxiosInstance.put(`/admin/statuss/${statusId}`, {
      currentStatus: pDesc,
    });
  };
  const registerStatus = (pDesc, crt, edi, dele) => {
    AxiosInstance.post("/registerStatuss", {
      requestedBY: userId,
      deviceType: fDeviceType,
      description: pDesc,
      workOnId: "WAN",
      deviceId: fDeviceId,
      link: "/editWan",
      currentStatus: "Pending Approval",
      created: crt,
      edited: edi,
      deleted: dele,
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
  const saveButton = () => {
    if (userRole === "Admin") {
      if (fromStatus === "true") {
        if (created === "1") {
          AxiosInstance.post("/RegisterAndUpdateIp", {
            deviceId: fDeviceId,
            interfaceName: "WAN",
            ipv4Con: document.getElementById("type").value,
            ipv4Address: document.getElementById("ipaddr").value,
            subnet: document.getElementById("subnet").value,
            generatedByUserId: userId,
          })
            .then((res) => {
              if (res.data.success === true) {
                if (res.data.message.includes("Apply Changes")) {
                  alert(
                    `Wan Interface of device "${fDeviceId}" is edited and approved by User Id : "${userId}".`
                  );
                  console.log("admincreatedtrue");
                  console.log(res.data.message);
                  addLog(
                    `Wan Interface of device "${fDeviceId}" is edited and approved by User Id : "${userId}".`
                  );
                  addStatus("Approved");
                } else if (res.data.message.includes("error")) {
                  console.log("admincreatederror");
                  console.log(res.data.message);
                  addStatus(res.data.message);
                  alert(res.data.message);
                  addLog(
                    `Wan Interface of device "${fDeviceId}" is not created because of an input error.".`
                  );
                }
              }
            })
            .catch((err) => {
              console.log("admincreatederr");
              addStatus(err.response.data.message);
              alert(err.response.data.message);
              navigate(-1);
            });
        } else if (edited === "1") {
          AxiosInstance.post("/RegisterAndUpdateIp", {
            deviceId: fDeviceId,
            interfaceName: "WAN",
            ipv4Con: document.getElementById("type").value,
            ipv4Address: document.getElementById("ipaddr").value,
            subnet: document.getElementById("subnet").value,
            generatedByUserId: userId,
          })
            .then((res) => {
              if (res.data.success === true) {
                if (res.data.message.includes("Apply Changes")) {
                  alert(
                    `Wan Interface of device "${fDeviceId}" is edited and approved by User Id : "${userId}".`
                  );
                  console.log("admineditedtrue");
                  console.log(res.data.message);
                  addLog(
                    `Wan Interface of device "${fDeviceId}" is edited and approved by User Id : "${userId}".`
                  );
                  addStatus("Approved");
                } else if (res.data.message.includes("error")) {
                  console.log("admineditederror");
                  console.log(res.data.message);
                  addStatus(res.data.message);
                  alert(res.data.message);
                }
              }
            })
            .catch((err) => {
              console.log("admineditederr");
              addStatus(err.response.data.message);
              alert(err.response.data.message);
              navigate(-1);
            });
        }
      } else {
        AxiosInstance.post(`/RegisterAndUpdateIp`, {
          deviceId: fDeviceId,
          interfaceName: "WAN",
          ipv4Con: document.getElementById("type").value,
          ipv4Address: document.getElementById("ipaddr").value,
          subnet: document.getElementById("subnet").value,
          generatedByUserId: userId,
        })
          .then((res) => {
            if (res.data.success === true) {
              if (res.data.message.includes("Apply Changes")) {
                alert(`Wan Interface of device "${fDeviceId}" is edited.`);
                console.log("admin");
                console.log(res.data.message);
                addLog(`Wan Interface of device "${fDeviceId}" is edited.`);
              } else if (res.data.message.includes("error")) {
                console.log("adminerror");
                console.log(res.data.message);
                alert(res.data.message);
              }
            }
          })
          .catch((err) => {
            console.log("adminerr");
            alert(err.response.data.message);
          });
      }
    } else if (userRole === "Operator") {
      AxiosInstance.post(`/tempregisterAndUpdateIp`, {
        deviceId: fDeviceId,
        interfaceName: "WAN",
        ipv4Con: document.getElementById("type").value,
        ipv4Address: document.getElementById("ipaddr").value,
        subnet: document.getElementById("subnet").value,
        generatedByUserId: userId,
      })
        .then((res) => {
          if (res.data.success === true) {
            alert(
              `Wan Interface of device "${fDeviceId}" is edited and waiting for admin approval.`
            );
            registerStatus(
              `Wan Interface of device "${fDeviceId}" is edited and waiting for admin approval.`,
              "0",
              "1",
              "0"
            );
            addLog(
              `Wan Interface of device "${fDeviceId}" is edited and waiting for admin approval.`
            );
          }
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    }
  };
  const discardButton = () => {
    if (userRole === "Admin") {
      AxiosInstance.put(`/admin/statuss/${statusId}`, {
        currentStatus: "Cancelled",
      });
      alert("Discarded Successfully");
      addLog(
        `Request for change of Wan Interface of device "${fDeviceId}" is not approved by Admin "${userId}"`
      );
    }
  };
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(async () => {
    await sleep(0.2 * 1000);
    display();
  }, []);
  return (
    <>
      <Fhome />
      <div className="container static">
        <header className="header">
          <ol className="breadcrumb">
            <li>Interfaces</li>
            <li>WAN</li>
          </ol>
        </header>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h2 className="panel-title">WAN Configuration</h2>
          </div>
          <div className="panel-body">
            <br />
            <div>
              <label className="col-sm-2 control-label">
                <span>IPv4 Configuration Type</span>
              </label>
              <div className="col-sm-10">
                <select
                  className="form-control"
                  name="type"
                  id="type"
                  value={initialValues.ipv4Con}
                  onChange={(e) => {
                    let temp = { ...initialValues };
                    temp.ipv4Con = e.target.value;
                    setInitialValues(temp);
                    display();
                  }}
                >
                  <option value="None">None</option>
                  <option value="Static IPv4">Static IPv4</option>
                  <option value="DHCP">DHCP</option>
                </select>
              </div>
            </div>
          </div>
          <div className="panel-body" style={{ display: displayOrNot }}>
            <div>
              <label className="col-sm-2 control-label">
                <span className="element-required">IPv4 Address</span>
              </label>
              <div className="col-sm-10">
                <div className="input-group">
                  <input
                    className="form-control"
                    name="ipaddr"
                    id="ipaddr"
                    title="An IPv4 address like 1.2.3.4"
                    type="text"
                    value={initialValues.ipv4Address}
                    onChange={(e) => {
                      let temp = { ...initialValues };
                      temp.ipv4Address = e.target.value;
                      setInitialValues(temp);
                    }}
                  />
                  <span className="input-group-addon input-group-inbetween pfIpMask">
                    /
                  </span>
                  <select
                    className="form-control pfIpMask"
                    name="subnet"
                    id="subnet"
                    value={initialValues.subnet}
                    onChange={(e) => {
                      let temp = { ...initialValues };
                      temp.subnet = e.target.value;
                      setInitialValues(temp);
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
                <br />
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-10 col-sm-offset-2">
          <button
            className="btn btn-primary"
            id="save"
            disabled={disSave}
            onClick={() => {
              saveButton();
            }}
          >
            <i className="fa fa-save icon-embed-btn"></i>
            Save
          </button>
        </div>
      </div>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <div style={{ position: "absolute", right: "13%" }}>
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
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button
          className="btn btn-primary"
          id="discard"
          disabled={disDiscard}
          onClick={() => {
            discardButton();
          }}
        >
          <i className="fa fa-trash icon-embed-btn"></i>
          Discard
        </button>
      </div>
    </>
  );
};

export default EditWan;
