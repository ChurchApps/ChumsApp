import React from "react";
import UserContext from "./UserContext";

import { ApiHelper } from "./components";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { Forgot } from "./Forgot";
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


  var user = React.useContext(UserContext).userName; //to force rerender on login
  if (user === null) return null;
  return (
    <Switch>
      <Route path="/logout">
        <Logout />
      </Route>
      <Route path="/login" component={Login}></Route>
      <Route path="/forgot">
        <Forgot />
      </Route>
      <PrivateRoute path="/"></PrivateRoute>
    </Switch>
  );
};

const PrivateRoute: React.FC<Props> = ({ path }) => {
  return (
    <Route
      path={path}
      render={({ location }) => {
        return (ApiHelper.isAuthenticated)
          ? (<Authenticated location={location.pathname}></Authenticated>)
          : (<Redirect to={{ pathname: "/login", state: { from: location, }, }} ></Redirect>);
      }}
    ></Route>
  );
};
