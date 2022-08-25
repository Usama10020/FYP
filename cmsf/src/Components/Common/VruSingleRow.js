import React from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../Axios/AxiosInstance";
import { UserContext } from "../../Contexts/UserContext";
import { useContext } from "react";

const VruSingleRow = (test) => {
  const { setAnyDelete, userId, setEditUser } = useContext(UserContext);
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
      description: `User account with User Id: "${test.id}" deleted.`,
    });
  };
  return (
    <>
      <tr>
        <td>{test.sr}</td>
        <td>{test.id}</td>
        <td>{test.un}</td>
        <td>{test.em}</td>
        <td>{test.ut}</td>
        <td>
          <button
            title="Edit"
            data-toggle="tooltip"
            style={{
              color: "#57baed",
            }}
            onClick={() => {
              setEditUser(test.id);
              navigate("/editUserAdm");
            }}
          >
            <i className="fa fa-edit"></i>
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {test.id !== "usama10020" && test.id !== userId && (
            <button
              title="Delete"
              data-toggle="tooltip"
              style={{
                color: "red",
              }}
              onClick={() => {
                if (
                  window.confirm(
                    `Are you sure, you want to delete user with UserId "${test.id}"?`
                  )
                ) {
                  AxiosInstance.delete(`admin/user/${test.id}`)
                    .then((res) => {
                      setAnyDelete("true");
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
          )}
        </td>
      </tr>
    </>
  );
};

export default VruSingleRow;
