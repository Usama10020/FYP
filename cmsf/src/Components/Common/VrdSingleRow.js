import React from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../Axios/AxiosInstance";
import { UserContext } from "../../Contexts/UserContext";
import { useContext } from "react";

const VrdSingleRow = (test) => {
  const { setDeviceDelete, userId, setEditDevice, setEditDevicePort } =
    useContext(UserContext);
  const navigate = useNavigate();
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
      description: `Device with ipaddress: "${test.ip}" deleted.`,
    });
  };

  return (
    <>
      <tr>
        <td>{test.sr}</td>
        <td>{test.dn}</td>
        <td>{test.ip}</td>
        <td>{test.dt}</td>
        <td>
          <button
            title="Edit"
            data-toggle="tooltip"
            style={{
              color: "#57baed",
            }}
            onClick={() => {
              setEditDevice(test.ip);
              setEditDevicePort(test.port);
              navigate("/editDevice");
            }}
          >
            <i className="fa fa-edit"></i>
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button
            title="Delete"
            data-toggle="tooltip"
            style={{
              color: "red",
            }}
            onClick={() => {
              if (
                window.confirm(
                  `Are you sure, you want to delete device with Ip Address : "${test.ip}"?`
                )
              ) {
                AxiosInstance.post(`/admin/device/${test.ip}`, {
                  portAddress: test.port,
                })
                  .then((res) => {
                    setDeviceDelete("true");
                    alert(res.data.message);
                    addLog();
                  })
                  .catch((err) => {
                    alert(err.response.data.message);
                  });
              }
            }}
          >
            <i className="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    </>
  );
};

export default VrdSingleRow;
