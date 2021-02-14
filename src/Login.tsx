import React from "react";
import { ApiHelper, UserHelper, PersonInterface } from "./components";
import { Authenticated } from "./Authenticated";
import UserContext from "./UserContext";
import { useLocation } from "react-router-dom";
import { LoginPage } from "./appBase/pageComponents/LoginPage";

export const Login: React.FC = (props: any) => {

  let { from } = (useLocation().state as any) || { from: { pathname: "/" } };

  const getCookieValue = (a: string) => {
    var b = document.cookie.match("(^|;)\\s*" + a + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
  };

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
    var jwt = search.get("jwt") || getCookieValue("jwt");
    let auth = search.get("auth");
    if (jwt === undefined || jwt === null) jwt = "";
    if (auth === undefined || auth === null) auth = "";

    return (<LoginPage auth={auth} context={context} jwt={jwt} successCallback={successCallback} />);
  } else {
    let path = from.pathname === "/" ? "/people" : from.pathname;
    return <Authenticated location={path}></Authenticated>;
  }
};
