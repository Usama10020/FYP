import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../Contexts/UserContext";

const ProtectedRoutes = () => {
  const { isLogin } = useContext(UserContext);
  if (isLogin === "true") {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoutes;
