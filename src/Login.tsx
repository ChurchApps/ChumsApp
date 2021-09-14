import * as React from "react";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ApiHelper, UserHelper, PersonInterface } from "./components";
import { Authenticated } from "./Authenticated";
import UserContext from "./UserContext";
import { LoginPage } from "./appBase/pageComponents/LoginPage";
import { ChurchInterface, UserInterface } from "./helpers";
import ReactGA from "react-ga";
import { EnvironmentHelper } from "./helpers";

export const Login: React.FC = (props: any) => {
  const [errors, setErrors] = React.useState<string[]>([])
  const [cookies] = useCookies();
  let { from } = (useLocation().state as any) || { from: { pathname: "/" } };

  const successCallback = async () => {
    try {
      if (UserHelper.currentChurch?.apis?.length === 0) {
        setErrors([`You don't have access of ${UserHelper.currentChurch.name}.`])
        return
      }
      const person: PersonInterface = await ApiHelper.get(`/people/${UserHelper.currentChurch.personId}`, "MembershipApi");
      UserHelper.person = person;
      context.setUserName(UserHelper.currentChurch.id.toString());
    } catch (err) {
      context.setUserName(UserHelper.currentChurch.id.toString());
      console.log(err)
    }
  }

  const postChurchRegister = async (church: ChurchInterface) => {
    await ApiHelper.post("/churchApps/register", { appName: "CHUMS" }, "AccessApi");
    if (EnvironmentHelper.GoogleAnalyticsTag !== "") ReactGA.event({ category: "Church", action: "Register" });
  }

  const trackUserRegister = async (user: UserInterface) => {
    if (EnvironmentHelper.GoogleAnalyticsTag !== "") ReactGA.event({ category: "User", action: "Register" });
  }

  const context = React.useContext(UserContext);

  if (context.userName === "" || !ApiHelper.isAuthenticated) {
    let search = new URLSearchParams(props.location.search);
    let jwt = search.get("jwt") || cookies.jwt;
    let auth = search.get("auth");
    if (!jwt) jwt = "";
    if (!auth) auth = "";

    return (<LoginPage auth={auth} context={context} jwt={jwt} appName="CHUMS" appUrl={window.location.href} loginSuccessOverride={successCallback} churchRegisteredCallback={postChurchRegister} userRegisteredCallback={trackUserRegister} callbackErrors={errors} />);
  } else {
    let path = from.pathname === "/" ? "/people" : from.pathname;
    return <Authenticated location={path}></Authenticated>;
  }
};
