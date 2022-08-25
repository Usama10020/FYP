import React, { useState, useEffect } from "react";
import "../../Styles/ViewRegDev.css";
import VruSingleRow from "./VruSingleRow";
import HomePage from "./HomePage";
import AxiosInstance from "../../Axios/AxiosInstance";
import { UserContext } from "../../Contexts/UserContext";
import { useContext } from "react";

const ViewRegUsers = () => {
  const { anyDelete, setAnyDelete } = useContext(UserContext);
  const [data, setData] = useState([]);
  useEffect(() => {
    AxiosInstance.get("/admin/users")
      .then((res) => {
        if (res.data.success === true) {
          setData(res.data.users);
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
    setAnyDelete("false");
  }, [anyDelete]);

  return (
    <>
      <HomePage />
      <div className="viewregdevbody">
        <div className="container-xl">
          <div className="utable-responsive">
            <div className="utable-wrapper">
              <div className="utable-title">
                <div className="row">
                  <div className="col-sm-8">
                    <h2 style={{ color: "#39ace7" }}>Registered Users</h2>
                  </div>
                </div>
              </div>
              <table className="table table-striped table-hover table-bordered">
                <thead>
                  <tr>
                    <th>Sr. #</th>
                    <th>User Id</th>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>User Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((test, index) => {
                    return (
                      <VruSingleRow
                        key={index + 1}
                        sr={index + 1}
                        id={test.userId}
                        un={test.name}
                        em={test.email}
                        ut={test.role}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewRegUsers;
