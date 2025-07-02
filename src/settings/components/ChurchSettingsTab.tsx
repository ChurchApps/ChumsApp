import React, { useState } from "react";
import { ChurchSettings } from "./";
import { type ChurchInterface, ApiHelper, UserHelper, Permissions } from "@churchapps/apphelper";
import { Navigate } from "react-router-dom";

export const ChurchSettingsTab = () => {
  const [church, setChurch] = useState<ChurchInterface>(null);
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const churchId = UserHelper.currentUserChurch.church.id;

  const loadData = () => {
    //const churchId = params.id;
    if (!UserHelper.checkAccess(Permissions.membershipApi.settings.edit)) setRedirectUrl("/");
    ApiHelper.get("/churches/" + churchId + "?include=permissions", "MembershipApi").then((data) => setChurch(data));
  };

  React.useEffect(loadData, [UserHelper.currentUserChurch.church.id]); //eslint-disable-line

  if (redirectUrl !== "") return <Navigate to={redirectUrl}></Navigate>;
  else {
    return (
      <>
        <ChurchSettings church={church} updatedFunction={loadData} />
      </>
    );
  }
};
