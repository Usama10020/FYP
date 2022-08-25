import React, { useState, useEffect } from "react";
import "../../Styles/ViewRegDev.css";
import HomePage from "./HomePage";
import VrdSingleRow from "./VrdSingleRow";
import AxiosInstance from "../../Axios/AxiosInstance";
import { UserContext } from "../../Contexts/UserContext";
import { useContext } from "react";

const ViewRegDev = () => {
  const { deviceDelete, setDeviceDelete, setEditDevice, setEditDevicePort } =
    useContext(UserContext);
  const [data, setData] = useState([]);
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
    setDeviceDelete("false");
  }, [deviceDelete]);
  useEffect(() => {
    setEditDevice("");
    setEditDevicePort("");
  }, []);
  return (
    <>
      <HomePage />
      <div className="viewregdevbody">
        <div className="container-xl">
          <div className="utable-responsive">
            <div className="utable-wrapper">
              <div className="utable-title">
                <div className="row">
                  <div className="col-sm-8">
                    <h2 style={{ color: "#39ace7" }}>Registered Devices</h2>
                  </div>
                </div>
              </div>
              <table className="table table-striped table-hover table-bordered">
                <thead>
                  <tr>
                    <th>Sr. #</th>
                    <th>Device Name</th>
                    <th>IP Address</th>
                    <th>Device Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((test, index) => {
                    return (
                      <VrdSingleRow
                        key={index + 1}
                        sr={index + 1}
                        dn={test.deviceName}
                        ip={test.ipAddress}
                        port={test.portAddress}
                        dt={test.deviceType}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewRegDev;
