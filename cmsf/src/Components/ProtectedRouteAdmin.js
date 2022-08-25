import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../Contexts/UserContext";

const ProtectedRoutesAdmin = () => {
  const { userRole, isLogin } = useContext(UserContext);
  if (isLogin === "true") {
    if (userRole === "Admin") {
      return <Outlet />;
    } else {
      return <Navigate to={-1} />;
    }
  } else {
    return <Navigate to={-1} />;
  }
};

export default ProtectedRoutesAdmin;
