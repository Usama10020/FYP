import React, { useState, useEffect, useContext } from "react";
import "../../Styles/ViewRegDev.css";
import HomePage from "./HomePage";
import PrsSingleRow from "./PrsSingleRow";
import AxiosInstance from "../../Axios/AxiosInstance";
import { UserContext } from "../../Contexts/UserContext";

const PenReqStatus = () => {
  const { userId } = useContext(UserContext);
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
  }, []);
  return (
    <>
      <HomePage />
      <div>
        <div className="viewregdevbody">
          <div className="container-xl">
            <div className="utable-responsive">
              <div className="utable-wrapper">
                <div className="utable-title">
                  <div className="row">
                    <div className="col-sm-8">
                      <h2 style={{ color: "#39ace7" }}>Requests Status</h2>
                    </div>
                  </div>
                </div>
                <table className="table table-striped table-hover table-bordered">
                  <thead>
                    <tr>
                      <th>Sr. #</th>
                      <th>Request Id</th>
                      <th>Device Type</th>
                      <th>Description</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((test, index) => {
                      if (userId === test.requestedBY) {
                        return (
                          <PrsSingleRow
                            key={index + 1}
                            sr={index + 1}
                            id={test._id}
                            dt={test.deviceType}
                            desc={test.description}
                            status={test.currentStatus}
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
      </div>
    </>
  );
};

export default PenReqStatus;

/*<th>Action</th>
 */
