import React, { useState } from "react";
import { ChurchInterface, ApiHelper, UserHelper, ChurchSettings, Permissions, Appearance, Roles, RoleEdit, DisplayBox } from "./components"
import { Navigate } from "react-router-dom";
import { Grid, Box, Icon } from "@mui/material";

export const ManageChurch = () => {
  const [church, setChurch] = useState<ChurchInterface>(null);
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("notset");

  const jwt = ApiHelper.getConfig("MembershipApi").jwt;
  const churchId = UserHelper.currentUserChurch.church.id;

  const loadData = () => {
    //const churchId = params.id;
    if (!UserHelper.checkAccess(Permissions.membershipApi.settings.edit)) setRedirectUrl("/");
    ApiHelper.get("/churches/" + churchId + "?include=permissions", "MembershipApi").then(data => setChurch(data));
  }

  const getSidebar = () => {
    let modules: JSX.Element[] = [<Box key="appearence" sx={{ marginBottom: 2 }}><Appearance /></Box>];
    if (selectedRoleId !== "notset") {
      modules.splice(1, 0, <RoleEdit key="roleEdit" roleId={selectedRoleId} updatedFunction={() => { setSelectedRoleId("notset") }} />);
    }
    modules.push(<DisplayBox headerIcon="link" headerText="Tools" editContent={false}>
      <table className="table">
        <tbody>
          <tr><td>
            <a href={`https://transfer.chums.org/login?jwt=${jwt}&churchId=${churchId}`} target="_blank" rel="noreferrer noopener" style={{ display: "flex" }}><Icon sx={{ marginRight: "5px" }}>play_arrow</Icon>Import/Export</a>
          </td></tr>
        </tbody>
      </table>
    </DisplayBox>);
    return modules;
  }

  React.useEffect(loadData, [UserHelper.currentUserChurch.church.id]); //eslint-disable-line

  if (redirectUrl !== "") return <Navigate to={redirectUrl}></Navigate>;
  else return (
    <>
      <h1><Icon>church</Icon> Manage {church?.name}</h1>
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <ChurchSettings church={church} updatedFunction={loadData} />
          {church && <Roles selectRoleId={setSelectedRoleId} selectedRoleId={selectedRoleId} church={church} />}
        </Grid>
        <Grid item md={4} xs={12}>
          {getSidebar()}
        </Grid>
      </Grid>
    </>
  );
}

