import React, { useState, useContext } from "react";
import Fhome from "../Fhome";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../Contexts/UserContext";
import AxiosInstance from "../../../Axios/AxiosInstance";

const AddStaticRoute = () => {
  const navigate = useNavigate();
  const { userId, userRole, fDeviceId, fDeviceType } = useContext(UserContext);
  const registerStatus = (pDesc) => {
    AxiosInstance.post("/registerStatuss", {
      requestedBY: userId,
      deviceType: fDeviceType,
      description: pDesc,
      workOnId: document.getElementById("staticruleid").value,
      deviceId: fDeviceId,
      link: "/editStaticRoute",
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
  const addTempStaticRoute = () => {
    AxiosInstance.post("/tempregisterStaticRoute", {
      staticRouteId: document.getElementById("staticruleid").value,
      deviceId: fDeviceId,
      destinationNetwork: document.getElementById("network").value,
      subnet: document.getElementById("network_subnet").value,
      gateway: document.getElementById("gateway").value,
      disabled: document.getElementById("disabled").checked,
      description: document.getElementById("descr").value,
      generatedByUserId: userId,
    });
  };
  const addStaticRoutee = () => {
    if (userRole === "Admin") {
      AxiosInstance.post("/registerStaticRoute", {
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
            if (res.data.message.includes("Apply Changes")) {
              addTempStaticRoute();
              addLog(
                `Static Route with Id : "${
                  document.getElementById("staticruleid").value
                }" is created.`
              );
              alert(
                `Static Route with Id : "${
                  document.getElementById("staticruleid").value
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
      AxiosInstance.post("/tempregisterStaticRoute", {
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
            if (res.data.message === `Static Route added successfully.`) {
              console.log("addoperatortrue");
              registerStatus(
                `Static Route with Id : "${
                  document.getElementById("staticruleid").value
                }" is created and waiting for Admin approval.`
              );
              addLog(
                `Static Route with Id : "${
                  document.getElementById("staticruleid").value
                }" is created and waiting for Admin approval.`
              );
              alert(
                `Static Route with Id : "${
                  document.getElementById("staticruleid").value
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
                  type="text"
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
                  />
                  <span class="input-group-addon input-group-inbetween pfIpMask">
                    /
                  </span>
                  <select
                    class="form-control pfIpMask"
                    name="network_subnet"
                    id="network_subnet"
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
                <select class="form-control" name="gateway" id="gateway">
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
                  <input name="disabled" id="disabled" type="checkbox" />
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
                />

                <span class="help-block">
                  A description may be entered here for administrative reference
                  (not parsed).
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-10 col-sm-offset-2">
          <button
            class="btn btn-primary"
            type="submit"
            value="Save"
            name="save"
            id="save"
            onClick={() => {
              if (
                document.getElementById("staticruleid").value === "" ||
                document.getElementById("staticruleid").value.match(/^\s*$/)
              ) {
                alert("Please Enter Id");
              } else {
                addStaticRoutee();
              }
            }}
          >
            <i class="fa fa-save icon-embed-btn"> </i>Save
          </button>
        </div>
        <div style={{ position: "absolute", bottom: "15%", right: "12%" }}>
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
    </>
  );
};

export default AddStaticRoute;
