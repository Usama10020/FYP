import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../Contexts/UserContext";
import AxiosInstance from "../../../Axios/AxiosInstance";

const VfrSingleRow = (test) => {
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
    AxiosInstance.delete(`/tempfrules/${rid}`)
      .then((res) => {
        if (res.data.success === true) {
          console.log(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
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
        (testing.link === "/editFloatRule" || testing.link === "/editLwRule")
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
                setFruleId(test.rid);
                if (userRole === "Admin") {
                  if (test.title === "FLOATING") {
                    setEditFrule("floatRule");
                    navigate("/editFloatRule");
                  } else if (test.title === "WAN") {
                    setEditFrule("wanRule");
                    navigate("/editLwRule");
                  } else if (test.title === "LAN") {
                    setEditFrule("lanRule");
                    navigate("/editLwRule");
                  }
                } else if (userRole === "Operator") {
                  if (test.title === "FLOATING") {
                    setEditFrule("floatRuleOperator");
                    navigate("/editFloatRule");
                  } else if (test.title === "WAN") {
                    setEditFrule("wanRuleOperator");
                    navigate("/editLwRule");
                  } else if (test.title === "LAN") {
                    setEditFrule("lanRuleOperator");
                    navigate("/editLwRule");
                  }
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
                    `Are you sure, you want to delete firewall rule with RuleId "${test.rid}"?`
                  )
                ) {
                  if (userRole === "Admin") {
                    await AxiosInstance.get("/statuss").then((res) => {
                      if (res.data.success === true) {
                        setTestingData(res.data.statuses);
                      }
                    });
                    await AxiosInstance.delete(`/frules/${test.rid}`)
                      .then((res) => {
                        if (res.data.success === true) {
                          if (
                            res.data.message.includes("Deleted Successfully.")
                          ) {
                            setFruleDelete("true");
                            deleTemp(test.rid);
                            alert(res.data.message);
                            addLog(
                              `Firewall rule with Rule Id : "${test.rid} deleted.`
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
                    var llink = "NILL";
                    if (test.title === "FLOATING") {
                      llink = "/editFloatRule";
                    } else if (test.title === "WAN" || test.title === "LAN") {
                      llink = "/editLwRule";
                    }
                    AxiosInstance.post("/registerStatuss", {
                      requestedBY: userId,
                      deviceType: fDeviceType,
                      description: `Firewall rule with Rule Id : "${test.rid}" is deleted and waiting for Admin Approval.`,
                      workOnId: test.rid,
                      deviceId: fDeviceId,
                      link: llink,
                      currentStatus: "Pending Approval",
                      created: "0",
                      edited: "0",
                      deleted: "1",
                    });
                    addLog(
                      `Firewall rule with Rule Id : "${test.rid} deleted and waiting for Admin Approval.`
                    );
                    alert(
                      `Firewall rule with Rule Id : "${test.rid} deleted and waiting for Admin Approval.`
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

export default VfrSingleRow;
