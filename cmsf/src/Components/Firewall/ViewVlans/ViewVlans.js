import React, { useState, useEffect, useContext } from "react";
import "../../../Styles/ViewRegDev.css";
import Fhome from "../Fhome";
import VvSingleRow from "../ViewVlans/VvSingleRow";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../../Axios/AxiosInstance";
import { UserContext } from "../../../Contexts/UserContext";

const ViewVlans = () => {
  const navigate = useNavigate();
  const AddVlans = () => {
    navigate("/addVlans");
  };
  const { fruleDelete, setFruleDelete, setEditFrule, setFruleId, fDeviceId } =
    useContext(UserContext);
  useEffect(() => {
    setEditFrule("NILL");
    setFruleId("NILL");
  }, []);
  const [data, setData] = useState([]);
  useEffect(() => {
    AxiosInstance.get("/Vlans").then((res) => {
      if (res.data.success === true) {
        setData(res.data.vlans);
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
            <li>VLANs</li>
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
                AddVlans();
              }}
            >
              Add
            </button>
            <div className="utable-wrapper">
              <div className="utable-title">
                <div className="row">
                  <div className="col-sm-8">
                    <h2 style={{ color: "#39ace7" }}>VLANs</h2>
                  </div>
                </div>
              </div>
              <table className="table table-striped table-hover table-bordered">
                <thead>
                  <tr>
                    <th>Sr. #</th>
                    <th>VLAN Id</th>
                    <th>Parent Interface</th>
                    <th>VLAN Tag</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((test, index) => {
                    if (fDeviceId === test.deviceId) {
                      return (
                        <VvSingleRow
                          key={index + 1}
                          sr={index + 1}
                          rid={test.vlansId}
                          act={test.parentInterface}
                          inter={test.vlanTag}
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

export default ViewVlans;
