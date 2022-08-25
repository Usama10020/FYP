import React, { useState, useEffect } from "react";
import "../../Styles/CreateAccountPage.css";
import SignUp from "../../Icons/SignUp.png";
import HomePage from "./HomePage";
import { UserContext } from "../../Contexts/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../Axios/AxiosInstance";

const EditDevice = () => {
  const [disp, setDisp] = useState("none");
  const { editDevice, userId, editDevicePort } = useContext(UserContext);
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(() => {
    return {
      ipAddress: "",
      portAddress: "",
      deviceName: "",
      userId: "",
      password: "",
      deviceType: "",
    };
  });
  const addLog = () => {
    var des = "NILL";
    if (
      document.getElementById("ipaddress").value === editDevice &&
      document.getElementById("port").value === editDevicePort
    ) {
      des = `Device with Ip Address : "${editDevice}"  and port "${editDevicePort}" edited.`;
    } else {
      des = `Device with Ip Address : "${editDevice}" and port "${editDevicePort}" edited and has new Ip Address : "${
        document.getElementById("ipaddress").value
      }" and port "${document.getElementById("port").value}".`;
    }
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
      description: des,
    });
    navigate("/homePage");
  };
  const updateDevice = () => {
    AxiosInstance.put(`/admin/device/${editDevice}`, {
      ipAddress: document.getElementById("ipaddress").value,
      portAddress: document.getElementById("port").value,
      deviceName: document.getElementById("devicename").value,
      userId: document.getElementById("userid").value,
      password: document.getElementById("password").value,
      deviceType: document.getElementById("devicetype").value,
      findPort: editDevicePort,
    })
      .then((res) => {
        if (res.data.success === true) {
          alert(res.data.message);
          addLog();
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };
  useEffect(() => {
    AxiosInstance.post(`/postGetSingleDevice`, {
      ipAddress: editDevice,
      portAddress: editDevicePort,
    })
      .then((res) => {
        if (res.data.success === true) {
          setInitialValues({
            ipAddress: res.data.device.ipAddress,
            portAddress: res.data.device.portAddress,
            deviceName: res.data.device.deviceName,
            userId: res.data.device.userId,
            password: res.data.device.password,
            deviceType: res.data.device.deviceType,
          });
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  }, []);
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(async () => {
    await sleep(0.2 * 1000);
    if (document.getElementById("devicetype").value === "firewall") {
      setDisp("none");
    } else {
      setDisp("block");
    }
  }, []);
  return (
    <>
      <HomePage />
      <div
        className="container ubody"
        id="CreateAccount"
        style={{ height: "622px", marginTop: "40px" }}
      >
        <div className="myCard">
          <div className="row">
            <div className="col-md-6">
              <div className="myLeftCtn">
                <div className="myForm text-center">
                  <header style={{ color: "#39ace7" }}>Edit Device</header>
                  <div className="form-group">
                    <select
                      name="devicetype"
                      id="devicetype"
                      style={{ width: "60%" }}
                      disabled={true}
                      value={initialValues.deviceType}
                      onChange={(e) => {
                        setInitialValues(e.target.value);
                        if (e.target.value === "firewall") {
                          setDisp("none");
                        } else {
                          setDisp("block");
                        }
                      }}
                    >
                      <option value="firewall">Firewall</option>
                      <option value="router">Router</option>
                      <option value="switch">Switch</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <i className="fas fa-server"></i>
                    <input
                      className="myInput"
                      type="text"
                      placeholder="IP Address"
                      id="ipaddress"
                      value={initialValues.ipAddress}
                      onChange={(e) => setInitialValues(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ display: disp }}>
                    <i className="fas fa-plug"></i>
                    <input
                      className="myInput"
                      type="text"
                      placeholder="Port"
                      id="port"
                      value={initialValues.portAddress}
                      onChange={(e) => setInitialValues(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <i className="fas fa-desktop"></i>
                    <input
                      className="myInput"
                      type="text"
                      placeholder="Device Name"
                      id="devicename"
                      value={initialValues.deviceName}
                      onChange={(e) => setInitialValues(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <i className="fas fa-user"></i>
                    <input
                      className="myInput"
                      type="text"
                      placeholder="User Id"
                      id="userid"
                      value={initialValues.userId}
                      onChange={(e) => setInitialValues(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <i className="fas fa-lock"></i>
                    <input
                      className="myInput"
                      type="password"
                      id="password"
                      placeholder="Password"
                      value={initialValues.password}
                      onChange={(e) => setInitialValues(e.target.value)}
                    />
                  </div>
                  <br />
                  <input
                    type="submit"
                    className="butt"
                    value="Save Changes"
                    onClick={() => {
                      updateDevice();
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="myRightCtn">
                <div>
                  <img src={SignUp} id="icon" alt="SignUp Icon" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditDevice;
