import React, { useContext } from "react";
import "../../Styles/CreateAccountPage.css";
import SignUp from "../../Icons/SignUp.png";
import HomePage from "./HomePage";
import AxiosInstance from "../../Axios/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext";

const CreateAccount = () => {
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
      description: `User account created with User Id: "${
        document.getElementById("userid").value
      }".`,
    });
    navigate("/homePage");
  };
  const createaccount = () => {
    AxiosInstance.post("/register", {
      userId: document.getElementById("userid").value,
      name: document.getElementById("fullname").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      role: document.getElementById("usertype").value,
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
      <HomePage />
      <div className="container ubody" id="CreateAccount">
        <div className="myCard">
          <div className="row">
            <div className="col-md-6">
              <div className="myLeftCtn">
                <div className="myForm text-center">
                  <header style={{ color: "#39ace7" }}>
                    Create new account
                  </header>
                  <div className="form-group">
                    <i className="fas fa-user"></i>
                    <input
                      className="myInput"
                      type="text"
                      placeholder="User Id"
                      id="userid"
                    />
                  </div>
                  <div className="form-group">
                    <i className="fas fa-user"></i>
                    <input
                      className="myInput"
                      type="text"
                      placeholder="Full Name"
                      id="fullname"
                    />
                  </div>
                  <div className="form-group">
                    <i className="fas fa-envelope"></i>
                    <input
                      className="myInput"
                      placeholder="Email"
                      type="text"
                      id="email"
                    />
                  </div>
                  <div className="form-group">
                    <i className="fas fa-lock"></i>
                    <input
                      className="myInput"
                      type="password"
                      id="password"
                      placeholder="Password"
                    />
                  </div>
                  <div className="form-group">
                    <select
                      name="usertype"
                      id="usertype"
                      style={{ width: "60%" }}
                    >
                      <option value="Operator">Operator</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <br />
                  <input
                    type="submit"
                    className="butt"
                    value="CREATE ACCOUNT"
                    onClick={() => {
                      createaccount();
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="myRightCtn">
                <div>
                  <img src={SignUp} id="icon" alt="SignUp Icon" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAccount;
