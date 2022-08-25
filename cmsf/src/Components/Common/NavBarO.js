import React, { useContext } from "react";
import "../../Styles/HomePage.css";
import { Link } from "react-router-dom";
import AxiosInstance from "../../Axios/AxiosInstance";
import { UserContext } from "../../Contexts/UserContext";

const NavBarO = () => {
  const {
    setUserName,
    setUserRole,
    setUserId,
    setIsLogin,
    setFDeviceId,
    userId,
    setFDeviceName,
    setEditDevice,
    setPreviousUrl,
  } = useContext(UserContext);
  var logId = userId;
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
      generatedByUserId: logId,
      dateAndTime: dateTime,
      description: `User account with User Id: "${logId}" logged out.`,
    });
  };
  const logout = () => {
    addLog();
    AxiosInstance.get("/logout").then((res) => {
      if (res.data.success === true) {
        setUserName("NILL");
        setIsLogin(false);
        setUserId("NILL");
        setUserRole("NILL");
        setFDeviceId("NILL");
        setPreviousUrl("NILL");
        setFDeviceName("NILL");
        setEditDevice("NILL");
      }
    });
  };
  return (
    <>
      <div className="usernav">
        <div className="userlogo">
          <Link to="/homepage">CMS</Link>
        </div>

        <Link className="usernavlinks" to="/homepage">
          Home
        </Link>
        <Link className="usernavlinks" to="/penReqStatus">
          Pending Requests
        </Link>
        <Link className="usernavlinks" to="/selectFirewall">
          Firewall
        </Link>
        <Link className="usernavlinks" to="/selectRouter">
          Router
        </Link>
        <Link className="usernavlinks" to="/sHome">
          Switch
        </Link>
        <div className="btn-group dropstart uusericon">
          <button
            className="uubuttonusericon"
            type="button"
            id="profile"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-user" style={{ color: "#57BAED" }}></i>
          </button>
          <ul className="dropdown-menu" aria-labelledby="profile">
            <li>
              <Link className="dropdown-item" to="/editUserOper">
                Edit User
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/ChangePassword">
                Change Password
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item"
                to="/logOut"
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavBarO;
