import React, { useState, useEffect, useContext } from "react";
import "../../Styles/CreateAccountPage.css";
import SignUp from "../../Icons/SignUp.png";
import HomePage from "../Common/HomePage";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../Axios/AxiosInstance";
import { UserContext } from "../../Contexts/UserContext";

const SelectFirewall = () => {
  const { setFDeviceName, setFDeviceId, userId } = useContext(UserContext);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    AxiosInstance.get("/admin/devices")
      .then((res) => {
        if (res.data.success === true) {
          setData(res.data.devices);
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  }, []);

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
      description: `User selected the firewall for configuration with Ip Address : "${
        document.getElementById("devicetype").value
      }".`,
    });
  };

  const configureFirewall = () => {
    if (document.getElementById("devicetype").value === "NILL") {
      alert("Please select a firewall to configure.");
    } else {
      addLog();
      setFDeviceId(document.getElementById("devicetype").value);
      setFDeviceName(
        document.getElementById("devicetype").options[
          document.getElementById("devicetype").selectedIndex
        ].text
      );
      navigate("/Fhome");
    }
  };
  return (
    <>
      <HomePage />
      <div className="container ubody" id="CreateAccount">
        <div className="myCard">
          <div className="row">
            <div className="col-md-6">
              <div className="myLeftCtn">
                <div className="myForm text-center">
                  <header style={{ color: "#39ace7" }}>Select Firewall</header>
                  <br />
                  <br />
                  <br />
                  <div className="form-group">
                    <select
                      name="devicetype"
                      id="devicetype"
                      style={{ width: "60%" }}
                    >
                      <option value="NILL">Select Firewall</option>
                      {data.map((test, index) => {
                        if (test.deviceType === "firewall") {
                          return (
                            <option key={index} value={test.ipAddress}>
                              {test.ipAddress} , {test.deviceName}
                            </option>
                          );
                        }
                      })}
                    </select>
                  </div>
                  <br />
                  <br />
                  <input
                    type="submit"
                    className="butt"
                    value="Configure"
                    onClick={() => {
                      configureFirewall();
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

export default SelectFirewall;
