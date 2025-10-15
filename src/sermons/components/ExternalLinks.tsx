import React from "react";
import { Icon } from "@mui/material";
import { DisplayBox } from "@churchapps/apphelper";
import { Permissions } from "@churchapps/helpers";
import { Link } from "react-router-dom";
import { TableList } from "./TableList";

interface Props { updatedFunction?: () => void, churchId:string }

export const ExternalLinks: React.FC<Props> = (props) => {

  const getChurchEditSettingRows = (): React.ReactElement[] => {
    if (!Permissions.membershipApi.settings.edit) return [];
    const currentHost = window.location.origin;
    const streamUrl = `${currentHost}/sermon/times`;
    return [
      <tr key="appearance"><td><Link to="/settings/branding" style={{ display: "flex", alignItems: "center" }}><Icon sx={{ marginRight: "5px" }}>edit</Icon>Customize Appearance</Link></td></tr>,
      <tr key="users"><td><Link to={`/${props.churchId}/settings`} style={{ display: "flex", alignItems: "center" }}><Icon sx={{ marginRight: "5px" }}>edit</Icon>Edit Users</Link></td></tr>,
      <tr key="stream"><td><a href={streamUrl} style={{ display: "flex", alignItems: "center" }}><Icon sx={{ marginRight: "5px" }}>live_tv</Icon>View Your Stream</a></td></tr>,
    ];
  };

  return (
    <DisplayBox headerIcon="link" headerText="External Resources" editContent={false}>
      <TableList rows={getChurchEditSettingRows()} />
    </DisplayBox>
  );
};
