import React from "react";
import UserContext from "./UserContext";

import { ApiHelper } from "./components";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Login } from "./Login";

import { Authenticated } from "./Authenticated";
import { Logout } from "./Logout";
import { AnalyticsHelper } from "./appBase/helpers";

export const ControlPanel = () => {

  const location = (typeof(window) === "undefined") ? null : window.location;
  AnalyticsHelper.init();
  React.useEffect(() => { AnalyticsHelper.logPageView() }, [location]);

  let user = React.useContext(UserContext).user; //to force rerender on login
  if (user === null) console.log("Church is null");
  return (
    <Routes>
      <Route path="/logout" element={<Logout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<RequireAuth><Authenticated /></RequireAuth>} />
    </Routes>
  );
};

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const location = useLocation()
  if (!ApiHelper.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

