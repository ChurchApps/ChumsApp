import React from "react";
import { GroupDetailsEdit, ServiceTimes } from ".";
import { GroupInterface, DisplayBox, UserHelper, Permissions, Loading, Locale } from "@churchapps/apphelper";
import { Grid } from "@mui/material"

interface Props { group: GroupInterface, updatedFunction: (group: GroupInterface) => void }

export const GroupDetails: React.FC<Props> = (props) => {
  const [mode, setMode] = React.useState("display");
  const handleEdit = () => setMode("edit");
  const getEditFunction = () => (UserHelper.checkAccess(Permissions.membershipApi.groups.edit)) ? handleEdit : undefined

  const handleUpdated = (g: GroupInterface) => { setMode("display"); props.updatedFunction(g); }

  const isStandard = props.group?.tags?.indexOf("standard") > -1;

  const getRows = () => {
    if (!props.group) return <Loading />
    else return (<>
      <Grid container spacing={3}>
        {isStandard && <Grid item md={6} xs={12}><label>{Locale.label("groups.groupDetails.cat")}</label> {props.group.categoryName}</Grid>}
        <Grid item md={6} xs={12}><label>{Locale.label("groups.groupDetails.name")}</label> {props.group.name}</Grid>
      </Grid>
      {isStandard && <>
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}><label>{Locale.label("groups.groupDetails.attTrack")}</label> {(props.group.trackAttendance?.toString().replace("false", "No").replace("true", "Yes") || "")}</Grid>
          <Grid item md={6} xs={12}><label>{Locale.label("groups.groupDetails.parPick")}</label> {(props.group.parentPickup?.toString().replace("false", "No").replace("true", "Yes") || "")}</Grid>
        </Grid>
        <ServiceTimes group={props.group} />
      </>}
    </>);

  }

  if (mode === "edit") return <GroupDetailsEdit group={props.group} updatedFunction={handleUpdated} />
  else return (
    <DisplayBox id="groupDetailsBox" data-cy="group-details-box" headerText={Locale.label("groups.groupDetails.groupDet")} headerIcon="group" editFunction={getEditFunction()} help="chums/groups">
      {getRows()}
    </DisplayBox>
  );
}

