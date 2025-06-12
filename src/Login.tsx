import * as React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ApiHelper, UserHelper } from "@churchapps/apphelper";
import UserContext from "./UserContext";
import { LoginPage, Permissions } from "@churchapps/apphelper";
import { Alert, Box } from "@mui/material";
import { EnvironmentHelper } from "./helpers";

export const Login: React.FC = (props: any) => {
  const [errors] = React.useState<string[]>([])
  const [cookies] = useCookies();
  const location = useLocation();

  const context = React.useContext(UserContext);

  let search = new URLSearchParams(window.location.search);
  let returnUrl = search.get("returnUrl");
  if (context.user === null || !ApiHelper.isAuthenticated) {
    let jwt = search.get("jwt") || cookies.jwt;
    let auth = search.get("auth");
    if (!jwt) jwt = "";
    if (!auth) auth = "";
    if (!returnUrl) returnUrl = "";

    return (<Box sx={{ display: "flex", backgroundColor: "#EEE", minHeight: "100vh" }}>
      <div style={{ marginLeft: "auto", marginRight: "auto" }}>
        {process.env.REACT_APP_STAGE === "demo" && (<Alert severity="error" style={{ marginTop: 50 }}>
          <b>Demo:</b> This is the demo environment.  All data is erased nightly.<br />
          You can log into a test church with the credentials demo@chums.org / password .
        </Alert>)}
        <LoginPage auth={auth} context={context} jwt={jwt} appName="CHUMS" appUrl={window.location.href} callbackErrors={errors} returnUrl={returnUrl} />
      </div>
    </Box>);
  } else {
    // @ts-ignore
    let from = location.state?.from?.pathname || "/";
    
    // Priority: 1. URL from React Router state, 2. returnUrl query param, 3. default home
    if (from && from !== "/") {
      // If user was redirected from a specific page, return them there
      if (!UserHelper.checkAccess(Permissions.membershipApi.people.view) && from !== "/profile")
        return <Navigate to="/profile" replace />;
      else
        return <Navigate to={from} replace />;
    } else if (returnUrl) {
      return <Navigate to={returnUrl} replace />;
    } else {
      // Default redirect based on permissions
      if (!UserHelper.checkAccess(Permissions.membershipApi.people.view))
        return <Navigate to="/profile" replace />;
      else
        return <Navigate to="/" replace />;
    }
  }
};
