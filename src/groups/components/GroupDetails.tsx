import React from "react";
import { GroupInterface, DisplayBox, GroupDetailsEdit, ServiceTimes, UserHelper, Permissions, Loading } from ".";
import { Grid } from "@mui/material"

interface Props { group: GroupInterface, updatedFunction: (group: GroupInterface) => void }

export const GroupDetails: React.FC<Props> = (props) => {
  const [mode, setMode] = React.useState("display");
  const handleEdit = () => setMode("edit");
  const getEditFunction = () => (UserHelper.checkAccess(Permissions.membershipApi.groups.edit)) ? handleEdit : null

  const handleUpdated = (g: GroupInterface) => { setMode("display"); props.updatedFunction(g); }

  const getRows = () => {
    if (!props.group) return <Loading />
    else return (<>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}><label>Category:</label> {props.group.categoryName}</Grid>
        <Grid item md={6} xs={12}><label>Name:</label> {props.group.name}</Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}><label>Track Attendance:</label> {(props.group.trackAttendance?.toString().replace("false", "No").replace("true", "Yes") || "")}</Grid>
        <Grid item md={6} xs={12}><label>Parent Pickup:</label> {(props.group.parentPickup?.toString().replace("false", "No").replace("true", "Yes") || "")}</Grid>
      </Grid>
      <ServiceTimes group={props.group} />
    </>);

  }

  if (mode === "edit") return <GroupDetailsEdit group={props.group} updatedFunction={handleUpdated} />
  else return (
    <DisplayBox id="groupDetailsBox" data-cy="group-details-box" headerText="Group Details" headerIcon="fas fa-list" editFunction={getEditFunction()}>
      {getRows()}
    </DisplayBox>
  );
}

