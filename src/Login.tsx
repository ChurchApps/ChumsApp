import React from "react";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ApiHelper, UserHelper, PersonInterface } from "./components";
import { Authenticated } from "./Authenticated";
import UserContext from "./UserContext";
import { LoginPage } from "./appBase/pageComponents/LoginPage";

export const Login: React.FC = (props: any) => {
  const [cookies] = useCookies();
  let { from } = (useLocation().state as any) || { from: { pathname: "/" } };

  const successCallback = () => {
    ApiHelper.get("/people/userid/" + UserHelper.user.id, "MembershipApi").then((person: PersonInterface) => {
      UserHelper.person = person;
      context.setUserName(UserHelper.currentChurch.id.toString());
    }).catch(err => {
      context.setUserName(UserHelper.currentChurch.id.toString());
      console.log(err)
    });
  }

  const context = React.useContext(UserContext);

  if (context.userName === "" || !ApiHelper.isAuthenticated) {
    let search = new URLSearchParams(props.location.search);
    let jwt = search.get("jwt") || cookies.jwt;
    let auth = search.get("auth");
    if (!jwt) jwt = "";
    if (!auth) auth = "";

    return (<LoginPage auth={auth} context={context} jwt={jwt} successCallback={successCallback} appName="CHUMS" />);
  } else {
    let path = from.pathname === "/" ? "/people" : from.pathname;
    return <Authenticated location={path}></Authenticated>;
  }
};
