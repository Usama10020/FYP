import React, { useState, useEffect, useContext } from "react";
import Rhome from "../Rhome";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../Contexts/UserContext";
import AxiosInstance from "../../../Axios/AxiosInstance";

const EditInterface = () => {
  const navigate = useNavigate();
  const {
    userId,
    userRole,
    fDeviceId,
    fDeviceType,
    editDevicePort,
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
      interface: "",
      ipAddress: "",
      subnet: "",
      version: "",
    };
  });
  useEffect(() => {
    setStatusUptoDate("yes");
    if (fromStatus === "true") {
      AxiosInstance.post("/tempgetSinglerIp", {
        interfaceName: "FastEthernet0/0",
        deviceId: fDeviceId,
        devicePort: editDevicePort,
        version: versions,
      }).then((res) => {
        if (res.data.success === true) {
          setInitialValues({
            interface: res.data.temprip.interfaceName,
            ipAddress: res.data.temprip.ipAddress,
            subnet: res.data.temprip.subnetMask,
            version: res.data.temprip.version,
          });
        }
      });
    } else {
      AxiosInstance.post("/GetSinglerIp", {
        interfaceName: "FastEthernet0/0",
        deviceId: fDeviceId,
        devicePort: editDevicePort,
      }).then((res) => {
        if (res.data.success === true) {
          setInitialValues({
            interface: res.data.ipFind.interfaceName,
            ipAddress: res.data.ipFind.ipAddress,
            subnet: res.data.ipFind.subnetMask,
          });
        }
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
      workOnId: "FastEthernet0/0",
      deviceId: fDeviceId,
      devicePort: editDevicePort,
      link: "/editInterface",
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
          AxiosInstance.post("/RegisterAndUpdaterIp", {
            deviceId: fDeviceId,
            devicePort: editDevicePort,
            interfaceName: document.getElementById("type").value,
            ipAddress: document.getElementById("ipaddr").value,
            subnetMask: document.getElementById("subnet").value,
            generatedByUserId: userId,
          })
            .then((res) => {
              if (res.data.success === true) {
                if (res.data.message.includes("Apply Changes")) {
                  alert(
                    `FastEthernet0/0 Interface of device "${fDeviceId}" and port "${editDevicePort}" is edited and approved by User Id : "${userId}".`
                  );
                  console.log("admincreatedtrue");
                  console.log(res.data.message);
                  addLog(
                    `FastEthernet0/0 Interface of device "${fDeviceId}" and port "${editDevicePort}" is edited and approved by User Id : "${userId}".`
                  );
                  addStatus("Approved");
                } else if (res.data.message.includes("error")) {
                  console.log("admincreatederror");
                  console.log(res.data.message);
                  addStatus(res.data.message);
                  alert(res.data.message);
                  addLog(
                    `FastEthernet0/0 Interface of device "${fDeviceId}" and port "${editDevicePort}" is not created because of an input error.".`
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
          AxiosInstance.post("/RegisterAndUpdaterIp", {
            deviceId: fDeviceId,
            devicePort: editDevicePort,
            interfaceName: document.getElementById("type").value,
            ipAddress: document.getElementById("ipaddr").value,
            subnetMask: document.getElementById("subnet").value,
            generatedByUserId: userId,
          })
            .then((res) => {
              if (res.data.success === true) {
                if (res.data.message.includes("Apply Changes")) {
                  alert(
                    `FastEthernet0/0 Interface of device "${fDeviceId}" and port "${editDevicePort}" is edited and approved by User Id : "${userId}".`
                  );
                  console.log("admineditedtrue");
                  console.log(res.data.message);
                  addLog(
                    `FastEthernet0/0 Interface of device "${fDeviceId}" and port "${editDevicePort}" is edited and approved by User Id : "${userId}".`
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
        AxiosInstance.post(`/RegisterAndUpdaterIp`, {
          deviceId: fDeviceId,
          devicePort: editDevicePort,
          interfaceName: document.getElementById("type").value,
          ipAddress: document.getElementById("ipaddr").value,
          subnetMask: document.getElementById("subnet").value,
          generatedByUserId: userId,
        })
          .then((res) => {
            if (res.data.success === true) {
              if (res.data.message.includes("Apply Changes")) {
                alert(
                  `FastEthernet0/0 Interface of device "${fDeviceId}" and port "${editDevicePort}" is edited.`
                );
                console.log("admin");
                console.log(res.data.message);
                addLog(
                  `FastEthernet0/0 Interface of device "${fDeviceId}" and port "${editDevicePort}" is edited.`
                );
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
      AxiosInstance.post(`/tempregisterAndUpdaterIp`, {
        deviceId: fDeviceId,
        devicePort: editDevicePort,
        interfaceName: document.getElementById("type").value,
        ipAddress: document.getElementById("ipaddr").value,
        subnetMask: document.getElementById("subnet").value,
        generatedByUserId: userId,
      })
        .then((res) => {
          if (res.data.success === true) {
            alert(
              `FastEthernet0/0 Interface of device "${fDeviceId}" and port "${editDevicePort}" is edited and waiting for admin approval.`
            );
            registerStatus(
              `FastEthernet0/0 Interface of device "${fDeviceId}" and port "${editDevicePort}" is edited and waiting for admin approval.`,
              "0",
              "1",
              "0"
            );
            addLog(
              `FastEthernet0/0 Interface of device "${fDeviceId}" and port "${editDevicePort}" is edited and waiting for admin approval.`
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
        `Request for change of FastEthernet0/0 Interface of device "${fDeviceId}" 
        and port "${editDevicePort}" is not approved by Admin "${userId}"`
      );
    }
  };
  return (
    <>
      <Rhome />
      <div class="container static">
        <header class="header">
          <ol class="breadcrumb">
            <li>Interface</li>
          </ol>
        </header>
        <div class="panel panel-default">
          <div class="panel-heading">
            <h2 class="panel-title">Ip Configuration</h2>
          </div>
          <div class="panel-body">
            <br />
            <div>
              <label class="col-sm-2 control-label">
                <span>Interface</span>
              </label>
              <div class="col-sm-10">
                <select
                  class="form-control"
                  name="type"
                  id="type"
                  value={initialValues.interface}
                  onChange={(e) => {
                    let temp = { ...initialValues };
                    temp.interface = e.target.value;
                    setInitialValues(temp);
                  }}
                >
                  <option value="FastEthernet0/0">FastEthernet0/0</option>
                </select>
              </div>
            </div>
          </div>
          <div class="panel-body">
            <div>
              <label class="col-sm-2 control-label">
                <span class="element-required">Ip Address</span>
              </label>
              <div class="col-sm-10">
                <div class="input-group">
                  <input
                    class="form-control"
                    name="ipaddr"
                    id="ipaddr"
                    title="An IPv4 address like 1.2.3.4"
                    type="text"
                    value={initialValues.ipAddress}
                    onChange={(e) => {
                      let temp = { ...initialValues };
                      temp.ipAddress = e.target.value;
                      setInitialValues(temp);
                    }}
                  />
                </div>
                <br />
              </div>
            </div>
            <div>
              <label class="col-sm-2 control-label">
                <span class="element-required">Subnet Mask</span>
              </label>
              <div class="col-sm-10">
                <div class="input-group">
                  <input
                    class="form-control"
                    name="subnet"
                    id="subnet"
                    type="text"
                    value={initialValues.subnet}
                    onChange={(e) => {
                      let temp = { ...initialValues };
                      temp.subnet = e.target.value;
                      setInitialValues(temp);
                    }}
                  />
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
              if (document.getElementById("type").value === "-1") {
                alert("Please select the interface");
              } else {
                saveButton();
              }
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

export default EditInterface;
