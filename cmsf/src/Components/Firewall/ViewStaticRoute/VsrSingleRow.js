import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../Contexts/UserContext";
import AxiosInstance from "../../../Axios/AxiosInstance";

const VsrSingleRow = (test) => {
  const {
    setFruleDelete,
    userId,
    setEditFrule,
    setFruleId,
    userRole,
    fDeviceId,
    fDeviceType,
  } = useContext(UserContext);
  const navigate = useNavigate();
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
  };
  const [testingData, setTestingData] = useState([]);
  const deleTemp = (rid) => {
    AxiosInstance.delete(`/tempStaticRoute/${rid}`);
  };

  useEffect(() => {
    if (testingData) {
      getAllStatusesAndUpdate();
    }
  }, [testingData]);
  const getAllStatusesAndUpdate = () => {
    testingData.map((testing) => {
      if (
        testing.deviceType === fDeviceType &&
        testing.deviceId === fDeviceId &&
        testing.workOnId === test.rid &&
        testing.link === "/editStaticRoute"
      ) {
        AxiosInstance.put(`/admin/statuss/${testing._id}`, {
          currentStatus: "Rule Deleted",
        });
      }
    });
  };
  return (
    <>
      <>
        <tr>
          <td>{test.sr}</td>
          <td>{test.rid}</td>
          <td>{test.act}</td>
          <td>{test.inter}</td>
          <td>{test.create}</td>
          <td>
            <button
              title="Edit"
              data-toggle="tooltip"
              style={{
                color: "#57baed",
              }}
              onClick={() => {
                console.log("editStatic");
                setFruleId(test.rid);
                if (userRole === "Admin") {
                  setEditFrule("staticRoute");
                  navigate("/editStaticRoute");
                } else if (userRole === "Operator") {
                  setEditFrule("staticRouteOperator");
                  navigate("/editStaticRoute");
                }
              }}
            >
              <i className="fa fa-edit"></i>
            </button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <button
              title="Delete"
              data-toggle="tooltip"
              style={{
                color: "red",
              }}
              onClick={async () => {
                if (
                  window.confirm(
                    `Are you sure, you want to delete static route with Id "${test.rid}"?`
                  )
                ) {
                  if (userRole === "Admin") {
                    await AxiosInstance.get("/statuss").then((res) => {
                      if (res.data.success === true) {
                        setTestingData(res.data.statuses);
                      }
                    });
                    await AxiosInstance.delete(`/staticRoutes/${test.rid}`)
                      .then((res) => {
                        if (res.data.success === true) {
                          if (
                            res.data.message.includes("Deleted Successfully.")
                          ) {
                            setFruleDelete("true");
                            deleTemp(test.rid);
                            alert(res.data.message);
                            addLog(
                              `Static Route with Id : "${test.rid} deleted.`
                            );
                          } else if (res.data.message.includes("Error")) {
                            alert(res.data.message);
                          }
                        }
                      })
                      .catch((err) => {
                        alert(err.response.data.message);
                      });
                  } else if (userRole === "Operator") {
                    var llink = "/editStaticRoute";
                    AxiosInstance.post("/registerStatuss", {
                      requestedBY: userId,
                      deviceType: fDeviceType,
                      description: `Static Route with Id : "${test.rid}" is deleted and waiting for Admin Approval.`,
                      workOnId: test.rid,
                      deviceId: fDeviceId,
                      link: llink,
                      currentStatus: "Pending Approval",
                      created: "0",
                      edited: "0",
                      deleted: "1",
                    });
                    addLog(
                      `Static Route with Id : "${test.rid} deleted and waiting for Admin Approval.`
                    );
                    alert(
                      `Static Route with Rule Id : "${test.rid} deleted and waiting for Admin Approval.`
                    );
                  }
                }
              }}
            >
              <i className="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      </>
    </>
  );
};

export default VsrSingleRow;
