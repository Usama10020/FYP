import React, { useContext } from "react";
import "../../Styles/HomePage.css";
import { Link } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext";

const FnavBar = () => {
  const { setFDeviceName, setFDeviceId } = useContext(UserContext);
  return (
    <>
      <div className="usernav">
        <div className="userlogo">
          <Link to="/Fhome">pfSense</Link>
        </div>
        <Link className="usernavlinks" to="/Fhome">
          Home
        </Link>
        <div className="btn-group dropdown usernavlinks">
          <button
            className="uubuttonusericon"
            type="button"
            id="profile12"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Ip Assignment
          </button>
          <ul className="dropdown-menu" aria-labelledby="profile">
            <li>
              <Link className="dropdown-item" to="/editWan">
                WAN
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/editLan">
                LAN
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
              <Link className="dropdown-item" to="/StaticRoutes">
                Static Routes
              </Link>
            </li>
          </ul>
        </div>
        <div className="btn-group dropdown usernavlinks">
          <button
            className="uubuttonusericon"
            type="button"
            id="profile2"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Virtual Interface
          </button>
          <ul className="dropdown-menu" aria-labelledby="profile">
            <li>
              <Link className="dropdown-item" to="/Vlans">
                VLANs
              </Link>
            </li>
          </ul>
        </div>
        <div className="btn-group dropdown usernavlinks">
          <button
            className="uubuttonusericon"
            type="button"
            id="profile"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Firewall Rules
          </button>
          <ul className="dropdown-menu" aria-labelledby="profile">
            <li>
              <Link className="dropdown-item" to="/FirewallRules">
                Rules
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

export default FnavBar;
