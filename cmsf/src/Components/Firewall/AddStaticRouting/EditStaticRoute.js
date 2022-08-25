import React, { useState, useEffect, useContext } from "react";
import Fhome from "../Fhome";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../Contexts/UserContext";
import AxiosInstance from "../../../Axios/AxiosInstance";

const EditStaticRoute = () => {
  const navigate = useNavigate();
  const {
    userId,
    userRole,
    fruleId,
    fDeviceId,
    fDeviceType,
    statusId,
    fromStatus,
    created,
    edited,
    deleted,
    setStatusUptoDate,
    setFruleDelete,
    versions,
  } = useContext(UserContext);
  const [initialValues, setInitialValues] = useState(() => {
    return {
      staticRouteId: "",
      destinationNetwork: "",
      subnet: "",
      gateway: "",
      disabled: false,
      description: "",
      version: "",
    };
  });
  useEffect(() => {
    setStatusUptoDate("yes");
    if (fromStatus === "true") {
      AxiosInstance.post(`/gettempStaticRoute`, {
        staticRouteId: fruleId,
        version: versions,
      }).then((res) => {
        if (res.data.success === true) {
          setInitialValues({
            staticRouteId: res.data.tempstaticRoute.staticRouteId,
            destinationNetwork: res.data.tempstaticRoute.destinationNetwork,
            subnet: res.data.tempstaticRoute.subnet,
            gateway: res.data.tempstaticRoute.gateway,
            disabled: res.data.tempstaticRoute.disabled,
            description: res.data.tempstaticRoute.description,
            version: res.data.tempstaticRoute.version,
          });
        }
      });
    } else {
      AxiosInstance.get(`/staticRoutes/${fruleId}`)
        .then((res) => {
          if (res.data.success === true) {
            setInitialValues({
              staticRouteId: res.data.staticRoute.staticRouteId,
              destinationNetwork: res.data.staticRoute.destinationNetwork,
              subnet: res.data.staticRoute.subnet,
              gateway: res.data.staticRoute.gateway,
              disabled: res.data.staticRoute.disabled,
              description: res.data.staticRoute.description,
            });
          }
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    }
  }, []);
  const [disDiscard, setDisDiscard] = useState(true);
  const [disSave, setDisSave] = useState(true);
  const [disDelete, setDisDelete] = useState(true);
  const buttonStatusChanger = () => {
    if (userRole === "Admin") {
      if (fromStatus === "true") {
        if (created === "1" || edited === "1") {
          setDisDelete(true);
          setDisDiscard(false);
          setDisSave(false);
        } else if (deleted === "1") {
          setDisDelete(false);
          setDisDiscard(false);
          setDisSave(true);
        }
      } else {
        setDisDelete(true);
        setDisDiscard(true);
        setDisSave(false);
      }
    } else if (userRole === "Operator") {
      setDisDelete(true);
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
      workOnId: document.getElementById("staticruleid").value,
      deviceId: fDeviceId,
      link: "/editStaticRoute",
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
          AxiosInstance.post("/registerStaticRoute", {
            staticRouteId: document.getElementById("staticruleid").value,
            deviceId: fDeviceId,
            destinationNetwork: document.getElementById("network").value,
            subnet: document.getElementById("network_subnet").value,
            gateway: document.getElementById("gateway").value,
            disabled: document.getElementById("disabled").checked,
            description: document.getElementById("descr").value,
            generatedByUserId: userId,
            isCreated: "1",
          })
            .then((res) => {
              if (res.data.success === true) {
                if (res.data.message.includes("Apply Changes")) {
                  alert(
                    `Static Route with Id : "${
                      document.getElementById("staticruleid").value
                    }" is created and approved by User Id : "${userId}".`
                  );
                  console.log("admincreatedtrue");
                  console.log(res.data.message);
                  addLog(
                    `Static Route with Id : "${
                      document.getElementById("staticruleid").value
                    }" is created and approved by User Id : "${userId}".`
                  );
                  addStatus("Approved");
                } else if (res.data.message.includes("error")) {
                  //delete from temp
                  deleteFromTemp(document.getElementById("staticruleid").value);
                  console.log("admincreatederror");
                  console.log(res.data.message);
                  addStatus(res.data.message);
                  alert(res.data.message);
                  addLog(
                    `Static Route with Id : "${
                      document.getElementById("staticruleid").value
                    }" is not created because of an input error.".`
                  );
                }
              }
            })
            .catch((err) => {
              //delete from temp
              deleteFromTemp(document.getElementById("staticruleid").value);
              console.log("admincreatederr");

              addStatus(err.response.data.message);
              alert(err.response.data.message);
              navigate(-1);
            });
        } else if (edited === "1") {
          AxiosInstance.put(`/staticRoutes/${fruleId}`, {
            destinationNetwork: document.getElementById("network").value,
            subnet: document.getElementById("network_subnet").value,
            gateway: document.getElementById("gateway").value,
            disabled: document.getElementById("disabled").checked,
            description: document.getElementById("descr").value,
          })
            .then((res) => {
              if (res.data.success === true) {
                if (res.data.message.includes("Apply Changes")) {
                  alert(
                    `Static Route with Id : "${
                      document.getElementById("staticruleid").value
                    }" is edited and approved by User Id : "${userId}".`
                  );
                  console.log("admineditedtrue");
                  console.log(res.data.message);
                  addLog(
                    `Static Route with Id : "${
                      document.getElementById("staticruleid").value
                    }" is edited and approved by User Id : "${userId}".`
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
        AxiosInstance.put(`/staticRoutes/${fruleId}`, {
          destinationNetwork: document.getElementById("network").value,
          subnet: document.getElementById("network_subnet").value,
          gateway: document.getElementById("gateway").value,
          disabled: document.getElementById("disabled").checked,
          description: document.getElementById("descr").value,
        })
          .then((res) => {
            if (res.data.success === true) {
              if (res.data.message.includes("Apply Changes")) {
                alert(
                  `Static Route with Id : "${
                    document.getElementById("staticruleid").value
                  }" is edited.`
                );
                console.log("admin");
                console.log(res.data.message);
                addLog(
                  `Static Route with Id : "${
                    document.getElementById("staticruleid").value
                  }" is edited.`
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
      AxiosInstance.put(`/tempStaticRoute/${fruleId}`, {
        staticRouteId: document.getElementById("staticruleid").value,
        deviceId: fDeviceId,
        destinationNetwork: document.getElementById("network").value,
        subnet: document.getElementById("network_subnet").value,
        gateway: document.getElementById("gateway").value,
        disabled: document.getElementById("disabled").checked,
        description: document.getElementById("descr").value,
        generatedByUserId: userId,
      })
        .then((res) => {
          if (res.data.success === true) {
            alert(res.data.message);
            registerStatus(
              `Static Route with Id : "${
                document.getElementById("staticruleid").value
              }" is edited and waiting for Admin Approval.`,
              "0",
              "1",
              "0"
            );
            addLog(
              `Static Route with Id : "${
                document.getElementById("staticruleid").value
              }" is edited and waiting for Admin Approval.`
            );
          }
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    }
  };
  const deleteFromTemp = (rid) => {
    AxiosInstance.delete(`/tempStaticRoute/${rid}`);
  };
  const [testingData, setTestingData] = useState([]);
  const deleTemp = (rid) => {
    AxiosInstance.delete(`/tempStaticRoute/${rid}`);
  };
  useEffect(() => {
    if (testingData) {
      getAllStatusesAndUpdate();
    }
  }, [testingData]);
  const getAllStatusesAndUpdate = () => {
    testingData.map((testing) => {
      console.log(fDeviceId);
      console.log(testing.deviceId);
      console.log(fDeviceType);
      console.log(testing.deviceType);
      console.log(document.getElementById("staticruleid").value);
      console.log(testing.workOnId);
      console.log(testing.link);
      if (
        testing.deviceType === fDeviceType &&
        testing.deviceId === fDeviceId &&
        testing.workOnId === document.getElementById("staticruleid").value &&
        testing.link === "/editStaticRoute"
      ) {
        console.log(testing._id);
        console.log("if");
        AxiosInstance.put(`/admin/statuss/${testing._id}`, {
          currentStatus: "Rule Deleted",
        });
      }
    });
  };
  const deleteButton = async () => {
    if (userRole === "Admin") {
      if (deleted === "1") {
        if (
          window.confirm(
            `Are you sure, you want to delete static route with Id "${
              document.getElementById("staticruleid").value
            }"?`
          )
        ) {
          await AxiosInstance.get("/statuss").then((res) => {
            if (res.data.success === true) {
              setTestingData(res.data.statuses);
            }
          });
          await AxiosInstance.delete(
            `/staticRoutes/${document.getElementById("staticruleid").value}`
          )
            .then((res) => {
              if (res.data.success === true) {
                if (res.data.message.includes("Deleted Successfully.")) {
                  setFruleDelete("true");
                  deleTemp(document.getElementById("staticruleid").value);
                  alert(res.data.message);
                  addLog(
                    `Static Route with Id : "${
                      document.getElementById("staticruleid").value
                    }" deleted and approved by Admin ${userId}.`
                  );
                } else if (res.data.message.includes("Error")) {
                  alert(res.data.message);
                }
              }
            })
            .catch((err) => {
              alert(err.response.data.message);
            });
        }
      }
    }
  };
  const discardButton = () => {
    if (userRole === "Admin") {
      if (created === "1") {
        AxiosInstance.delete(
          `/tempStaticRoute/${document.getElementById("staticruleid").value}`
        );
      }
      AxiosInstance.put(`/admin/statuss/${statusId}`, {
        currentStatus: "Cancelled",
      });
      alert("Discarded Successfully");
      addLog(
        `Request for change of static route with Id : "${
          document.getElementById("staticruleid").value
        }" is not approved by Admin "${userId}"`
      );
    }
  };
  return (
    <>
      <Fhome />
      <div class="container static">
        <header class="header">
          <ol class="breadcrumb">
            <li>Static Routing</li>
          </ol>
        </header>
        <div class="panel panel-default">
          <div class="panel-heading">
            <h2 class="panel-title">Edit Route Entry</h2>
          </div>
          <div class="panel-body">
            <div>
              <label className="col-sm-2 control-label">
                <span>Static Route Id</span>
              </label>
              <div className="col-sm-10">
                <input
                  className="form-control"
                  name="staticruleid"
                  id="staticruleid"
                  disabled={true}
                  type="text"
                  value={initialValues.staticRouteId}
                  onChange={(e) => {
                    let temp = { ...initialValues };
                    temp.staticRouteId = e.target.value;
                    setInitialValues(temp);
                  }}
                />
                <span className="help-block"></span>
              </div>
            </div>
            <div>
              <label class="col-sm-2 control-label">
                <span class="element-required">Destination network</span>
              </label>
              <div class="col-sm-10">
                <div class="input-group">
                  <input
                    class="form-control ui-autocomplete-input"
                    name="network"
                    id="network"
                    title="An IPv4 address like 1.2.3.4 or an IPv6 address like 1:2a:3b:ffff::1 or an alias"
                    type="text"
                    value={initialValues.destinationNetwork}
                    onChange={(e) => {
                      let temp = { ...initialValues };
                      temp.destinationNetwork = e.target.value;
                      setInitialValues(temp);
                    }}
                  />
                  <span class="input-group-addon input-group-inbetween pfIpMask">
                    /
                  </span>
                  <select
                    class="form-control pfIpMask"
                    name="network_subnet"
                    id="network_subnet"
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

                <span class="help-block">
                  Destination network for this static route
                </span>
              </div>
            </div>
            <div>
              <label class="col-sm-2 control-label">
                <span class="element-required">Gateway</span>
              </label>
              <div class="col-sm-10">
                <select
                  class="form-control"
                  name="gateway"
                  id="gateway"
                  value={initialValues.gateway}
                  onChange={(e) => {
                    let temp = { ...initialValues };
                    temp.gateway = e.target.value;
                    setInitialValues(temp);
                  }}
                >
                  <option value="WAN_DHCP">WAN_DHCP - </option>
                  <option value="WAN_DHCP6">WAN_DHCP6 - </option>
                  <option value="Null4">Null4 - </option>
                  <option value="Null6">Null6 - </option>
                </select>

                <span class="help-block">
                  Choose which gateway this route applies to or
                  <a href="/system_gateways_edit.php">add a new one first</a>
                </span>
              </div>
            </div>
            <div>
              <label class="col-sm-2 control-label">
                <span>Disabled</span>
              </label>
              <div class="checkbox col-sm-10">
                <label class="chkboxlbl">
                  <input
                    name="disabled"
                    id="disabled"
                    type="checkbox"
                    checked={initialValues.disabled}
                    onChange={(e) => {
                      let temp = { ...initialValues };
                      temp.disabled = e.target.checked;
                      setInitialValues(temp);
                    }}
                  />
                  Disable this static route
                </label>

                <span class="help-block">
                  Set this option to disable this static route without removing
                  it from the list.
                </span>
              </div>
            </div>
            <div>
              <label class="col-sm-2 control-label">
                <span>Description</span>
              </label>
              <div class="col-sm-10">
                <input
                  class="form-control"
                  name="descr"
                  id="descr"
                  type="text"
                  value={initialValues.description}
                  onChange={(e) => {
                    let temp = { ...initialValues };
                    temp.description = e.target.value;
                    setInitialValues(temp);
                  }}
                />

                <span class="help-block">
                  A description may be entered here for administrative reference
                  (not parsed).
                </span>
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
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button
          className="btn btn-primary"
          id="delete"
          disabled={disDelete}
          onClick={() => {
            deleteButton();
          }}
        >
          <i className="fa fa-trash icon-embed-btn"></i>
          Delete
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

export default EditStaticRoute;
