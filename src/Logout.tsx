import React from "react";
import UserContext from "./UserContext"
import { LogoutPage } from "./appBase/pageComponents";

export const Logout = () => {
  const context = React.useContext(UserContext)
  return (<LogoutPage context={context} />);
}
