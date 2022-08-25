import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext";

const PrSingleRow = (test) => {
  const {
    setFruleId,
    setFDeviceId,
    setFDeviceType,
    setStatusId,
    setFDeviceName,
    setEditDevicePort,
    setCreated,
    setEdited,
    setDeleted,
    setFromStatus,
    setVersions,
  } = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <>
      <tr>
        <td>{test.sr}</td>
        <td>{test.id}</td>
        <td>{test.reqby}</td>
        <td>{test.dt}</td>
        <td>{test.desc}</td>
        <td style={{ textAlign: "center" }}>
          <button
            title="View"
            data-toggle="tooltip"
            style={{
              color: "#57baed",
            }}
            onClick={() => {
              setFruleId(test.workOnId);
              setFDeviceId(test.deviceId);
              setEditDevicePort(test.devicePort);
              setFDeviceType(test.dt);
              setStatusId(test.id);
              setFDeviceName(test.deviceId);
              setFromStatus("true");
              setCreated(test.created);
              setEdited(test.edited);
              setDeleted(test.deleted);
              setVersions(test.version);
              navigate(test.link);
            }}
          >
            <i className="fa fa-eye"></i>
          </button>
        </td>
      </tr>
    </>
  );
};

export default PrSingleRow;
