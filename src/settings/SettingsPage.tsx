import React from "react";
import { UserHelper, BigLinkButton, Permissions, EnvironmentHelper } from "./components";
import { Row } from "react-bootstrap";

export const SettingsPage = () => {

  const getLinks = () => {
    const returnUrl = `/${UserHelper.currentChurch.id}/manage`;
    let result = [];
    if (UserHelper.checkAccess(Permissions.accessApi.settings.edit)) result.push(<BigLinkButton key="import" href="/settings/import" icon="fas fa-upload" text="Import Data" />);
    if (UserHelper.checkAccess(Permissions.accessApi.settings.edit)) result.push(<BigLinkButton key="export" href="/settings/export" icon="fas fa-download" text="Export Data" />);
    if (UserHelper.checkAccess(Permissions.accessApi.settings.edit)) result.push(<BigLinkButton key="managePermissions" outsideLink={true} href={UserHelper.createAppUrl(EnvironmentHelper.AccountsAppUrl, returnUrl)} icon="fas fa-lock" text="Manage Permissions" />);
    if (UserHelper.checkAccess(Permissions.attendanceApi.settings.edit)) result.push(<BigLinkButton key="churchSettings" href="/settings/church" icon="fas fa-church" text="Church Settings" />);
    return result;
  }

  return (
    <>
      <h1><i className="fas fa-cog"></i> Settings</h1>
      <Row className="justify-content-md-center" id="settingsBoxes">
        {getLinks()}
      </Row>
    </>
  );
}

