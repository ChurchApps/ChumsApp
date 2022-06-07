import React from "react";
import { UserHelper, BigLinkButton, Permissions, EnvironmentHelper, Wrapper } from "./components";
import { Grid } from "@mui/material";

export const SettingsPage = () => {

  const getLinks = () => {
    const returnUrl = `/${UserHelper.currentChurch.id}/manage`;
    let result = [];
    if (UserHelper.checkAccess(Permissions.accessApi.settings.edit)) result.push(<BigLinkButton key="import" href="https://transfer.chums.org/" icon="fas fa-upload" text="Import Data" outsideLink={true} />);
    if (UserHelper.checkAccess(Permissions.accessApi.settings.edit)) result.push(<BigLinkButton key="export" href="https://transfer.chums.org/" icon="fas fa-download" text="Export Data" outsideLink={true} />);
    if (UserHelper.checkAccess(Permissions.accessApi.settings.edit)) result.push(<BigLinkButton key="managePermissions" outsideLink={true} href={UserHelper.createAppUrl(EnvironmentHelper.AccountsAppUrl, returnUrl)} icon="fas fa-lock" text="Manage Permissions" />);
    if (UserHelper.checkAccess(Permissions.attendanceApi.settings.edit)) result.push(<BigLinkButton key="churchSettings" href="/settings/church" icon="fas fa-church" text="Church Settings" />);
    return result;
  }

  return (
    <Wrapper pageTitle="Settings">
      <h1><i className="fas fa-cog"></i> Settings</h1>
      <Grid container className="justify-content-md-center" id="settingsBoxes">
        {getLinks()}
      </Grid>
    </Wrapper>
  );
}

