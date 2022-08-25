import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Welcome from "./Common/Welcome";
import Login from "./Common/Login";
import CreateAccount from "./Common/CreateAccount";
import AddLwRule from "./Firewall/AddLanWanRule/AddLwRule";
import EditLwRule from "./Firewall/AddLanWanRule/EditLwRule";
import AddFloatRule from "./Firewall/AddFloatingRule/AddFloatRule";
import AddStaticRoute from "./Firewall/AddStaticRouting/AddStaticRoute";
import AddVlans from "./Firewall/AddVlans/AddVlans";
import EditVlans from "./Firewall/AddVlans/EditVlans";
import EditFloatingRule from "./Firewall/AddFloatingRule/EditFloatingRule";
import EditStaticRoute from "./Firewall/AddStaticRouting/EditStaticRoute";
import EditWan from "./Firewall/Interfaces/EditWan";
import EditLan from "./Firewall/Interfaces/EditLan";
import EditInterface from "./Router/Interfaces/EditInterface";
import EditInterface1 from "./Router/Interfaces/EditInterface1";
import ForgetPassword from "./Common/ForgetPassowrd";
import EditUserInfo from "./Common/EditUserInfo";
import Lp from "./Common/Lp";
import AddNewDevice from "./Common/AddNewDevice";
import ViewRegDev from "./Common/ViewRegDev";
import PenRequest from "./Common/PenRequest";
import ViewRegUsers from "./Common/ViewRegUsers";
import PenReqStatus from "./Common/PenReqStatus.js";
import Logs from "./Common/Logs";
import ViewFirewallRule from "../Components/Firewall/ViewFirewallRules/ViewFirewallRule";
import ViewStaticRoute from "../Components/Firewall/ViewStaticRoute/ViewStaticRoute";
import ViewVlans from "../Components/Firewall/ViewVlans/ViewVlans";
import EditUserInfoOperator from "./Common/EditUserInfoOperator";
import ChangePassword from "./Common/ChangePassword";
import NotFound from "../Components/Common/NotFound";
import SelectFirewall from "./Firewall/SelectFirewall";
import SelectRouter from "./Router/SelectRouter";
import Shome from "./Switch/Shome";
import { UserContext } from "../Contexts/UserContext";
import EditDevice from "./Common/EditDevice";
import Fwelcome from "./Firewall/Fwelcome";
import Rwelcome from "./Router/Rwelcome";
import ResetPassword from "./Common/ResetPassword";
import ProtectedRoutes from "./ProtectedRoute";
import ProtectedRoutesAdmin from "./ProtectedRouteAdmin";
import ProtectedRoutesOperator from "./ProtectedRouteOperator";
import AxiosInstance from "../Axios/AxiosInstance";

