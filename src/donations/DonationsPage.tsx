import React from "react";
import { UserHelper,Locale } from "@churchapps/apphelper";
import { ReportWithFilter,  Permissions } from "@churchapps/apphelper";

import { Banner } from "@churchapps/apphelper";

export const DonationsPage = () => {

  if (!UserHelper.checkAccess(Permissions.givingApi.donations.viewSummary)) return (<></>);
  else return (
    <>
      <Banner><h1>{Locale.label("donations.donationsPage.don")}</h1></Banner>
      <div id="mainContent">
        <ReportWithFilter keyName="donationSummary" autoRun={true} />
      </div>
    </>
  );
}
