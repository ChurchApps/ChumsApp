import React from "react";
import UserContext from "./UserContext";

import { ApiHelper, ErrorMessages } from "@churchapps/apphelper";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Login } from "./Login";

import { Authenticated } from "./Authenticated";
import { Logout } from "./Logout";
import { AnalyticsHelper, UserHelper, ErrorHelper, ErrorLogInterface, ErrrorAppDataInterface } from "@churchapps/apphelper";
import { UI } from "./ui/Test";
import { Pingback } from "./Pingback";


export const ControlPanel = () => {
  const [errors, setErrors] = React.useState([]);

  const location = (typeof (window) === "undefined") ? null : window.location;
  AnalyticsHelper.init();
  React.useEffect(() => { AnalyticsHelper.logPageView() }, [location]);

  const getErrorAppData = () => {
    const result: ErrrorAppDataInterface = {
      churchId: UserHelper.currentUserChurch?.church?.id || "",
      userId: UserHelper.user?.id || "",
      originUrl: location?.toString(),
      application: "CHUMS"
    }
    return result;
  }

  const customErrorHandler = (error: ErrorLogInterface) => {
    console.log("customErrorHandler", error);
    //disabled for now.  This causes infinite loops when the error happens on useEffect page loads.

    /*
    switch (error.errorType) {
      case "401": setErrors(["Access denied when loading " + error.message]); break;
      case "500": setErrors(["Server error when loading " + error.message]); break;
    }*/

  }

  ErrorHelper.init(getErrorAppData, customErrorHandler);

  let user = React.useContext(UserContext).user; //to force rerender on login
  if (user === null) console.log("Church is null");
  return (
    <>
      <ErrorMessages errors={errors} />
      <Routes>
        <Route path="/pingback" element={<Pingback />} />
        <Route path="/ui" element={<UI />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<RequireAuth><Authenticated /></RequireAuth>} />
      </Routes>
    </>
  );
};

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const location = useLocation()
  if (!ApiHelper.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

