import React from "react";
import "../../Styles/ForgetPassowrd.css";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../Axios/AxiosInstance";

const ForgetPassowrd = () => {
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
      generatedByUserId: document.getElementById("email").value,
      dateAndTime: dateTime,
      description: `Forget password email sent to email address: "${
        document.getElementById("email").value
      }".`,
    });
    navigate("/login");
  };
  const forgetpassword = () => {
    AxiosInstance.post("/password/forgot", {
      email: document.getElementById("email").value,
    })
      .then((res) => {
        if (res.data.success === true) {
          alert(res.data.message);
          addLog();
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };
  return (
    <>
      <div className="uform-gap"></div>
      <div className="container h-100">
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <div className="panel panel-default">
              <div className="panel-body">
                <div className="text-center">
                  <h3>
                    <i className="fa fa-lock fa-4x"></i>
                  </h3>
                  <h2 className="text-center">Forgot Password?</h2>
                  <p>You can reset your password here.</p>
                  <div className="panel-body">
                    <div
                      id="register-form"
                      role="form"
                      className="form"
                      method="post"
                    >
                      <div className="uform-group">
                        <div className="input-group">
                          <span className="input-group-addon">
                            <i className="fa fa-user"></i>
                          </span>
                          <input
                            id="email"
                            name="email"
                            placeholder="Email"
                            className="form-control"
                            type="email"
                          />
                        </div>
                      </div>
                      <div className="uform-group">
                        <input
                          name="recover-submit"
                          className="btn btn-lg btn-primary btn-block"
                          value="Reset Password"
                          type="submit"
                          onClick={() => {
                            forgetpassword();
                          }}
                        />
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

export default ForgetPassowrd;
