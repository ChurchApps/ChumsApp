import React from "react";
import { MinistryList } from "./components/MinistryList";
import { Locale } from "@churchapps/apphelper";
import { Banner } from "@churchapps/apphelper";

export const PlansPage = () => {

  const a=true;

  return (<>
    <Banner><h1>{Locale.label("plans.plansPage.selMin")}</h1></Banner>
    <div id="mainContent">
      <MinistryList />
    </div>
  </>);
}

