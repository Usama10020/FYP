import React, { useContext, useEffect } from "react";
import HomePage from "./HomePage";
import { UserContext } from "../../Contexts/UserContext";

const Welcome = () => {
  const {
    userName,
    setEditDevice,
    setFDeviceName,
    setEditUser,
    setFDeviceId,
    setFruleId,
    setFDeviceType,
    setStatusId,
    setCreated,
    setEdited,
    setDeleted,
    setFromStatus,
  } = useContext(UserContext);
  useEffect(() => {
    setEditDevice("NILL");
    setFDeviceName("NILL");
    setEditUser("NILL");
    setFDeviceId("NILL");
    setFruleId("NILL");
    setFDeviceType("NILL");
    setStatusId("NILL");
    setCreated("NILL");
    setEdited("NILL");
    setDeleted("NILL");
    setFromStatus("NILL");
  }, []);
  return (
    <>
      <HomePage />
      <h1 style={{ textAlign: "center" }}>Welcome, {userName}</h1>
    </>
  );
};

export default Welcome;
