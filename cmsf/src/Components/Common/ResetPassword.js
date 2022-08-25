import React from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../Axios/AxiosInstance";

const ResetPassword = () => {
  const getLastItem = (thePath) =>
    thePath.substring(thePath.lastIndexOf("/") + 1);
  const token = getLastItem(window.location.href);
  const navigate = useNavigate();
  const resetpassword = () => {
    AxiosInstance.put(`/password/reset/${token}`, {
      password: document.getElementById("npass").value,
      confirmPassword: document.getElementById("cnpass").value,
    })
      .then((res) => {
        if (res.data.success === true) {
          alert(res.data.message);
          navigate("/login");
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };
  return (
    <>
      <div className="uuserinfo">
        <div className="container bootstrap snippets bootdeys">
          <div className="row">
            <div className="col-xs-12 col-sm-9">
              <div className="form-horizontal">
                <h2 className="text-center">Security</h2>
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h4 className="panel-title">Reset Password</h4>
                  </div>
                  <div className="panel-body">
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
                            resetpassword();
                          }}
                        >
                          Save
                        </button>
                        &nbsp;&nbsp;&nbsp;
                        <button
                          type="reset"
                          className="btn btn-default"
                          onClick={() => {
                            navigate("/login");
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

export default ResetPassword;
