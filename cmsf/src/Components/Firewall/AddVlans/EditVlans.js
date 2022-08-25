import React, { useState, useEffect, useContext } from "react";
import Fhome from "../Fhome";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../Contexts/UserContext";
import AxiosInstance from "../../../Axios/AxiosInstance";

const EditVlans = () => {
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
      vlansId: "",
      parentInterface: "",
      vlanTag: "",
      vlanPriority: "",
      description: "",
      version: "",
    };
  });
  useEffect(() => {
    setStatusUptoDate("yes");
    if (fromStatus === "true") {
      AxiosInstance.post(`/gettempVlans`, {
        vlansId: fruleId,
        version: versions,
      }).then((res) => {
        if (res.data.success === true) {
          setInitialValues({
            vlansId: res.data.tempvlans.vlansId,
            parentInterface: res.data.tempvlans.parentInterface,
            vlanTag: res.data.tempvlans.vlanTag,
            vlanPriority: res.data.tempvlans.vlanPriority,
            description: res.data.tempvlans.description,
            version: res.data.tempvlans.version,
          });
        }
      });
    } else {
      AxiosInstance.get(`/vlans/${fruleId}`)
        .then((res) => {
          if (res.data.success === true) {
            setInitialValues({
              vlansId: res.data.vlans.vlansId,
              parentInterface: res.data.vlans.parentInterface,
              vlanTag: res.data.vlans.vlanTag,
              vlanPriority: res.data.vlans.vlanPriority,
              description: res.data.vlans.description,
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
      workOnId: document.getElementById("id").value,
      deviceId: fDeviceId,
      link: "/editVlans",
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
          AxiosInstance.post("/registerVlans", {
            vlansId: document.getElementById("id").value,
            deviceId: fDeviceId,
            parentInterface: document.getElementById("if").value,
            vlanTag: document.getElementById("tag").value,
            vlanPriority: document.getElementById("pcp").value,
            description: document.getElementById("descr").value,
            generatedByUserId: userId,
            isCreated: "1",
          })
            .then((res) => {
              if (res.data.success === true) {
                if (res.data.message.includes("Apply Changes")) {
                  alert(
                    `VLAN with Id : "${
                      document.getElementById("id").value
                    }" is created and approved by User Id : "${userId}".`
                  );
                  console.log("admincreatedtrue");
                  console.log(res.data.message);
                  addLog(
                    `VLAN with Id : "${
                      document.getElementById("id").value
                    }" is created and approved by User Id : "${userId}".`
                  );
                  addStatus("Approved");
                } else if (res.data.message.includes("error")) {
                  //delete from temp
                  deleteFromTemp(document.getElementById("id").value);
                  console.log("admincreatederror");
                  console.log(res.data.message);
                  addStatus(res.data.message);
                  alert(res.data.message);
                  addLog(
                    `VLAN with Id : "${
                      document.getElementById("id").value
                    }" is not created because of an input error.".`
                  );
                }
              }
            })
            .catch((err) => {
              //delete from temp
              deleteFromTemp(document.getElementById("id").value);
              console.log("admincreatederr");

              addStatus(err.response.data.message);
              alert(err.response.data.message);
              navigate(-1);
            });
        } else if (edited === "1") {
          AxiosInstance.put(`/vlans/${fruleId}`, {
            parentInterface: document.getElementById("if").value,
            vlanTag: document.getElementById("tag").value,
            vlanPriority: document.getElementById("pcp").value,
            description: document.getElementById("descr").value,
          })
            .then((res) => {
              if (res.data.success === true) {
                if (res.data.message.includes("Apply Changes")) {
                  alert(
                    `VLAN with Id : "${
                      document.getElementById("id").value
                    }" is edited and approved by User Id : "${userId}".`
                  );
                  console.log("admineditedtrue");
                  console.log(res.data.message);
                  addLog(
                    `VLAN with Id : "${
                      document.getElementById("id").value
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
        AxiosInstance.put(`/vlans/${fruleId}`, {
          parentInterface: document.getElementById("if").value,
          vlanTag: document.getElementById("tag").value,
          vlanPriority: document.getElementById("pcp").value,
          description: document.getElementById("descr").value,
        })
          .then((res) => {
            if (res.data.success === true) {
              if (res.data.message.includes("Apply Changes")) {
                alert(
                  `VLAN with Id : "${
                    document.getElementById("id").value
                  }" is edited.`
                );
                console.log("admin");
                console.log(res.data.message);
                addLog(
                  `VLAN with Id : "${
                    document.getElementById("id").value
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
      AxiosInstance.put(`/tempVlans/${fruleId}`, {
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
            alert(res.data.message);
            registerStatus(
              `VLAN with Id : "${
                document.getElementById("id").value
              }" is edited and waiting for Admin Approval.`,
              "0",
              "1",
              "0"
            );
            addLog(
              `VLAN with Id : "${
                document.getElementById("id").value
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
    AxiosInstance.delete(`/tempVlans/${rid}`);
  };
  const [testingData, setTestingData] = useState([]);
  const deleTemp = (rid) => {
    AxiosInstance.delete(`/tempVlans/${rid}`);
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
      console.log(document.getElementById("id").value);
      console.log(testing.workOnId);
      console.log(testing.link);
      if (
        testing.deviceType === fDeviceType &&
        testing.deviceId === fDeviceId &&
        testing.workOnId === document.getElementById("id").value &&
        testing.link === "/editVlans"
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
            `Are you sure, you want to delete vlan with Id "${
              document.getElementById("id").value
            }"?`
          )
        ) {
          await AxiosInstance.get("/statuss").then((res) => {
            if (res.data.success === true) {
              setTestingData(res.data.statuses);
            }
          });
          await AxiosInstance.delete(
            `/vlans/${document.getElementById("id").value}`
          )
            .then((res) => {
              if (res.data.success === true) {
                if (res.data.message.includes("Deleted Successfully.")) {
                  setFruleDelete("true");
                  deleTemp(document.getElementById("id").value);
                  alert(res.data.message);
                  addLog(
                    `VLAN with Id : "${
                      document.getElementById("id").value
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
          `/tempVlans/${document.getElementById("id").value}`
        );
      }
      AxiosInstance.put(`/admin/statuss/${statusId}`, {
        currentStatus: "Cancelled",
      });
      alert("Discarded Successfully");
      addLog(
        `Request for change of vlan with Id : "${
          document.getElementById("id").value
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
                <input
                  class="form-control"
                  name="id"
                  id="id"
                  type="text"
                  disabled={true}
                  value={initialValues.vlansId}
                  onChange={(e) => {
                    let temp = { ...initialValues };
                    temp.vlansId = e.target.value;
                    setInitialValues(temp);
                  }}
                />
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
                <select
                  class="form-control"
                  name="if"
                  id="if"
                  value={initialValues.parentInterface}
                  onChange={(e) => {
                    let temp = { ...initialValues };
                    temp.parentInterface = e.target.value;
                    setInitialValues(temp);
                  }}
                >
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
                  value={initialValues.vlanTag}
                  onChange={(e) => {
                    let temp = { ...initialValues };
                    temp.vlanTag = e.target.value;
                    setInitialValues(temp);
                  }}
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
                  value={initialValues.vlanPriority}
                  onChange={(e) => {
                    let temp = { ...initialValues };
                    temp.vlanPriority = e.target.value;
                    setInitialValues(temp);
                  }}
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
                  value={initialValues.description}
                  onChange={(e) => {
                    let temp = { ...initialValues };
                    temp.description = e.target.value;
                    setInitialValues(temp);
                  }}
                />

                <span class="help-block">
                  A group description may be entered here for administrative
                  reference (not parsed).
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
      <div style={{ position: "absolute", right: "12%" }}>
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

export default EditVlans;
