import React, { useState } from "react";
import "../../Styles/CreateAccountPage.css";
import SignUp from "../../Icons/SignUp.png";
import HomePage from "./HomePage";
import AxiosInstance from "../../Axios/AxiosInstance";
import { useContext } from "react";
import { UserContext } from "../../Contexts/UserContext";
import { useNavigate } from "react-router-dom";

const AddNewDevice = () => {
  const [disp, setDisp] = useState("none");
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();
  const addLog = () => {
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
      description: `New device with Ip Address : "${
        document.getElementById("ipaddress").value
      }" and port : "${document.getElementById("port").value}" added as ${
        document.getElementById("devicetype").value
      }.`,
    });
    navigate("/homePage");
  };
  const addDevice = () => {
    AxiosInstance.post("/registerDevice", {
      ipAddress: document.getElementById("ipaddress").value,
      portAddress: document.getElementById("port").value,
      deviceName: document.getElementById("devicename").value,
      userId: document.getElementById("userid").value,
      password: document.getElementById("password").value,
      deviceType: document.getElementById("devicetype").value,
    })
      .then((res) => {
        if (res.data.success === true) {
          alert(res.data.message);
          addLog();
        }
      })
      .catch((err) => {
        if (err.response.data.message.includes("Reached error page:")) {
          alert("Can't add the device at the moment, Device unreachable.");
        } else {
          alert(err.response.data.message);
        }
      });
  };
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
                  <header style={{ color: "#39ace7" }}>Add New Device</header>
                  <div className="form-group">
                    <select
                      name="devicetype"
                      id="devicetype"
                      style={{ width: "60%" }}
                      onChange={(e) => {
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
                    />
                  </div>
                  <div className="form-group" style={{ display: disp }}>
                    <i className="fas fa-plug"></i>
                    <input
                      className="myInput"
                      type="text"
                      placeholder="Port"
                      id="port"
                    />
                  </div>
                  <div className="form-group">
                    <i className="fas fa-desktop"></i>
                    <input
                      className="myInput"
                      type="text"
                      placeholder="Device Name"
                      id="devicename"
                    />
                  </div>
                  <div className="form-group">
                    <i className="fas fa-user"></i>
                    <input
                      className="myInput"
                      type="text"
                      placeholder="User Id"
                      id="userid"
                    />
                  </div>
                  <div className="form-group">
                    <i className="fas fa-lock"></i>
                    <input
                      className="myInput"
                      type="password"
                      id="password"
                      placeholder="Password"
                    />
                  </div>
                  <br />
                  <input
                    type="submit"
                    className="butt"
                    value="Add Device"
                    style={{ backgroundColor: "#39ace7" }}
                    onClick={() => {
                      addDevice();
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

export default AddNewDevice;
