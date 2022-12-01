import React, { useState, useContext } from "react";
import UserContext from "../UserContext";
import { ChurchInterface, ApiHelper, UserHelper, ChurchSettings, Permissions, Appearance, Roles, RoleEdit } from "./components"
import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Grid, Box, Icon } from "@mui/material";

export const ManageChurch = () => {
  const params = useParams();
  const [church, setChurch] = useState<ChurchInterface>(null);
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("notset");
  const context = useContext(UserContext);

  const loadData = () => {
    const churchId = params.id;
    if (churchId !== UserHelper.currentChurch.id) UserHelper.selectChurch(context, churchId);
    if (!UserHelper.checkAccess(Permissions.membershipApi.settings.edit)) setRedirectUrl("/" + churchId);
    ApiHelper.get("/churches/" + params.id + "?include=permissions", "MembershipApi").then(data => setChurch(data));
  }

  const getSidebar = () => {
    let modules: JSX.Element[] = [<Box key="appearence" sx={{ marginBottom: 2 }}><Appearance /></Box>];
    if (selectedRoleId !== "notset") {
      modules.splice(1, 0, <RoleEdit key="roleEdit" roleId={selectedRoleId} updatedFunction={() => { setSelectedRoleId("notset") }} />);
    }
    return modules;
  }

  React.useEffect(loadData, [params.id]); //eslint-disable-line

  if (redirectUrl !== "") return <Navigate to={redirectUrl}></Navigate>;
  else return (
    <>
      <h1><Icon>church</Icon> Manage {church?.name}</h1>
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <ChurchSettings church={church} updatedFunction={loadData} />
          <Roles selectRoleId={setSelectedRoleId} selectedRoleId={selectedRoleId} church={church} />
        </Grid>
        <Grid item md={4} xs={12}>
          {getSidebar()}
        </Grid>
      </Grid>
    </>
  );
}

