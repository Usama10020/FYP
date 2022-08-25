import React, { useState, useEffect, useContext } from "react";
import "../../Styles/ViewRegDev.css";
import HomePage from "./HomePage";
import PrSingleRow from "./PrSingleRow";
import AxiosInstance from "../../Axios/AxiosInstance";
import { UserContext } from "../../Contexts/UserContext";

const PenRequest = () => {
  const { setFromStatus, statusUptoDate, setStatusUptoDate } =
    useContext(UserContext);
  const [data, setData] = useState([]);
  useEffect(() => {
    AxiosInstance.get("/statuss")
      .then((res) => {
        if (res.data.success === true) {
          setData(res.data.statuses);
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  }, [statusUptoDate]);
  useEffect(() => {
    setFromStatus("NILL");
    setStatusUptoDate("NILL");
  }, []);

  return (
    <div>
      <HomePage />
      <div className="viewregdevbody">
        <div className="container-xl">
          <div className="utable-responsive">
            <div className="utable-wrapper">
              <div className="utable-title">
                <div className="row">
                  <div className="col-sm-8">
                    <h2 style={{ color: "#39ace7" }}>Pending Requests</h2>
                  </div>
                </div>
              </div>
              <table className="table table-striped table-hover table-bordered">
                <thead>
                  <tr>
                    <th>Sr. #</th>
                    <th>Request Id</th>
                    <th>Requested By</th>
                    <th>Device Type</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((test, index) => {
                    if (test.currentStatus === "Pending Approval")
                      return (
                        <PrSingleRow
                          key={index + 1}
                          sr={index + 1}
                          id={test._id}
                          reqby={test.requestedBY}
                          dt={test.deviceType}
                          desc={test.description}
                          workOnId={test.workOnId}
                          deviceId={test.deviceId}
                          devicePort={test.devicePort}
                          link={test.link}
                          created={test.created}
                          edited={test.edited}
                          deleted={test.deleted}
                          version={test.version}
                        />
                      );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenRequest;
