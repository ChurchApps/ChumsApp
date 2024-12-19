import React from "react";
import { Funds } from "./components";
import { UserHelper, Locale } from "@churchapps/apphelper";
import { Permissions } from "@churchapps/apphelper";
import { Banner } from "@churchapps/apphelper";

export const FundsPage = () => {

  if (!UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) return (<></>);
  else return (
    <>
      <Banner><h1>{Locale.label("donations.donations.funds")}</h1></Banner>
      <div id="mainContent">
        <Funds />
      </div>
    </>
  );
}
