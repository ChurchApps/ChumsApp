import React from "react";
import { UserHelper, BigLinkButton, Permissions, EnvironmentHelper } from "./components";
import { Grid, Icon } from "@mui/material";

export const SettingsPage = () => {

  const getLinks = () => {
    const returnUrl = `/${UserHelper.currentChurch.id}/manage`;
    let result = [];
    if (UserHelper.checkAccess(Permissions.membershipApi.settings.edit)) result.push(<BigLinkButton key="import" href="https://transfer.chums.org/" icon="upload" text="Import Data" outsideLink={true} />);
    if (UserHelper.checkAccess(Permissions.membershipApi.settings.edit)) result.push(<BigLinkButton key="export" href="https://transfer.chums.org/" icon="download" text="Export Data" outsideLink={true} />);
    if (UserHelper.checkAccess(Permissions.membershipApi.settings.edit)) result.push(<BigLinkButton key="managePermissions" outsideLink={true} href={UserHelper.createAppUrl(EnvironmentHelper.AccountsAppUrl, returnUrl)} icon="lock" text="Manage Permissions" />);
    if (UserHelper.checkAccess(Permissions.attendanceApi.settings.edit)) result.push(<BigLinkButton key="churchSettings" href="/settings/church" icon="church" text="Church Settings" />);
    return result;
  }
  return (
    <>
      <h1><Icon>settings</Icon> Settings</h1>
      <Grid container spacing={2} id="settingsBoxes">
        {getLinks()}
      </Grid>
    </>
  );
}
