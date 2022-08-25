import React from "react";
import "../../Styles/Lp.css";
import { Link } from "react-router-dom";
const Lp = () => {
  return (
    <div className="uubody">
      <header>
        <nav className="uucontainer">
          <p className="logo" style={{ color: "#39ace7" }}>
            CMS
          </p>
        </nav>
      </header>
      <main>
        <div className="main-content">
          <h1>CENTRAL MANAGEMENT SYSTEM</h1>
          <p>
            The objective of this project is to develop a centralized management
            system through which we can manage and configure network devices
            from single portal.
          </p>
          <div className="main-buttons">
            <Link
              to="/login"
              className="main-button primary-button"
              style={{ backgroundColor: "#39ace7" }}
            >
              GET STARTED
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Lp;
