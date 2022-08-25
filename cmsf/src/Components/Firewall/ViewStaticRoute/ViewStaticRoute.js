import React, { useState, useEffect, useContext } from "react";
import "../../../Styles/ViewRegDev.css";
import Fhome from "../Fhome";
import VsrSingleRow from "../ViewStaticRoute/VsrSingleRow.js";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../../Axios/AxiosInstance";
import { UserContext } from "../../../Contexts/UserContext";

const ViewStaticRoute = () => {
  const navigate = useNavigate();
  const AddStaticRoute = () => {
    navigate("/addStaticRoute");
  };
  const { fruleDelete, setFruleDelete, setEditFrule, setFruleId, fDeviceId } =
    useContext(UserContext);
  useEffect(() => {
    setEditFrule("NILL");
    setFruleId("NILL");
  }, []);
  const [data, setData] = useState([]);
  useEffect(() => {
    AxiosInstance.get("/StaticRoutes").then((res) => {
      if (res.data.success === true) {
        setData(res.data.staticRoutes);
      }
    });
    setFruleDelete("false");
  }, [fruleDelete]);
  useEffect(() => {
    if (data) {
      data.sort((a, b) => {
        return a.pfsenseId - b.pfsenseId;
      });
    }
  }, [data]);
  return (
    <>
      <Fhome />
      <div className="ubread">
        <header className="header">
          <ol className="breadcrumb">
            <li>Static Routes</li>
          </ol>
        </header>
      </div>
      <div className="viewregdevbody">
        <div className="container-xl">
          <div className="utable-responsive">
            <button
              type="button"
              className="btn btn-primary"
              style={{
                backgroundColor: "#39ace7",
                float: "right",
                marginRight: "10px",
                marginTop: "10px",
              }}
              onClick={() => {
                AddStaticRoute();
              }}
            >
              Add
            </button>
            <div className="utable-wrapper">
              <div className="utable-title">
                <div className="row">
                  <div className="col-sm-8">
                    <h2 style={{ color: "#39ace7" }}>Static Routes</h2>
                  </div>
                </div>
              </div>
              <table className="table table-striped table-hover table-bordered">
                <thead>
                  <tr>
                    <th>Sr. #</th>
                    <th>Static Route Id</th>
                    <th>Destination Network</th>
                    <th>Subnet</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((test, index) => {
                    if (fDeviceId === test.deviceId) {
                      return (
                        <VsrSingleRow
                          key={index + 1}
                          sr={index + 1}
                          rid={test.staticRouteId}
                          act={test.destinationNetwork}
                          inter={test.subnet}
                          create={test.generatedByUserId}
                        />
                      );
                    }
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

export default ViewStaticRoute;
