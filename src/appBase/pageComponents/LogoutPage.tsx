import React from "react";
import "./Login.css"
import { ApiHelper } from "../helpers";
import { UserContextInterface } from "../interfaces";

interface Props { context: UserContextInterface, }

export const LogoutPage: React.FC<Props> = (props) => {
    document.cookie = "jwt=";
    document.cookie = "email=";
    document.cookie = "name=";
    ApiHelper.clearPermissions();
    props.context.setUserName("");
    setTimeout(() => { window.location.href = "/"; }, 300);
    return <></>;
}