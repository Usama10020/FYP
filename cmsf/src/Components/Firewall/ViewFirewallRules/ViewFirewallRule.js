import React, { useState, useEffect, useContext } from "react";
import "../../../Styles/ViewRegDev.css";
import Fhome from "../Fhome";
import VfrSingleRow from "../ViewFirewallRules/VfrSingleRow.js";
import { useNavigate, Link } from "react-router-dom";
import AxiosInstance from "../../../Axios/AxiosInstance";
import { UserContext } from "../../../Contexts/UserContext";

const ViewFirewallRule = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(() => {
    return "FLOATING";
  });
  const [swap, setSwap] = useState("false");
  const AddRule = () => {
    if (title === "FLOATING") {
      navigate("/addFloatRule");
    } else if (title === "WAN" || title === "LAN") {
      navigate("/addLwRule");
    } else {
      return 0;
    }
  };
  const {
    fruleDelete,
    setFruleDelete,
    setEditFrule,
    setFruleId,
    fDeviceId,
    userId,
  } = useContext(UserContext);
  useEffect(() => {
    setEditFrule("NILL");
    setFruleId("NILL");
  }, []);
  const [data, setData] = useState([]);
  useEffect(() => {
    AxiosInstance.get("/frules").then((res) => {
      if (res.data.success === true) {
        setData(res.data.frules);
      }
    });
    setFruleDelete("false");
    setSwap("false");
  }, [fruleDelete, title, swap]);
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
  const moveRule = async () => {
    await AxiosInstance.put("/frulesMoveRules", {
      ruleId1: document.getElementById("rule1").value,
      ruleId2: document.getElementById("rule2").value,
      deviceId: fDeviceId,
    })
      .then((res) => {
        if (res.data.success === true) {
          addLog(
            `Firewall rule with rule id: "${
              document.getElementById("rule1").value
            }" is moved before rule with rule id: "${
              document.getElementById("rule2").value
            }" by Admin "${userId}".`
          );
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
    setSwap("true");
    window.location.reload();
  };
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
            <li>Firewall Rules</li>
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
                AddRule();
              }}
            >
              Add
            </button>
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
                if (
                  document.getElementById("rule1").value === "" ||
                  document.getElementById("rule1").value.match(/^\s*$/) ||
                  document.getElementById("rule2").value === "" ||
                  document.getElementById("rule2").value.match(/^\s*$/) ||
                  document.getElementById("rule1").value < 0 ||
                  document.getElementById("rule2").value < 0 ||
                  document.getElementById("rule1").value ===
                    document.getElementById("rule2").value
                ) {
                  alert("Please enter correct rule id to move rule");
                } else {
                  moveRule();
                }
              }}
            >
              Move Rule
            </button>
            <input
              type="number"
              id="rule2"
              name="rule2"
              style={{
                backgroundColor: "white",
                float: "right",
                height: "30px",
                width: "65px",
                marginRight: "10px",
                marginTop: "13px",
              }}
            />
            <label
              style={{
                float: "right",
                marginRight: "10px",
                marginTop: "15px",
                color: "#39ace7",
              }}
            >
              Before
            </label>
            <input
              type="number"
              id="rule1"
              name="rule1"
              style={{
                backgroundColor: "white",
                float: "right",
                height: "30px",
                width: "65px",
                marginRight: "10px",
                marginTop: "13px",
              }}
            />
            <div className="utable-wrapper">
              <ul className="nav nav-tabs">
                <li className="nav-item" data-type="all">
                  <Link
                    className="nav-link"
                    to="#"
                    onClick={() => {
                      setTitle("FLOATING");
                    }}
                    style={{ color: "#39ace7" }}
                  >
                    Floating
                  </Link>
                </li>
                <li className="nav-item" data-type="todo">
                  <Link
                    className="nav-link"
                    to="#"
                    onClick={() => {
                      setTitle("WAN");
                    }}
                    style={{ color: "#39ace7" }}
                  >
                    Wan
                  </Link>
                </li>
                <li className="nav-item" data-type="done">
                  <Link
                    className="nav-link"
                    to="#"
                    onClick={() => {
                      setTitle("LAN");
                    }}
                    style={{ color: "#39ace7" }}
                  >
                    Lan
                  </Link>
                </li>
              </ul>
              <div className="utable-title">
                <div className="row">
                  <div className="col-sm-8">
                    <h2 style={{ color: "#39ace7" }}>{title}</h2>
                  </div>
                </div>
              </div>
              <table className="table table-striped table-hover table-bordered">
                <thead>
                  <tr>
                    <th>Sr. #</th>
                    <th>Rule Id</th>
                    <th>Action</th>
                    <th>Interface</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((test, index) => {
                    if (title === test.rtype && fDeviceId === test.deviceId) {
                      return (
                        <VfrSingleRow
                          key={index + 1}
                          sr={index + 1}
                          rid={test.ruleId}
                          act={test.action}
                          inter={test.interface}
                          create={test.generatedByUserId}
                          title={title}
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

export default ViewFirewallRule;
