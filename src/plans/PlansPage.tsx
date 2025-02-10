import React from "react";
import { MinistryList } from "./components/MinistryList";
import { DisplayBox, Locale } from "@churchapps/apphelper";
import { Banner } from "@churchapps/apphelper";
import { Link } from "react-router-dom";

export const PlansPage = () => {

  const a=true;

  return (<>
    <Banner><h1>{Locale.label("plans.plansPage.selMin")}</h1></Banner>
    <div id="mainContent">
      <MinistryList />
    </div>
  </>);
}

