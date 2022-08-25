import React, { useContext } from "react";
import "../../Styles/HomePage.css";
import { Link } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext";
const RnavBar = () => {
  const { setFDeviceName, setFDeviceId, setEditDevicePort } =
    useContext(UserContext);
  return (
    <>
      <div className="usernav">
        <div className="userlogo">
          <Link to="/Rhome">Cisco 3745</Link>
        </div>
        <Link className="usernavlinks" to="/Rhome">
          Home
        </Link>
        <div className="btn-group dropdown usernavlinks">
          <button
            className="uubuttonusericon"
            type="button"
            id="profile1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Ip Assignment
          </button>
          <ul className="dropdown-menu" aria-labelledby="profile">
            <li>
              <Link className="dropdown-item" to="/editInterface">
                FastEthernet0/0
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/editInterface1">
                FastEthernet0/1
              </Link>
            </li>
          </ul>
        </div>
        <div className="btn-group dropdown usernavlinks">
          <button
            className="uubuttonusericon"
            type="button"
            id="profile1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Routing
          </button>
          <ul className="dropdown-menu" aria-labelledby="profile">
            <li>
              <Link className="dropdown-item" to="">
                Static Routing
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="">
                Dynamic Routing
              </Link>
            </li>
          </ul>
        </div>
        <div className="btn-group dropstart uusericon">
          <button
            className="uubuttonusericon"
            type="button"
            id="profile3"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-user" style={{ color: "#57BAED" }}></i>
          </button>
          <ul className="dropdown-menu" aria-labelledby="profile">
            <li>
              <Link
                className="dropdown-item"
                to="/homepage"
                onClick={() => {
                  setFDeviceId("NILL");
                  setFDeviceName("NILL");
                  setEditDevicePort("");
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

export default RnavBar;
