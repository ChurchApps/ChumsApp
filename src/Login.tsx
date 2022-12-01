import * as React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ApiHelper } from "./components";
import UserContext from "./UserContext";
import { LoginPage } from "./appBase/pageComponents/LoginPage";
import { ChurchInterface, UserInterface } from "./helpers";
import ReactGA from "react-ga";
import { EnvironmentHelper } from "./helpers";
import { Box } from "@mui/material";

export const Login: React.FC = (props: any) => {
  const [errors] = React.useState<string[]>([])
  const [cookies] = useCookies();
  const location = useLocation();

  const postChurchRegister = async (church: ChurchInterface) => {
    if (EnvironmentHelper.GoogleAnalyticsTag !== "") ReactGA.event({ category: "Church", action: "Register" });
  }

  const trackUserRegister = async (user: UserInterface) => {
    if (EnvironmentHelper.GoogleAnalyticsTag !== "") ReactGA.event({ category: "User", action: "Register" });
  }

  const context = React.useContext(UserContext);

  if (context.user === null || !ApiHelper.isAuthenticated) {
    let search = new URLSearchParams(window.location.search);
    let jwt = search.get("jwt") || cookies.jwt;
    let auth = search.get("auth");
    let returnUrl = search.get("returnUrl");
    if (!jwt) jwt = "";
    if (!auth) auth = "";
    if (!returnUrl) returnUrl = "";

    return (<Box sx={{ display: "flex", backgroundColor: "#EEE", minHeight: "100vh" }}>
      <LoginPage auth={auth} context={context} jwt={jwt} appName="CHUMS" appUrl={window.location.href} churchRegisteredCallback={postChurchRegister} userRegisteredCallback={trackUserRegister} callbackErrors={errors} returnUrl={returnUrl} />
    </Box>);
  } else {
    // @ts-ignore
    let from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }
};
