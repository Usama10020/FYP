import React, { useContext, useEffect } from "react";
import Fhome from "./Fhome";
import { UserContext } from "../../Contexts/UserContext";
const Fwelcome = () => {
  const { fDeviceName, setFDeviceType } = useContext(UserContext);
  useEffect(() => {
    setFDeviceType("Firewall");
  }, []);
  return (
    <>
      <Fhome />
      <h1 style={{ textAlign: "center" }}>Welcome to, {fDeviceName}</h1>
    </>
  );
};

export default Fwelcome;
