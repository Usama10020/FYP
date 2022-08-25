import React, { useState, useContext } from "react";
import Fhome from "../Fhome";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../Contexts/UserContext";
import AxiosInstance from "../../../Axios/AxiosInstance";

const AddVlans = () => {
  const navigate = useNavigate();
  const { userId, userRole, fDeviceId, fDeviceType } = useContext(UserContext);
  const registerStatus = (pDesc) => {
    AxiosInstance.post("/registerStatuss", {
      requestedBY: userId,
      deviceType: fDeviceType,
      description: pDesc,
      workOnId: document.getElementById("id").value,
      deviceId: fDeviceId,
      link: "/editVlans",
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
  const addTempVlan = () => {
    AxiosInstance.post("/tempregisterVlans", {
      vlansId: document.getElementById("id").value,
      deviceId: fDeviceId,
      parentInterface: document.getElementById("if").value,
      vlanTag: document.getElementById("tag").value,
      vlanPriority: document.getElementById("pcp").value,
      description: document.getElementById("descr").value,
      generatedByUserId: userId,
    });
  };
  const addVlan = () => {
    if (userRole === "Admin") {
      AxiosInstance.post("/registerVlans", {
        vlansId: document.getElementById("id").value,
        deviceId: fDeviceId,
        parentInterface: document.getElementById("if").value,
        vlanTag: document.getElementById("tag").value,
        vlanPriority: document.getElementById("pcp").value,
        description: document.getElementById("descr").value,
        generatedByUserId: userId,
      })
        .then((res) => {
          if (res.data.success === true) {
            if (res.data.message.includes("Apply Changes")) {
              addTempVlan();
              addLog(
                `VLAN with Id : "${
                  document.getElementById("id").value
                }" is created.`
              );
              alert(
                `VLAN with Id : "${
                  document.getElementById("id").value
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
      AxiosInstance.post("/tempregisterVlans", {
        vlansId: document.getElementById("id").value,
        deviceId: fDeviceId,
        parentInterface: document.getElementById("if").value,
        vlanTag: document.getElementById("tag").value,
        vlanPriority: document.getElementById("pcp").value,
        description: document.getElementById("descr").value,
        generatedByUserId: userId,
      })
        .then((res) => {
          if (res.data.success === true) {
            if (res.data.message === `Vlan added successfully.`) {
              console.log("addoperatortrue");
              registerStatus(
                `VLAN with Id : "${
                  document.getElementById("id").value
                }" is created and waiting for Admin approval.`
              );
              addLog(
                `VLAN with Id : "${
                  document.getElementById("id").value
                }" is created and waiting for Admin approval.`
              );
              alert(
                `VLAN with Id : "${
                  document.getElementById("id").value
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
            <li>Virtual Interface</li>
            <li>VLANs</li>
          </ol>
        </header>
        <div class="panel panel-default">
          <div class="panel-heading">
            <h2 class="panel-title">VLAN Configuration</h2>
          </div>
          <div class="panel-body">
            <br />
            <div>
              <label class="col-sm-2 control-label">
                <span>VLAN Id</span>
              </label>
              <div class="col-sm-6">
                <input class="form-control" name="id" id="id" type="text" />
              </div>
            </div>
            <br />
            <div>
              <br />
              <br />
              <label class="col-sm-2 control-label">
                <span class="element-required">Parent Interface</span>
              </label>
              <div class="col-sm-6">
                <select class="form-control" name="if" id="if">
                  <option value="em0">em0</option>
                  <option value="em1">em1</option>
                </select>

                <span class="help-block">
                  Only VLAN capable interfaces will be shown.
                </span>
              </div>
            </div>
            <br />
            <div>
              <br />
              <br />
              <label class="col-sm-2 control-label">
                <span class="element-required">VLAN Tag</span>
              </label>
              <div class="col-sm-6">
                <input
                  class="form-control"
                  name="tag"
                  id="tag"
                  type="text"
                  placeholder="1"
                />

                <span class="help-block">
                  802.1Q VLAN tag (between 1 and 4094).
                </span>
              </div>
            </div>
            <br />
            <div>
              <br />
              <br />
              <br />
              <label class="col-sm-2 control-label">
                <span>VLAN Priority</span>
              </label>
              <div class="col-sm-6">
                <input
                  class="form-control"
                  name="pcp"
                  id="pcp"
                  type="text"
                  placeholder="0"
                />

                <span class="help-block">
                  802.1Q VLAN Priority (between 0 and 7).
                </span>
              </div>
            </div>
            <br />
            <div>
              <br />
              <br />
              <br />
              <br />
              <label class="col-sm-2 control-label">
                <span>Description</span>
              </label>
              <div class="col-sm-6">
                <input
                  class="form-control"
                  name="descr"
                  id="descr"
                  type="text"
                  placeholder="Description"
                />

                <span class="help-block">
                  A group description may be entered here for administrative
                  reference (not parsed).
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
                document.getElementById("id").value === "" ||
                document.getElementById("id").value.match(/^\s*$/)
              ) {
                alert("Please Enter Id");
              } else {
                addVlan();
              }
            }}
          >
            <i class="fa fa-save icon-embed-btn"> </i>Save
          </button>
        </div>
        <div style={{ position: "absolute", bottom: "4%", right: "12%" }}>
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

export default AddVlans;
