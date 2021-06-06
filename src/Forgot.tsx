import React from "react";
import { ForgotPage } from "./appBase/pageComponents/ForgotPage";
import { EnvironmentHelper } from "./helpers";

export const Forgot = () => (<ForgotPage registerUrl={EnvironmentHelper.ChurchAppsUrl} />)