const Helper = () => {
  const [userName, setUserName] = useState(
    window.localStorage.getItem("userName") || "NILL"
  );
  const [userId, setUserId] = useState(
    window.localStorage.getItem("userId") || "NILL"
  );
  const [userRole, setUserRole] = useState(
    window.localStorage.getItem("userRole") || "NILL"
  );
  const [isLogin, setIsLogin] = useState(
    window.localStorage.getItem("isLogin") || "false"
  );
  const [nav, setNav] = useState("NILL");
  const [fDeviceId, setFDeviceId] = useState(
    window.localStorage.getItem("fDeviceId") || "NILL"
  );
  const [fDeviceName, setFDeviceName] = useState(
    window.localStorage.getItem("fDeviceName") || "NILL"
  );
  const [anyDelete, setAnyDelete] = useState("false");
  const [editUser, setEditUser] = useState(
    window.localStorage.getItem("editUser") || "NILL"
  );
  const [deviceDelete, setDeviceDelete] = useState("false");
  const [editDevice, setEditDevice] = useState(
    window.localStorage.getItem("editDevice") || "NILL"
  );
  const [editDevicePort, setEditDevicePort] = useState(
    window.localStorage.getItem("editDevicePort") || ""
  );
  const [previousUrl, setPreviousUrl] = useState(
    window.localStorage.getItem("previousUrl") || "NILL"
  );
  const [fruleDelete, setFruleDelete] = useState("false");
  const [editFrule, setEditFrule] = useState(
    window.localStorage.getItem("editFrule") || "NILL"
  );
  const [fruleId, setFruleId] = useState(
    window.localStorage.getItem("fruleId") || "NILL"
  );
  const [fDeviceType, setFDeviceType] = useState(
    window.localStorage.getItem("fDeviceType") || "NILL"
  );
  const [statusId, setStatusId] = useState(
    window.localStorage.getItem("statusId") || "NILL"
  );
  const [fromStatus, setFromStatus] = useState(
    window.localStorage.getItem("fromStatus") || "NILL"
  );
  const [statusUptoDate, setStatusUptoDate] = useState(
    window.localStorage.getItem("statusUptoDate") || "NILL"
  );
  const [created, setCreated] = useState(
    window.localStorage.getItem("created") || "NILL"
  );
  const [edited, setEdited] = useState(
    window.localStorage.getItem("edited") || "NILL"
  );
  const [deleted, setDeleted] = useState(
    window.localStorage.getItem("deleted") || "NILL"
  );
  const [versions, setVersions] = useState(
    window.localStorage.getItem("versions") || "NILL"
  );

  useEffect(() => {
    window.localStorage.setItem("userName", userName);
    window.localStorage.setItem("userId", userId);
    window.localStorage.setItem("userRole", userRole);
    window.localStorage.setItem("isLogin", isLogin);
    window.localStorage.setItem("fDeviceId", fDeviceId);
    window.localStorage.setItem("previousUrl", previousUrl);
    window.localStorage.setItem("editDevice", editDevice);
    window.localStorage.setItem("editDevicePort", editDevicePort);
    window.localStorage.setItem("editUser", editUser);
    window.localStorage.setItem("fDeviceName", fDeviceName);
    window.localStorage.setItem("editFrule", editFrule);
    window.localStorage.setItem("fruleId", fruleId);
    window.localStorage.setItem("fDeviceType", fDeviceType);
    window.localStorage.setItem("statusId", statusId);
    window.localStorage.setItem("fromStatus", fromStatus);
    window.localStorage.setItem("statusUptoDate", statusUptoDate);
    window.localStorage.setItem("created", created);
    window.localStorage.setItem("edited", edited);
    window.localStorage.setItem("deleted", deleted);
    window.localStorage.setItem("versions", versions);
  }, [
    isLogin,
    userId,
    userName,
    userRole,
    fDeviceId,
    previousUrl,
    editDevice,
    editDevicePort,
    editUser,
    fDeviceName,
    editFrule,
    fruleId,
    fDeviceType,
    statusId,
    fromStatus,
    statusUptoDate,
    created,
    edited,
    deleted,
    versions,
  ]);

  const handleTabClosing = () => {
    if (window.location.href === previousUrl) {
      alert(`${window.location.href} & ${previousUrl}`);
      console.log("Reload");
    } else {
      alert(`${window.location.href} & ${previousUrl}`);
      console.log("else");
      AxiosInstance.get("/logout");
      setUserName("NILL");
      setIsLogin(false);
      setUserId("NILL");
      setUserRole("NILL");
      setFDeviceId("NILL");
      setPreviousUrl("NILL");
      setFDeviceName("NILL");
      setEditDevice("NILL");
      setFDeviceType("NILL");
      setCreated("NILL");
      setEdited("NILL");
      setDeleted("NILL");
      setStatusUptoDate("NILL");
    }
  };
  const handleReload = () => {
    setPreviousUrl(window.location.href);
  };
  useEffect(() => {
    window.addEventListener("beforeunload", handleReload);
    return () => {
      window.removeEventListener("beforeunload", handleReload);
    };
  });

  useEffect(() => {
    window.addEventListener("unload", handleTabClosing);
    return () => {
      window.removeEventListener("unload", handleTabClosing);
    };
  });

  return (
    <UserContext.Provider
      value={{
        userName,
        setUserName,
        userRole,
        setUserRole,
        userId,
        setUserId,
        fDeviceId,
        setFDeviceId,
        isLogin,
        setIsLogin,
        nav,
        setNav,
        anyDelete,
        setAnyDelete,
        editUser,
        setEditUser,
        deviceDelete,
        setDeviceDelete,
        editDevice,
        editDevicePort,
        setEditDevice,
        setEditDevicePort,
        fDeviceName,
        setFDeviceName,
        fruleDelete,
        setFruleDelete,
        editFrule,
        setEditFrule,
        fruleId,
        setFruleId,
        fDeviceType,
        setFDeviceType,
        statusId,
        setStatusId,
        fromStatus,
        setFromStatus,
        created,
        setCreated,
        edited,
        setEdited,
        deleted,
        setDeleted,
        statusUptoDate,
        setStatusUptoDate,
        versions,
        setVersions,
      }}
    >
      <Router>
        <Routes>
          <Route exact path="/" element={<Lp />} />
          <Route exact path="/forgetpassword" element={<ForgetPassword />} />
          <Route
            exact
            path="/ResetPassword/:token"
            element={<ResetPassword />}
          />
          <Route exact path="/login" element={<Login />} />

          <Route element={<ProtectedRoutes />}>
            <Route exact path="/selectFirewall" element={<SelectFirewall />} />
            <Route exact path="/selectRouter" element={<SelectRouter />} />
            <Route exact path="/sHome" element={<Shome />} />
            <Route exact path="/addFloatRule" element={<AddFloatRule />} />
            <Route exact path="/addStaticRoute" element={<AddStaticRoute />} />
            <Route exact path="/addVlans" element={<AddVlans />} />
            <Route exact path="/editFloatRule" element={<EditFloatingRule />} />
            <Route exact path="/addLwRule" element={<AddLwRule />} />
            <Route exact path="/editLwRule" element={<EditLwRule />} />
            <Route
              exact
              path="/editStaticRoute"
              element={<EditStaticRoute />}
            />
            <Route exact path="/editVlans" element={<EditVlans />} />
            <Route exact path="/editWan" element={<EditWan />} />
            <Route exact path="/editLan" element={<EditLan />} />
            <Route exact path="/editInterface" element={<EditInterface />} />
            <Route exact path="/editInterface1" element={<EditInterface1 />} />
            <Route exact path="/homepage" element={<Welcome />} />
            <Route exact path="/Fhome" element={<Fwelcome />} />
            <Route exact path="/Rhome" element={<Rwelcome />} />
            <Route exact path="/FirewallRules" element={<ViewFirewallRule />} />
            <Route exact path="/StaticRoutes" element={<ViewStaticRoute />} />
            <Route exact path="/Vlans" element={<ViewVlans />} />
            <Route exact path="/changePassword" element={<ChangePassword />} />
          </Route>

          <Route element={<ProtectedRoutesAdmin />}>
            <Route exact path="/createAccount" element={<CreateAccount />} />
            <Route exact path="/editUserAdm" element={<EditUserInfo />} />
            <Route exact path="/viewRegDev" element={<ViewRegDev />} />
            <Route path="/addNewDevice" element={<AddNewDevice />} />
            <Route exact path="/penRequest" element={<PenRequest />} />
            <Route path="/editDevice" element={<EditDevice />} />
            <Route exact path="/viewRegUsers" element={<ViewRegUsers />} />
            <Route exact path="/logs" element={<Logs />} />
          </Route>

          <Route element={<ProtectedRoutesOperator />}>
            <Route
              exact
              path="/editUserOper"
              element={<EditUserInfoOperator />}
            />
            <Route exact path="/penReqStatus" element={<PenReqStatus />} />
          </Route>

          <Route exact path="/LogOut" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
};

export default Helper;
