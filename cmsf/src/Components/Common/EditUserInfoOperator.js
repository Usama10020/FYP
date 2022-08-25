import React, { useState, useEffect } from "react";
import HomePage from "./HomePage";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../Axios/AxiosInstance";
import { UserContext } from "../../Contexts/UserContext";
import { useContext } from "react";

const EditUserInfoOperator = () => {
  const { setUserName, userId } = useContext(UserContext);
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(() => {
    return {
      name: "",
      workNumber: "",
      mobileNumber: "",
      email: "",
      workAddress: "",
    };
  });
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
      description: `User account with User Id: "${userId}" edited.`,
    });
    navigate("/homePage");
  };

  const updateProfile = () => {
    AxiosInstance.put("/me/update", {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      workNumber: document.getElementById("wnumber").value,
      mobileNumber: document.getElementById("mnumber").value,
      workAddress: document.getElementById("waddress").value,
    })
      .then((res) => {
        if (res.data.success === true) {
          setUserName(res.data.user.name);
          alert(res.data.message);
          addLog();
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };
  useEffect(() => {
    AxiosInstance.get("/me")
      .then((res) => {
        if (res.data.success === true) {
          setInitialValues({
            name: res.data.user.name,
            workNumber: res.data.user.workNumber,
            mobileNumber: res.data.user.mobileNumber,
            email: res.data.user.email,
            workAddress: res.data.user.workAddress,
          });
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  }, []);
  return (
    <>
      <HomePage />
      <div className="uuserinfo">
        <div className="container bootstrap snippets bootdeys">
          <div className="row">
            <div className="col-xs-12 col-sm-9">
              <div className="form-horizontal">
                <h2 className="text-center">Edit User Info</h2>
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h4 className="panel-title">User info</h4>
                  </div>
                  <div className="panel-body">
                    <div className="form-group">
                      <label className="col-sm-2 control-label">
                        Full Name
                      </label>
                      <div className="col-sm-10">
                        <input
                          id="name"
                          type="text"
                          value={initialValues.name}
                          className="form-control"
                          onChange={(e) => setInitialValues(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h4 className="panel-title">Contact info</h4>
                  </div>
                  <div className="panel-body">
                    <div className="form-group">
                      <label className="col-sm-2 control-label">
                        Work number
                      </label>
                      <div className="col-sm-10">
                        <input
                          id="wnumber"
                          type="tel"
                          className="form-control"
                          value={initialValues.workNumber}
                          onChange={(e) => setInitialValues(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-2 control-label">
                        Mobile number
                      </label>
                      <div className="col-sm-10">
                        <input
                          id="mnumber"
                          type="tel"
                          className="form-control"
                          value={initialValues.mobileNumber}
                          onChange={(e) => setInitialValues(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-2 control-label">
                        E-mail address
                      </label>
                      <div className="col-sm-10">
                        <input
                          id="email"
                          type="email"
                          className="form-control"
                          value={initialValues.email}
                          onChange={(e) => setInitialValues(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-2 control-label">
                        Work address
                      </label>
                      <div className="col-sm-10">
                        <textarea
                          id="waddress"
                          rows="3"
                          className="form-control"
                          value={initialValues.workAddress}
                          onChange={(e) => setInitialValues(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-sm-10 col-sm-offset-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={() => {
                            updateProfile();
                          }}
                        >
                          Save
                        </button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
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

export default EditUserInfoOperator;
