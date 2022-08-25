import React, { useEffect, useContext } from "react";
import NavBarA from "./NavBarA";
import NavBarO from "./NavBarO";
import { UserContext } from "../../Contexts/UserContext";
const HomePage = () => {
  const { userRole, nav, setNav, isLogin } = useContext(UserContext);
  useEffect(() => {
    if (userRole === "Admin") {
      setNav(<NavBarA />);
    } else if (userRole === "Operator") {
      setNav(<NavBarO />);
    } else {
      setNav(<NavBarO />);
    }
  }, [userRole, isLogin]);
  return (
    <>
      {nav}
      <br />
      <br />
    </>
  );
};

export default HomePage;
