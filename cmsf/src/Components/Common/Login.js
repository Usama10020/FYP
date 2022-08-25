import React, { useContext } from "react";
import Logicon from "../../Icons/Logo2.png";
import "../../Styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import AxiosInstance from "../../Axios/AxiosInstance";
import { UserContext } from "../../Contexts/UserContext";

const Login = () => {
  const { setUserName, setUserRole, setUserId, setIsLogin } =
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
      generatedByUserId: document.getElementById("login").value,
      dateAndTime: dateTime,
      description: `User with User Id: "${
        document.getElementById("login").value
      }" logged in.`,
    });
    navigate("/homePage");
  };

  const login = () => {
    AxiosInstance.post("/login", {
      userId: document.getElementById("login").value,
      password: document.getElementById("password").value,
    })
      .then((res) => {
        if (res.data.success === true) {
          setUserName(res.data.user.name);
          setIsLogin("true");
          setUserId(res.data.user.userId);
          setUserRole(res.data.user.role);
          addLog();
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };
  return (
    <div className="uflex-container">
      <div className="uflex-item">
        <div className="uwrapper fadeInDown ulogin">
          <div id="formContent">
            <div className="fadeIn first">
              <img src={Logicon} id="icon" alt="User Icon" />
            </div>

            <input
              type="text"
              id="login"
              className="fadeIn second"
              name="login"
              placeholder="User ID"
              autoComplete="off"
            />
            <input
              type="password"
              id="password"
              className="fadeIn third"
              name="login"
              placeholder="Password"
              autoComplete="off"
            />
            <br />
            <br />
            <Link to="/forgetPassword">Forget Password?</Link>
            <br />
            <br />
            <input
              type="submit"
              className="fadeIn fourth"
              value="Log In"
              onClick={() => {
                login();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
