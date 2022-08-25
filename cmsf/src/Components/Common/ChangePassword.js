import React from "react";
import HomePage from "./HomePage";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../Axios/AxiosInstance";
import { UserContext } from "../../Contexts/UserContext";
import { useContext } from "react";

const ChangePassword = () => {
  const { userId } = useContext(UserContext);
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
      description: `Password of User Id: "${userId}" changed.`,
    });
    navigate("/homePage");
  };
  const changepassword = () => {
    AxiosInstance.put("/password/update", {
      oldPassword: document.getElementById("opass").value,
      newPassword: document.getElementById("npass").value,
      confirmPassword: document.getElementById("cnpass").value,
    })
      .then((res) => {
        if (res.data.success === true) {
          alert("Password Updated Successfully");
          addLog();
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };
  return (
    <>
      <HomePage />
      <div className="uuserinfo">
        <div className="container bootstrap snippets bootdeys">
          <div className="row">
            <div className="col-xs-12 col-sm-9">
              <div className="form-horizontal">
                <h2 className="text-center">Security</h2>
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h4 className="panel-title">Change Password</h4>
                  </div>
                  <div className="panel-body">
                    <div className="form-group">
                      <label className="col-sm-2 control-label">
                        Current password
                      </label>
                      <div className="col-sm-10">
                        <input
                          id="opass"
                          type="password"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-2 control-label">
                        New password
                      </label>
                      <div className="col-sm-10">
                        <input
                          id="npass"
                          type="password"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-2 control-label">
                        Confirm New password
                      </label>
                      <div className="col-sm-10">
                        <input
                          id="cnpass"
                          type="password"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-sm-10 col-sm-offset-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={() => {
                            changepassword();
                          }}
                        >
                          Save
                        </button>
                        &nbsp;&nbsp;&nbsp;
                        <button
                          type="reset"
                          className="btn btn-default"
                          onClick={() => {
                            navigate("/homepage");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
