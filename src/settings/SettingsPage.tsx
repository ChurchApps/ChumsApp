import React from "react";
import { UserHelper, BigLinkButton, Permissions, ChurchAppInterface, ApiHelper, ArrayHelper, EnvironmentHelper } from "./components";
import { Row } from "react-bootstrap";

export const SettingsPage = () => {
  const [churchApps, setChurchApps] = React.useState<ChurchAppInterface[]>([]);

  const getLoginLink = (church: ChurchAppInterface): string => {
    const jwt = ApiHelper.getConfig("AccessApi").jwt;

    return `${EnvironmentHelper.AccountsAppUrl}/login/?jwt=${jwt}&returnUrl=/churches/${church.churchId.toString()}/CHUMS`;
  }

  const getLinks = () => {
    const accessMangementApp = ArrayHelper.getOne(churchApps, "appName", "AccessManagement");

    let result = [];
    if (UserHelper.checkAccess(Permissions.accessApi.settings.edit)) result.push(<BigLinkButton key="import" href="/settings/import" icon="fas fa-upload" text="Import Data" />);
    if (UserHelper.checkAccess(Permissions.accessApi.settings.edit)) result.push(<BigLinkButton key="export" href="/settings/export" icon="fas fa-download" text="Export Data" />);
    if (accessMangementApp) result.push(<BigLinkButton key="managePermissions" outsideLink={true} href={getLoginLink(accessMangementApp)} icon="fas fa-lock" text="Manage Permissions" />);
    if (UserHelper.checkAccess(Permissions.attendanceApi.settings.edit)) result.push(<BigLinkButton key="churchSettings" href="/settings/church" icon="fas fa-church" text="Church Settings" />);
    return result;
  }

  React.useEffect(() => {
    UserHelper.getChurchApps().then(apps => { setChurchApps(apps) });
  }, [])

  return (
    <>
      <h1><i className="fas fa-cog"></i> Settings</h1>
      <Row className="justify-content-md-center" id="settingsBoxes">
        {getLinks()}
      </Row>
    </>
  );
}

