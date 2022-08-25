import React, { useContext, useEffect } from "react";
import Rhome from "./Rhome";
import { UserContext } from "../../Contexts/UserContext";

const Rwelcome = () => {
  const { fDeviceName, setFDeviceType } = useContext(UserContext);
  useEffect(() => {
    setFDeviceType("Router");
  }, []);
  return (
    <>
      <Rhome />
      <h1 style={{ textAlign: "center" }}>Welcome to, {fDeviceName}</h1>
    </>
  );
};

export default Rwelcome;
