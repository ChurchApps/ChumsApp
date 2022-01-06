import React from "react";
import UserContext from "./UserContext";

import { ApiHelper } from "./components";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Login } from "./Login";

import { Authenticated } from "./Authenticated";
import { Logout } from "./Logout";
import ReactGA from "react-ga";
import { EnvironmentHelper } from "./helpers";

interface Props { path?: string; }

export const ControlPanel = () => {

  const location = useLocation();
  if (EnvironmentHelper.GoogleAnalyticsTag !== "") {
    ReactGA.initialize(EnvironmentHelper.GoogleAnalyticsTag);
    ReactGA.pageview(window.location.pathname + window.location.search);
  }
  React.useEffect(() => { if (EnvironmentHelper.GoogleAnalyticsTag !== "") ReactGA.pageview(location.pathname + location.search); }, [location]);

  let user = React.useContext(UserContext).userName; //to force rerender on login
  if (user === null) return null;
  return (
    <Routes>
      <Route path="/logout" element={<Logout />} />
      <Route path="/login" element={<Login />} />
      {getAuth()}
    </Routes>
  );
};

const getAuth = () => {
  if (ApiHelper.isAuthenticated) return <Route path="/*" element={<Authenticated />}></Route>
  else return <Route path="/" element={<Navigate replace to="/login" />}></Route>
}

